"use client";

import { AUDIO_CONFIG, CHALLENGE_PHRASES, type ChallengeLang } from "@/lib/audio/config";
import { AudioStreamer, type StreamSnapshot } from "@/lib/audio/streamer";
import type { Decision } from "@/lib/audio/decision";
import { useEffect, useRef, useState } from "react";
import { Activity, AudioLines, Mic, Radio, ShieldAlert, Unplug, Square } from "lucide-react";
import { StatusBadge, type Severity } from "@/components/ui/StatusBadge";

const RISK_COLOR = { green: "var(--ok)", amber: "var(--warn)", red: "var(--danger)" } as const;
const RISK_SEVERITY: Record<"green" | "amber" | "red", Severity> = { green: "safe", amber: "warning", red: "critical" };
const LINK_SEVERITY: Record<StreamSnapshot["state"], Severity> = {
  idle: "unknown",
  connecting: "processing",
  live: "safe",
  reconnecting: "warning",
  dropped: "offline",
};

function describeMicError(err: unknown): string {
  const name = err instanceof DOMException ? err.name : "";
  if (name === "NotAllowedError" || name === "SecurityError")
    return "Microphone permission denied. Allow microphone access in the browser site settings, then start again.";
  if (name === "NotFoundError" || name === "OverconstrainedError")
    return "No microphone available. Connect an input device and start again.";
  if (name === "NotReadableError") return "The microphone is in use by another application. Close it and start again.";
  return "The live path could not start. Check the microphone and connection, then try again.";
}

const LINK_LABEL: Record<StreamSnapshot["state"], string> = {
  idle: "Idle",
  connecting: "Connecting",
  live: "Live",
  reconnecting: "Reconnecting",
  dropped: "Dropped",
};

