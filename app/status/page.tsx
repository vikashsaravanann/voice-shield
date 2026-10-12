"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, RefreshCw, Activity, ArrowRight, ShieldCheck, Clock } from "lucide-react";

interface ServiceHealth {
  name: string;
  status: string;
  latencyMs: number;
  description: string;
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallStatus, setOverallStatus] = useState<"OPERATIONAL" | "DEGRADED" | "CHECKING">("CHECKING");
  const [lastChecked, setLastChecked] = useState<string>("Checking...");
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
        const anyDegraded = (data.services || []).some((s: ServiceHealth) => s.status !== "OPERATIONAL");
        setOverallStatus(anyDegraded ? "DEGRADED" : "OPERATIONAL");
        setLastChecked(new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      } else {
        setOverallStatus("DEGRADED");
        setLastChecked("Unavailable");
      }
    } catch {
      setOverallStatus("DEGRADED");
      setLastChecked("Connection failed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Banner */}
        <div className={`p-6 rounded-2xl border mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          overallStatus === "OPERATIONAL"
            ? "bg-[#E7F7EF] border-[#A7F3D0]"
            : overallStatus === "DEGRADED"
            ? "bg-[#FFF4D9] border-[#FFE082]"
            : "bg-[#F7F9FC] border-[#DFE7EF]"
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-3.5 h-3.5 rounded-full ${
              overallStatus === "OPERATIONAL"
                ? "bg-[#10B981] animate-pulse"
                : overallStatus === "DEGRADED"
                ? "bg-[#F59E0B]"
                : "bg-[#94A3B8]"
            }`} />
            <div>
              <h2 className={`text-base font-bold ${
                overallStatus === "OPERATIONAL"
                  ? "text-[#065F46]"
                  : overallStatus === "DEGRADED"
                  ? "text-[#8D6E00]"
                  : "text-[#0B2545]"
              }`}>
                {overallStatus === "OPERATIONAL"
                  ? "All VoiceShield Systems Operational"
                  : overallStatus === "DEGRADED"
                  ? "Platform Running in Degraded / Local Mode"
                  : "Querying Infrastructure Telemetry..."}
              </h2>
              <p className="text-xs text-[#52677C]">
                Telemetry ping interval: 30s • Last probe: {lastChecked}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchHealth}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-xs font-semibold text-[#0B2545] border border-[#DFE7EF] hover:bg-[#F7F9FC] transition-colors shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#1565C0]" : ""}`} />
              <span>Probe Now</span>
            </button>
            <span className="text-xs font-mono font-bold text-[#0B2545] px-2 py-1 rounded bg-white/80 border border-[#DFE7EF]">
              v2.4.0
            </span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
              Platform Service Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-[#52677C]">
              Real-time response times measured across active inference nodes and persistence layers.
            </p>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-12 text-center text-xs text-[#52677C] bg-[#F7F9FC] rounded-2xl border border-[#DFE7EF]">
              <Activity className="w-6 h-6 text-[#1565C0] animate-spin mx-auto mb-2" />
              Probing cluster telemetry...
            </div>
          ) : (
            services.map((s) => (
              <div
                key={s.name}
                className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] hover:border-[#CBD5E1] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${s.status === "OPERATIONAL" ? "text-[#10B981]" : "text-[#F59E0B]"}`} />
                  <div>
                    <span className="font-bold text-[#0B2545]">{s.name}</span>
                    <p className="text-xs text-[#52677C]">{s.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#0B2545]">
                      {s.latencyMs}ms
                    </span>
                    <span className="text-[10px] text-[#52677C] block">roundtrip</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${
                      s.status === "OPERATIONAL"
                        ? "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
                        : "bg-[#FFF4D9] text-[#8D6E00] border-[#FFE082]"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Notice */}
        <div className="mt-12 p-6 rounded-2xl bg-[#E7F3FF] border border-[#BBDEFB] text-xs text-[#1565C0] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#1565C0] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Transparent Telemetry Commitment</p>
            <p className="text-[#1565C0]/90 leading-relaxed">
              Operational latency figures reflect live client roundtrip queries measured against the running deployment cluster, adhering to VoiceShield’s data provenance policy.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
