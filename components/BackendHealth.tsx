"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  CheckCircle2,
  ServerCrash,
  RefreshCw,
  Cpu,
  Wifi,
  Database,
  Activity,
  Zap,
} from "lucide-react";

type Health = {
  status: string;
  model_loaded: boolean;
  model_name: string;
  version: string;
  device: string;
  store_raw_audio: boolean;
};

function apiBaseUrl() {
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const envUrl = process.env.NEXT_PUBLIC_FASTAPI_HTTP_URL;
  if (isHttps) {
    if (envUrl && envUrl.startsWith("https://") && !envUrl.includes("localhost")) {
      return envUrl;
    }
    return "https://voiceshield-sih-2026-production.up.railway.app";
  }
  return envUrl || "http://localhost:8000";
}

interface BackendHealthProps {
  compact?: boolean;
  wsConnected?: boolean;
}

export function BackendHealth({
  compact = false,
  wsConnected = false,
}: BackendHealthProps) {
  const [health, setHealth] = useState<Health | null>(null);
  const [httpError, setHttpError] = useState(false);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const check = async () => {
    setRetrying(true);
    setHttpStatus(null);
    try {
      const res = await fetch(`${apiBaseUrl()}/health`, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      setHttpStatus(res.status);
      if (!res.ok) throw new Error("not ok");
      const data = (await res.json()) as Health;
      setHealth(data);
      setHttpError(false);
    } catch {
      setHttpError(true);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    void check();
    const t = window.setInterval(check, 20000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const online = Boolean(health && !httpError) || wsConnected;

  if (compact) {
    return (
      <span role="status" aria-live="polite">
        <StatusBadge severity={online ? "safe" : loading ? "processing" : "offline"}>
          {online ? "API online" : loading ? "Connecting…" : "API unavailable"}
        </StatusBadge>
      </span>
    );
  }

  const statusLabel = online
    ? "Inference API · Online"
    : loading
    ? "Inference API · Connecting…"
    : "Inference API · Unavailable";

  const statusSub = wsConnected && httpError
    ? `WebSocket active — HTTP health probe returned ${httpStatus ?? "no response"}.`
    : httpError
    ? httpStatus === 404
      ? "Inference service is not registered at this URL yet. The browser shell remains available."
      : "Inference service is unavailable. Retry after the backend is awake."
    : loading
    ? "Probing the VoiceShield inference service…"
    : "All systems nominal.";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-2xl border border-l-4 p-5 transition-colors duration-300 ${
        online
          ? "border-slate-800 border-l-[var(--ok)] bg-slate-900/60"
          : httpError
          ? "border-slate-700 border-l-[var(--offline)] bg-slate-900/60"
          : "border-slate-800 border-l-[var(--processing)] bg-slate-900/60"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`p-2.5 rounded-xl border shrink-0 ${
              online
                ? "border-emerald-500/30 bg-emerald-950/40"
                : "border-slate-700 bg-slate-900"
            }`}
          >
            {online ? (
              <CheckCircle2 className="text-emerald-400 w-5 h-5" />
            ) : (
              <ServerCrash
                className={`w-5 h-5 ${
                  loading ? "text-slate-500 animate-pulse" : "text-slate-500"
                }`}
              />
            )}
          </div>
          <div>
            <p className="widget-label mb-0.5">
              Control Plane
            </p>
            <h2 className="text-sm font-bold text-white leading-tight">
              {statusLabel}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-lg">{statusSub}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {online && <Activity aria-hidden className="w-4 h-4 text-emerald-400" />}
          {httpError && !wsConnected && (
            <button
              onClick={check}
              disabled={retrying}
              className="btn btn-ghost btn-sm"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${retrying ? "animate-spin" : ""}`}
              />
              {retrying ? "Checking…" : "Retry"}
            </button>
          )}
        </div>
      </div>

      {health && !httpError && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: Cpu,
              label: "Model",
              value: health.model_name || "DSP + Groq",
            },
            { icon: Zap, label: "Version", value: `v${health.version}` },
            {
              icon: Wifi,
              label: "Runtime",
              value: health.device?.toUpperCase() || "CPU",
            },
            {
              icon: Database,
              label: "Audio Storage",
              value: health.store_raw_audio ? "Retained" : "RAM only",
              highlight: !health.store_raw_audio,
            },
          ].map(({ icon: Icon, label, value, highlight }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3 space-y-1"
            >
              <div className="flex items-center gap-1.5 text-slate-500">
                <Icon className="w-3.5 h-3.5" />
                <span className="widget-label">
                  {label}
                </span>
              </div>
              <p
                className={`text-sm font-bold ${
                  highlight ? "text-emerald-400" : "text-white"
                }`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {wsConnected && httpError && (
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-3">
          <p className="text-xs text-emerald-300/80 leading-relaxed">
            <strong className="text-emerald-300">Backend confirmed online:</strong> Your
            WebSocket connection is live and streaming audio in real-time. The HTTP health
            endpoint returned {httpStatus ?? "no response"}, but the active stream is authoritative.
          </p>
        </div>
      )}

      {!online && !loading && (
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-950/10 px-4 py-3">
          <p className="text-xs text-amber-300/80 leading-relaxed">
            <strong className="text-amber-300">Browser shell active:</strong> The visual
            console remains available, but live inference and risk updates require the backend
            WebSocket. Retry after the service is deployed or awake.
          </p>
        </div>
      )}
    </div>
  );
}
