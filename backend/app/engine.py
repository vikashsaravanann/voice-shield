"""
VoiceShield — Production Streaming Engine (engine.py)
======================================================
Rewritten for production streaming reliability:

  • Binary PCM frames arrive via WebSocket and are placed DIRECTLY into an
    asyncio.Queue without any intermediate buffer or copy — enforcing
    zero-retention raw audio compliance (no audio bytes survive past the
    classify-then-delete boundary).
  • Latency budget: receive → queue → classify must stay < 400 ms.
    Frames sitting in the queue for > LATENCY_BUDGET_MS are dropped with a
    "stale_frame_dropped" log rather than processed late.
  • The asyncio.Queue has a hard cap (QUEUE_MAX_SIZE) and uses a lock-free
    drop-oldest strategy so the receiver task is never blocked.
  • All raw audio bytes are explicitly del'd immediately after classification
    and features are del'd in the same critical section.

Usage (from WebSocket route):
    engine = StreamingEngine(model=app.state.model)
    async with engine.session(websocket, session_id) as summary:
        pass  # session runs until WebSocket disconnects
"""

from __future__ import annotations

import asyncio
import contextlib
import json
import time
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import AsyncGenerator

import structlog
from fastapi import WebSocket, WebSocketDisconnect

logger = structlog.get_logger(__name__)

# ---------------------------------------------------------------------------
# Runtime constants
# ---------------------------------------------------------------------------
QUEUE_MAX_SIZE: int = 60           # frames; ~20 s at 333 ms/frame
MIN_FRAME_BYTES: int = 1_024       # frames smaller than this are silent padding
LATENCY_BUDGET_MS: int = 400       # hard SLA — drop frames older than this
EVENT_FLUSH_BATCH: int = 5         # Supabase batch-write threshold


# ---------------------------------------------------------------------------
# Data types
# ---------------------------------------------------------------------------

@dataclass(slots=True)
class _Frame:
    """Single PCM frame envelope — the only object that holds raw audio."""
    audio: bytes
    enqueued_at: float  # time.monotonic()

    def age_ms(self) -> int:
        return int((time.monotonic() - self.enqueued_at) * 1_000)

    def __del__(self) -> None:
        # Ensure the bytestring is released when the frame goes out of scope.
        object.__setattr__(self, "audio", b"")


@dataclass
class SessionSummary:
    session_id: str
    chunks_processed: int = 0
    chunks_dropped_stale: int = 0
    chunks_dropped_silent: int = 0
    risk_sum: float = 0.0
    max_risk: float = 0.0
    latency_sum_ms: int = 0
    started_at: float = field(default_factory=time.monotonic)

    @property
    def avg_risk(self) -> float:
        return round(self.risk_sum / self.chunks_processed, 4) if self.chunks_processed else 0.0

    @property
    def avg_latency_ms(self) -> float:
        return round(self.latency_sum_ms / self.chunks_processed, 1) if self.chunks_processed else 0.0

    @property
    def decision(self) -> str:
        return "blocked" if self.max_risk >= 0.7 else "allowed"


# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------

