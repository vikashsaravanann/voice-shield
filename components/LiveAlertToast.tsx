"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/browser";
import { AlertTriangle, X } from "lucide-react";

type Alert = {
  id: string;
  session_id: string;
  timestamp: number;
};

export function LiveAlertToast() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const supabase = useMemo(() => createClient(), []);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } catch (err) {
      console.error("Audio playback failed", err);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("live-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "detection_events",
          filter: "risk_level=eq.high",
        },
        (payload) => {
          const newEvent = payload.new;
          const newAlert: Alert = {
            id: newEvent.id || Math.random().toString(),
            session_id: newEvent.session_id || "unknown",
            timestamp: Date.now(),
          };
          setAlerts((prev) => [...prev, newAlert]);
          playBeep();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const dismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div
      className="fixed top-16 left-0 right-0 z-50 flex flex-col items-center p-3 sm:p-4 pointer-events-none gap-3"
      role="region"
      aria-label="Security alerts"
    >
      {alerts.map((alert) => (
        <div
          key={alert.id}
          role="alert"
          className="alert alert-critical pointer-events-auto w-full max-w-3xl items-start justify-between shadow-2xl"
        >
          <div className="flex items-start gap-3 min-w-0">
            <AlertTriangle aria-hidden className="w-5 h-5 mt-0.5 shrink-0 text-[var(--danger)]" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--danger)]">Critical</p>
              <p className="text-slate-50 font-semibold text-base sm:text-lg break-words">THREAT DETECTED — Voice clone signature confirmed.</p>
              <p className="text-slate-300 text-sm font-mono mt-1">
                Session {alert.session_id.substring(0, 8)} blocked · {new Date(alert.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button type="button" onClick={() => dismiss(alert.id)} className="btn btn-ghost btn-sm shrink-0">
            <X aria-hidden className="w-4 h-4" />
            Acknowledge
          </button>
        </div>
      ))}
    </div>
  );
}
