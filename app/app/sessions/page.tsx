"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  PhoneCall,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Search,
  Filter,
  X,
  Layers,
  FileText,
  ChevronRight,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

interface SessionRecord {
  id: string;
  user_id: string;
  started_at: string | null;
  ended_at: string | null;
  status: string;
  client_info?: {
    caller_id?: string;
    carrier?: string;
    ip_hash?: string;
  };
  risk_summary?: {
    avg_risk?: number;
    max_risk?: number;
    latency_ms?: number;
    decision?: string;
    hops?: number;
  };
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | "SAFE" | "ELEVATED" | "BLOCKED">("ALL");
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);

  useEffect(() => {
    let active = true;
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("sessions")
          .select("*")
          .order("started_at", { ascending: false })
          .limit(100);

        if (!active) return;
        if (error) {
          console.error("Error loading sessions:", error);
          setSessions([]);
        } else if (data) {
          setSessions(data as SessionRecord[]);
        }
      } catch {
        if (active) setSessions([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSessions();
    return () => {
      active = false;
    };
  }, []);

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.client_info?.caller_id &&
        s.client_info.caller_id.toLowerCase().includes(searchQuery.toLowerCase()));

    const maxRisk = Number(s.risk_summary?.max_risk ?? 0);
    let matchesRisk = true;
    if (riskFilter === "SAFE") matchesRisk = maxRisk < 0.35;
    else if (riskFilter === "ELEVATED") matchesRisk = maxRisk >= 0.35 && maxRisk < 0.75;
    else if (riskFilter === "BLOCKED") matchesRisk = maxRisk >= 0.75 || s.status === "flagged";

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              CARRIER STREAM LEDGER
            </span>
            <span className="text-xs text-[#52677C]">
              PostgreSQL Telemetry Table
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Call Sessions Explorer
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Comprehensive inventory of telephony streams, live duration, Kalman risk summaries, and policy decisions.
          </p>
        </div>

        <Link
          href="/app/detection"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1565C0] hover:bg-[#0B2545] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#45D9D2]" />
          <span>Stream New Session</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#DFE7EF] shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search className="w-4 h-4 text-[#52677C] shrink-0" />
          <input
            type="text"
            placeholder="Search by session token or caller identity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent border-none focus:outline-none text-[#0B2545] placeholder-[#94A3B8]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 text-[#94A3B8] hover:text-[#0B2545]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Risk Range Filters */}
        <div className="flex items-center gap-1 bg-[#F7F9FC] p-1 rounded-lg border border-[#E2E8F0] shrink-0">
          {[
            { label: "All Streams", value: "ALL" },
            { label: "Safe (<35%)", value: "SAFE" },
            { label: "Elevated (35-74%)", value: "ELEVATED" },
            { label: "Flagged (≥75%)", value: "BLOCKED" },
          ].map((rf) => (
            <button
              key={rf.value}
              onClick={() => setRiskFilter(rf.value as any)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                riskFilter === rf.value
                  ? "bg-white text-[#0B2545] shadow-xs border border-[#DFE7EF]"
                  : "text-[#52677C] hover:text-[#0B2545]"
              }`}
            >
              {rf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3">Session Token</th>
                <th className="px-6 py-3">Started</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Peak Risk</th>
                <th className="px-6 py-3">Measured Latency</th>
                <th className="px-6 py-3">Policy Outcome</th>
                <th className="px-6 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-xs text-[#52677C]">
                    Querying tenant session telemetry...
                  </td>
                </tr>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-[#52677C]">
                    <div className="max-w-md mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#E7F3FF] text-[#1565C0] flex items-center justify-center mx-auto">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-[#0B2545]">No Sessions Found</p>
                      <p className="text-[11px] text-[#52677C]">
                        {searchQuery || riskFilter !== "ALL"
                          ? "No monitored call streams match the current search or risk threshold."
                          : "Your tenant stream history is clean. Connect an active microphone or SIP trunk in the Live Console to log sessions."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSessions.map((s) => {
                  const maxRisk = Number(s.risk_summary?.max_risk ?? 0);
                  const latency = s.risk_summary?.latency_ms;
                  const decision = s.risk_summary?.decision ?? (maxRisk >= 0.75 ? "BLOCKED" : "NORMAL");

                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-[#F8FAFC] cursor-pointer"
                      onClick={() => setSelectedSession(s)}
                    >
                      <td className="px-6 py-4 font-mono font-bold text-xs text-[#0B2545]">
                        {s.id.slice(0, 18)}...
                      </td>
                      <td className="px-6 py-4 text-[#52677C]">
                        {s.started_at
                          ? formatDistanceToNow(new Date(s.started_at), { addSuffix: true })
                          : "Recent"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold">
                        <span
                          className={
                            maxRisk >= 0.75
                              ? "text-[#991B1B]"
                              : maxRisk >= 0.35
                              ? "text-[#8D6E00]"
                              : "text-[#065F46]"
                          }
                        >
                          {Math.round(maxRisk * 100)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#52677C]">
                        {latency ? `${latency} ms` : "Real-time frame"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            decision === "BLOCKED"
                              ? "bg-[#FCEAF3] text-[#991B1B] border-[#F8BBD0]"
                              : decision === "CHALLENGE"
                              ? "bg-[#FFF4D9] text-[#8D6E00] border-[#FFE082]"
                              : "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
                          }`}
                        >
                          {decision}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSession(s);
                          }}
                          className="text-xs font-semibold text-[#1565C0] hover:underline"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedSession(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DFE7EF] space-y-5 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1565C0] bg-[#E7F3FF] px-2 py-0.5 rounded border border-[#BBDEFB]">
                  Telemetry Dossier
                </span>
                <h3 className="text-base font-bold text-[#0B2545] font-mono mt-1">
                  {selectedSession.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1 rounded-md text-[#94A3B8] hover:text-[#0B2545] hover:bg-[#F7F9FC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#52677C] font-bold uppercase">Timestamp</span>
                  <p className="font-semibold text-[#0B2545] mt-0.5">
                    {selectedSession.started_at
                      ? new Date(selectedSession.started_at).toLocaleString()
                      : "Unrecorded"}
                  </p>
                </div>
                <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#52677C] font-bold uppercase">Peak Risk</span>
                  <p className="font-mono font-bold text-[#991B1B] mt-0.5">
                    {Math.round(Number(selectedSession.risk_summary?.max_risk ?? 0) * 100)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#52677C] font-bold uppercase">Average Risk</span>
                  <p className="font-mono font-bold text-[#0B2545] mt-0.5">
                    {Math.round(Number(selectedSession.risk_summary?.avg_risk ?? 0) * 100)}%
                  </p>
                </div>
                <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#52677C] font-bold uppercase">Latency</span>
                  <p className="font-mono font-bold text-[#0B2545] mt-0.5">
                    {selectedSession.risk_summary?.latency_ms
                      ? `${selectedSession.risk_summary.latency_ms} ms`
                      : "Real-time"}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
                <span className="text-[10px] text-[#52677C] font-bold uppercase">Telemetry Policy Decision</span>
                <p className="font-bold text-[#0B2545] mt-0.5">
                  {selectedSession.risk_summary?.decision ?? "PASSED (Within Human Threshold)"}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <Link
                href="/app/forensics"
                className="text-xs font-semibold text-[#1565C0] hover:underline flex items-center gap-1"
              >
                <span>Analyze in Forensic Lab</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 bg-[#0B2545] hover:bg-[#1565C0] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
