"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { format } from "date-fns";

type DetectionEvent = {
  id: string;
  session_id: string;
  created_at: string;
  risk_level: "low" | "medium" | "high";
  spoof_probability: number;
  latency_ms: number;
};

export function RealtimeSessionFeed() {
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "live" | "retrying" | "offline"
  >("connecting");
  const supabase = useMemo(() => createClient(), []);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let disposed = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const loadRecentEvents = async () => {
      const { data, error } = await supabase
        .from("detection_events")
        .select("id, session_id, timestamp, risk_level, spoof_probability, features_snapshot")
        .order("timestamp", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Failed to load recent detection events:", error.message);
        return;
      }

      if (disposed) return;
      setEvents(
        (data ?? []).map((event) => ({
          ...event,
          created_at: event.timestamp,
          latency_ms: Number((event.features_snapshot as { latency_ms?: number } | null)?.latency_ms ?? 0),
        }))
      );
    };

    const connect = () => {
      if (disposed) return;
      setConnectionStatus("connecting");
      channel = supabase
        .channel(`realtime-feed-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "detection_events",
          },
          (payload) => {
            const newEvent = payload.new as DetectionEvent & {
              timestamp?: string;
              features_snapshot?: { latency_ms?: number };
            };
            setEvents((prev) => {
              const normalized = {
                ...newEvent,
                created_at: newEvent.created_at ?? newEvent.timestamp ?? new Date().toISOString(),
                latency_ms: newEvent.latency_ms ?? newEvent.features_snapshot?.latency_ms ?? 0,
              };
              return [normalized, ...prev.filter((event) => event.id !== normalized.id)].slice(0, 20);
            });
          }
        )
        .subscribe((status) => {
          if (disposed) return;
          if (status === "SUBSCRIBED") {
            setConnectionStatus("live");
            return;
          }
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            setConnectionStatus("retrying");
            if (!retryTimerRef.current) {
              retryTimerRef.current = setTimeout(() => {
                retryTimerRef.current = null;
                if (channel) void supabase.removeChannel(channel);
                connect();
              }, 5000);
            }
          }
        });
    };

    void loadRecentEvents();
    connect();
    const pollTimer = setInterval(() => void loadRecentEvents(), 15000);

    return () => {
      disposed = true;
      clearInterval(pollTimer);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      if (channel) void supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="flex h-full min-h-[360px] flex-col space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-xl sm:min-h-[420px] sm:space-y-6 sm:p-5 xl:min-h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 sm:pb-4">
        <div>
          <h3 className="text-base font-bold text-white font-sans sm:text-lg">Live Feed</h3>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">Realtime detection events</p>
        </div>
        <div role="status" aria-live="polite">
          <StatusBadge
            severity={
              connectionStatus === "live"
                ? "safe"
                : connectionStatus === "offline"
                ? "offline"
                : connectionStatus === "retrying"
                ? "warning"
                : "processing"
            }
          >
            {connectionStatus === "live"
              ? "LIVE"
              : connectionStatus === "retrying"
              ? "RETRYING..."
              : connectionStatus === "offline"
              ? "OFFLINE"
              : "CONNECTING..."}
          </StatusBadge>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div role="log" aria-label="Realtime detection events" tabIndex={0} className="absolute inset-0 space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 sm:space-y-4 sm:pr-2">
          {events.length === 0 ? (
            <div className="unavailable justify-center">Waiting for events...</div>
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                className="animate-riseIn flex flex-col gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 duration-300 sm:p-4"
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">
                    {ev.created_at ? format(new Date(ev.created_at), "HH:mm:ss") : "--:--:--"}
                  </span>
                  <span className="text-slate-500">#{ev.session_id ? ev.session_id.substring(0, 8) : "unknown"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <StatusBadge severity={ev.risk_level === "high" ? "critical" : ev.risk_level === "medium" ? "warning" : "safe"}>
                      {Math.round((ev.spoof_probability || 0) * 100)}% · {ev.risk_level === "high" ? "High" : ev.risk_level === "medium" ? "Medium" : "Low"}
                    </StatusBadge>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{ev.latency_ms || 0}ms</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