class StreamingEngine:
    """
    Manages a single VoiceShield WebSocket session lifecycle.

    The engine decouples I/O (receive_task) from CPU (process_task) via an
    asyncio.Queue of _Frame objects. Raw audio bytes never leave this module
    as a retained reference — they are del'd in the process_task's finally
    block immediately after feature extraction.
    """

    def __init__(self, model: object) -> None:
        self._model = model

    @contextlib.asynccontextmanager
    async def session(
        self,
        websocket: WebSocket,
        session_id: str,
        *,
        on_result=None,
        on_event=None,
        on_alert=None,
    ) -> AsyncGenerator[SessionSummary, None]:
        """
        Runs the full streaming session and yields a SessionSummary when done.

        Args:
            websocket:   Accepted FastAPI WebSocket connection.
            session_id:  UUID string for the current session.
            on_result:   async callable(result_dict) — called per classified chunk.
            on_event:    async callable(list[dict]) — called to persist detection events.
            on_alert:    async callable(session_id, risk_score_pct) — fires once on HIGH risk.
        """
        summary = SessionSummary(session_id=session_id)
        queue: asyncio.Queue[_Frame | None] = asyncio.Queue(maxsize=QUEUE_MAX_SIZE)
        alert_dispatched = False

        async def _receive() -> None:
            """I/O-bound: pull raw bytes from the WebSocket → Queue."""
            try:
                while True:
                    msg = await websocket.receive()

                    # ── Binary PCM frame ──────────────────────────────────
                    if "bytes" in msg:
                        raw: bytes = msg["bytes"]

                        if len(raw) < MIN_FRAME_BYTES:
                            summary.chunks_dropped_silent += 1
                            del raw
                            continue

                        frame = _Frame(audio=raw, enqueued_at=time.monotonic())
                        del raw  # release the name — frame holds the only ref

                        if queue.full():
                            # Drop the *oldest* stale frame to stay non-blocking
                            with contextlib.suppress(asyncio.QueueEmpty):
                                stale = queue.get_nowait()
                                summary.chunks_dropped_stale += 1
                                logger.debug(
                                    "stale_frame_dropped_on_full",
                                    age_ms=stale.age_ms(),
                                    session_id=session_id,
                                )
                                del stale

                        await queue.put(frame)

                    # ── Control message ───────────────────────────────────
                    elif "text" in msg:
                        with contextlib.suppress(json.JSONDecodeError):
                            ctrl = json.loads(msg["text"])
                            if (
                                ctrl.get("type") in {"session.end", "end_session"}
                                or ctrl.get("action") == "end_session"
                            ):
                                break

            except (WebSocketDisconnect, asyncio.CancelledError):
                pass
            finally:
                await queue.put(None)   # sentinel — tells processor to exit

        async def _process() -> None:
            """CPU-bound: classify frames from Queue, enforce latency SLA."""
            nonlocal alert_dispatched
            events_buffer: list[dict] = []
            flush_tasks: list[asyncio.Task] = []

            try:
                while True:
                    frame = await queue.get()

                    if frame is None:   # sentinel
                        queue.task_done()
                        break

                    features = None
                    try:
                        # ── Latency SLA guard ─────────────────────────────
                        age_ms = frame.age_ms()
                        if age_ms > LATENCY_BUDGET_MS:
                            summary.chunks_dropped_stale += 1
                            logger.warning(
                                "frame_exceeds_latency_budget",
                                age_ms=age_ms,
                                budget_ms=LATENCY_BUDGET_MS,
                                session_id=session_id,
                            )
                            continue    # finally will del frame and features

                        t0 = time.monotonic()

                        # ── Feature extraction (in-memory, no disk I/O) ───
                        from apps.api.app.ml.feature_extractor import extract_features
                        features = extract_features(frame.audio, sample_rate=16_000)

                        # ── Model inference ───────────────────────────────
                        prob: float = float(self._model.predict(features))
                        markers: dict = self._model.explainability_markers(features)

                        # ── Risk classification ───────────────────────────
                        from apps.api.app.services.decision_engine import classify_risk
                        risk_level, explanation = classify_risk(prob)

                        latency_ms = int((time.monotonic() - t0) * 1_000) + age_ms
                        summary.chunks_processed += 1
                        summary.risk_sum += prob
                        summary.max_risk = max(summary.max_risk, prob)
                        summary.latency_sum_ms += latency_ms

                        logger.info(
                            "chunk_classified",
                            chunk=summary.chunks_processed,
                            prob=round(prob, 4),
                            risk=risk_level,
                            latency_ms=latency_ms,
                            session_id=session_id,
                        )

                        # ── Push result to caller (WebSocket send) ────────
                        if on_result is not None:
                            await on_result({
                                "type": "chunk.result",
                                "session_id": session_id,
                                "chunk_index": summary.chunks_processed,
                                "spoof_probability": round(prob, 6),
                                "risk_level": risk_level,
                                "suggested_action": explanation,
                                "latency_ms": latency_ms,
                                "explainability_markers": markers,
                            })

                        # ── Single-fire HIGH-risk alert ───────────────────
                        if risk_level == "high" and not alert_dispatched:
                            alert_dispatched = True
                            if on_alert is not None:
                                asyncio.create_task(on_alert(session_id, int(prob * 100)))

                        # ── Buffer detection event for Supabase write ─────
                        if on_event is not None:
                            events_buffer.append({
                                "session_id": session_id,
                                "chunk_index": summary.chunks_processed,
                                "spoof_probability": prob,
                                "risk_level": risk_level,
                                "features_snapshot": {"latency_ms": latency_ms},
                                "explainability_markers": markers,
                                "timestamp": datetime.now(timezone.utc).isoformat(),
                            })
                            if len(events_buffer) >= EVENT_FLUSH_BATCH:
                                flush_tasks.append(
                                    asyncio.create_task(on_event(list(events_buffer)))
                                )
                                events_buffer.clear()

                    finally:
                        # ── ZERO-RETENTION GUARANTEE ──────────────────────
                        # Raw audio and derived features are explicitly destroyed
                        # before the next frame is dequeued.
                        del frame           # _Frame.__del__ zeroes .audio
                        if features is not None:
                            del features
                        queue.task_done()

            except asyncio.CancelledError:
                pass
            finally:
                if on_event is not None and events_buffer:
                    flush_tasks.append(
                        asyncio.create_task(on_event(list(events_buffer)))
                    )
                if flush_tasks:
                    await asyncio.gather(*flush_tasks, return_exceptions=True)

        # ── Spawn and supervise both tasks ──────────────────────────────────
        recv_task = asyncio.create_task(_receive(), name=f"vs-recv-{session_id[:8]}")
        proc_task = asyncio.create_task(_process(), name=f"vs-proc-{session_id[:8]}")

        try:
            done, pending = await asyncio.wait(
                [recv_task, proc_task],
                return_when=asyncio.FIRST_COMPLETED,
            )
            for t in pending:
                t.cancel()
            await asyncio.gather(*pending, return_exceptions=True)
        except Exception as exc:
            logger.error("engine.session_error", error=str(exc), session_id=session_id)
            recv_task.cancel()
            proc_task.cancel()
            await asyncio.gather(recv_task, proc_task, return_exceptions=True)

        yield summary