export function LiveConsole() {
  const streamerRef = useRef<AudioStreamer | null>(null);
  const [snap, setSnap] = useState<StreamSnapshot | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cloneOn, setCloneOn] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [hops, setHops] = useState(0);
  const [drops, setDrops] = useState(0);
  const [resumes, setResumes] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [challenge, setChallenge] = useState<{
    lang: ChallengeLang;
    armedAt: number;
    resolved?: boolean;
    passed?: boolean;
  } | null>(null);
  const amberStreak = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveRef = useRef<HTMLCanvasElement>(null);
  const lastHop = useRef(-1);

  useEffect(() => {
    const s = new AudioStreamer();
    streamerRef.current = s;
    const offSnap = s.onSnapshot((next) => {
      setSnap({ ...next });
      if (next.decision && next.state === "live" && next.chunkIndex !== lastHop.current) {
        lastHop.current = next.chunkIndex;
        setHistory((h) => {
          const n = [...h, next.decision!.smoothed];
          return n.length > 96 ? n.slice(-96) : n;
        });
        setHops((n) => n + 1);
        if (next.decision.risk !== "green") amberStreak.current += 1;
        else amberStreak.current = 0;
        if (amberStreak.current >= AUDIO_CONFIG.challengeAfterHops) {
          setChallenge((c) => c ?? { lang: "en", armedAt: performance.now() });
        }
      }
      drawSpec(canvasRef.current, next.pcm);
      drawWave(waveRef.current, next.pcm);
    });
    const offBridge = s.bridge.on((e) => {
      if (e.type === "error") setDrops((n) => n + 1);
      if (e.type === "resume") setResumes((n) => n + 1);
    });
    const vis = () => s.bridge.setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", vis);
    return () => {
      offSnap();
      offBridge();
      document.removeEventListener("visibilitychange", vis);
      s.stop();
    };
  }, []);

  async function start() {
    setError(null);
    setHistory([]);
    setHops(0);
    setDrops(0);
    setResumes(0);
    setChallenge(null);
    amberStreak.current = 0;
    const id = crypto.randomUUID();
    setSessionId(id);
    try {
      await streamerRef.current?.start(id);
      setRunning(true);
    } catch (err) {
      setError(describeMicError(err));
    }
  }

  function stop() {
    streamerRef.current?.stop();
    setRunning(false);
  }

  function toggleClone() {
    const next = !cloneOn;
    setCloneOn(next);
    if (streamerRef.current) streamerRef.current.cloneInject = next;
  }

  function drop() {
    streamerRef.current?.dropLink();
  }

  function resolveChallenge(passed: boolean) {
    setChallenge((c) => (c ? { ...c, resolved: true, passed } : c));
    amberStreak.current = 0;
  }

  const d: Decision | null = snap?.decision ?? null;
  const risk = d?.risk ?? "green";
  const pct = Math.round((d?.smoothed ?? 0) * 100);

  return (
    <div>
      <div className="row">
        {!running ? (
          <button type="button" className="btn btn-primary" onClick={() => void start()}>
            <Mic aria-hidden size={16} /> Start live analysis
          </button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={stop}>
            <Square aria-hidden size={14} /> Stop session
          </button>
        )}
        <button type="button" className={cloneOn ? "btn btn-critical" : "btn btn-ghost"} aria-pressed={cloneOn} disabled={!running} onClick={toggleClone}>
          <ShieldAlert aria-hidden size={16} /> {cloneOn ? "Cloned voice on" : "Simulate cloned voice"}
        </button>
        <button type="button" className="btn btn-ghost" disabled={!running} onClick={drop}>
          <Unplug aria-hidden size={16} /> Simulate connection drop
        </button>
      </div>
      <div className="row" style={{ marginTop: 12 }} role="status" aria-live="polite">
        <StatusBadge severity={error ? "critical" : LINK_SEVERITY[snap?.state ?? "idle"]}>
          {error ? "Error" : `Link: ${snap ? LINK_LABEL[snap.state] : "Idle"}`}
        </StatusBadge>
        <span className="hint">
          {error
            ? "Session not running."
            : !running
            ? "Press Start live analysis and allow microphone access to begin."
            : snap?.state === "live" && !d
            ? "Listening — waiting for the first analysed hop."
            : snap?.state === "live"
            ? "Analysing live microphone input."
            : ""}
        </span>
      </div>
      {error ? (
        <div className="alert alert-critical" role="alert" style={{ marginTop: 12 }}>
          <ShieldAlert aria-hidden size={18} style={{ flexShrink: 0, marginTop: 2, color: "var(--danger)" }} />
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>Live path unavailable</p>
            <p className="err" style={{ margin: "4px 0 0", color: "var(--muted)" }}>{error}</p>
          </div>
        </div>
      ) : null}

      <div className="board">
        <section className="card">
          <p className="eyebrow">Synthetic-voice score</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12 }}>
            <p className="pct" style={{ color: d ? RISK_COLOR[risk] : "var(--subtle)" }} aria-label={d ? `Synthetic-voice score ${pct} percent` : "Synthetic-voice score not yet available"}>
              {d ? pct : "—"}
              {d ? <span style={{ fontSize: 18, color: "var(--muted)" }}>%</span> : null}
            </p>
            <StatusBadge severity={d ? RISK_SEVERITY[risk] : "unknown"}>
              {d ? (risk === "green" ? "Likely human" : risk === "amber" ? "Suspicious: challenge" : "Likely synthetic") : "No result yet"}
            </StatusBadge>
          </div>
          <div className="bar" role="progressbar" aria-label="Synthetic-voice score" aria-valuemin={0} aria-valuemax={100} aria-valuenow={d ? pct : undefined}>
            <span style={{ width: `${pct}%`, background: RISK_COLOR[risk] }} />
          </div>
          <dl className="stats">
            <div>
              <dt>Analysis time</dt>
              <dd>{d ? `${d.latencyMs.toFixed(1)} ms` : "—"}</dd>
            </div>
            <div>
              <dt>Segments</dt>
              <dd>{hops}</dd>
            </div>
            <div>
              <dt>Link</dt>
              <dd>{snap ? LINK_LABEL[snap.state] : "Idle"}</dd>
            </div>
            <div>
              <dt>Ring buffer</dt>
              <dd>{snap?.buffered ?? 0} segments</dd>
            </div>
            <div>
              <dt>Drops</dt>
              <dd>{drops}</dd>
            </div>
            <div>
              <dt>Resumes</dt>
              <dd>{resumes}</dd>
            </div>
          </dl>
          {snap?.state === "reconnecting" || snap?.state === "connecting" ? (
            <p className="hint" role="status" style={{ marginTop: 12, color: "var(--warn)" }}>
              {snap.state === "connecting" ? "Bringing the inference link up…" : "Connection lost — reconnecting"}
              {snap.reconnectDelayMs ? ` in ${snap.reconnectDelayMs} ms` : ""}
              {snap.reconnectAttempt ? ` (attempt ${snap.reconnectAttempt})` : ""}. Ring holds the last {AUDIO_CONFIG.bufferDurationSec}s.
            </p>
          ) : null}
        </section>
        <section className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <p className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <AudioLines aria-hidden size={14} /> Waveform · 16 kHz
            </p>
            <p className="eyebrow">{AUDIO_CONFIG.chunkMs} ms segments</p>
          </div>
          <div style={{ position: "relative" }}>
            <canvas ref={waveRef} role="img" aria-label="Live microphone waveform" width={800} height={80} style={{ height: 64 }} />
            {!running ? <CanvasIdle label="Waveform appears when analysis starts" /> : null}
          </div>
          <p className="eyebrow" style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <Activity aria-hidden size={14} /> Spectrogram
          </p>
          <div style={{ position: "relative", marginTop: 8 }}>
            <canvas ref={canvasRef} role="img" aria-label="Live linear spectrogram of microphone input" width={800} height={160} style={{ height: 144 }} />
            {!running ? <CanvasIdle label="Spectrogram appears when analysis starts" /> : null}
          </div>
          <Sparkline values={history} />
        </section>
      </div>

      <div className="board board-2" style={{ marginTop: 16 }}>
        <section className="card">
          <p className="eyebrow">Explainability</p>
          <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none" }}>
            {(d?.markers ?? ["Awaiting active speech"]).map((m) => (
              <li key={m} style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--accent)", marginTop: 7, flexShrink: 0 }} />
                {m}
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <p className="eyebrow">Phonemic challenge</p>
          {!challenge ? (
            <p className="hint" style={{ marginTop: 12 }}>
              Triggers when the smoothed score stays amber or red for {AUDIO_CONFIG.challengeAfterHops} consecutive segments. The caller must read a
              random phrase aloud; a cloned stream cannot respond naturally. Use Simulate cloned voice to trigger it.
            </p>
          ) : (
            <div>
              <p style={{ fontSize: 14 }}>Read exactly:</p>
              <p style={{ background: "var(--elevated)", padding: "12px", borderRadius: 8, fontWeight: 500 }}>
                “{CHALLENGE_PHRASES[challenge.lang]}”
              </p>
              <div className="row" style={{ marginTop: 8 }}>
                {(Object.keys(CHALLENGE_PHRASES) as ChallengeLang[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={challenge.lang === lang ? "btn btn-primary" : "btn btn-ghost"}
                    style={{ minHeight: 32, padding: "0.3rem 0.75rem", fontSize: 12 }}
                    onClick={() => setChallenge({ ...challenge, lang })}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              {challenge.resolved ? (
                <p style={{ color: challenge.passed ? "var(--ok)" : "var(--danger)", fontSize: 14 }}>
                  {challenge.passed ? "Human latency + score returned to Green." : "Held — clone-like latency or residual spoof score."}
                </p>
              ) : (
                <div className="row" style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => resolveChallenge(!cloneOn && (d?.smoothed ?? 1) < 0.45)}
                  >
                    Record response
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => resolveChallenge(false)}>
                    Fail closed
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <details className="hint" style={{ marginTop: 16 }}>
        <summary style={{ cursor: "pointer", minHeight: 32, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Radio aria-hidden size={12} /> Connection details
        </summary>
        <dl className="stats" style={{ fontFamily: "var(--mono)", marginTop: 8 }}>
          <div><dt>Session</dt><dd>{sessionId ? sessionId.slice(0, 8) : "—"}</dd></div>
          <div><dt>Last segment</dt><dd>{(snap?.lastChunkIndex ?? -1) >= 0 ? snap?.lastChunkIndex : "—"}</dd></div>
          <div><dt>Reconnect backoff</dt><dd>{AUDIO_CONFIG.reconnect.baseDelay} ms × {AUDIO_CONFIG.reconnect.multiplier}</dd></div>
          <div><dt>Max attempts</dt><dd>{AUDIO_CONFIG.reconnect.maxAttempts} (±{AUDIO_CONFIG.reconnect.jitter * 100}% jitter)</dd></div>
        </dl>
      </details>
    </div>
  );
}

function CanvasIdle({ label }: { label: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        fontSize: 12,
        color: "var(--subtle)",
        border: "1px dashed var(--border-strong)",
        borderRadius: 8,
        pointerEvents: "none",
      }}
    >
      {label}
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const w = 800;
  const h = 56;
  if (values.length < 2) return <div className="unavailable" style={{ marginTop: 12, height: 56 }}>Score history appears after the first analysed segment</div>;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - v * (h - 4) - 2}`)
    .join(" ");
  return (
    <svg role="img" aria-label={`Smoothed spoof probability, last ${values.length} hops`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ marginTop: 12, height: 56, width: "100%" }}>
      <polyline fill="none" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" points={pts} />
    </svg>
  );
}

function drawWave(canvas: HTMLCanvasElement | null, pcm: Float32Array | null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.fillStyle = "#091330";
  ctx.fillRect(0, 0, width, height);
  if (!pcm) return;
  ctx.strokeStyle = "#45d9d2";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  const step = Math.max(1, Math.floor(pcm.length / width));
  for (let x = 0; x < width; x++) {
    const s = pcm[x * step] ?? 0;
    const y = height / 2 + s * (height * 0.42);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawSpec(canvas: HTMLCanvasElement | null, pcm: Float32Array | null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;
  const { width, height } = canvas;
  if (!pcm) {
    ctx.fillStyle = "#091330";
    ctx.fillRect(0, 0, width, height);
    return;
  }
  const img = ctx.getImageData(1, 0, width - 1, height);
  ctx.putImageData(img, 0, 0);
  const bins = 64;
  const slice = Math.floor(pcm.length / bins);
  for (let y = 0; y < height; y++) {
    const bin = Math.floor((1 - y / height) * (bins - 1));
    let e = 0;
    const start = bin * slice;
    for (let i = 0; i < slice; i++) e += Math.abs(pcm[start + i] ?? 0);
    const v = Math.min(1, e / (slice * 0.08));
    ctx.fillStyle = `rgb(${Math.floor(20 + v * 80)},${Math.floor(40 + v * 180)},${Math.floor(50 + v * 160)})`;
    ctx.fillRect(width - 1, y, 1, 1);
  }
}
