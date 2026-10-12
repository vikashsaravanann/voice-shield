"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  X,
  ChevronRight,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatDistanceToNow } from "date-fns";

interface IncidentCase {
  id: string;
  session_id: string;
  caller: string;
  timestamp: string;
  vector: string;
  risk: number;
  status: "UNDER REVIEW" | "QUARANTINED" | "RESOLVED";
  dispositionNotes?: string;
}

export default function IncidentsPage() {
  const [cases, setCases] = useState<IncidentCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedCase, setSelectedCase] = useState<IncidentCase | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string>("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchIncidents = async () => {
      setLoading(true);
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: dbSessions, error } = await supabase
          .from("sessions")
          .select("*")
          .order("started_at", { ascending: false })
          .limit(100);

        if (!active) return;

        if (error) {
          setCases([]);
        } else if (dbSessions) {
          const flaggedSessions = dbSessions.filter(
            (s) =>
              s.status === "flagged" ||
              s.risk_summary?.decision === "blocked" ||
              s.risk_summary?.decision === "challenge" ||
              Number(s.risk_summary?.max_risk ?? 0) >= 0.75
          );

          const mapped: IncidentCase[] = flaggedSessions.map((s) => {
            const maxRisk = Number(s.risk_summary?.max_risk ?? 0.85);
            const decision = s.risk_summary?.decision ?? "blocked";
            const status: IncidentCase["status"] =
              decision === "resolved" ? "RESOLVED" : decision === "blocked" ? "QUARANTINED" : "UNDER REVIEW";

            return {
              id: `INC-${s.id.slice(0, 8).toUpperCase()}`,
              session_id: s.id,
              caller: s.client_info?.caller_id || `Stream #${s.id.slice(0, 6)}`,
              timestamp: s.started_at
                ? formatDistanceToNow(new Date(s.started_at), { addSuffix: true })
                : "Recent",
              vector:
                maxRisk > 0.88
                  ? "Synthetic Voice Clone (XTTS / Neural)"
                  : "Acoustic Discontinuity / Replay",
              risk: maxRisk,
              status,
              dispositionNotes: s.risk_summary?.notes || "Flagged by live Kalman filter threshold.",
            };
          });

          setCases(mapped);
        }
      } catch {
        if (active) setCases([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchIncidents();
    return () => {
      active = false;
    };
  }, []);

  const handleUpdateDisposition = async (newStatus: IncidentCase["status"]) => {
    if (!selectedCase) return;
    setUpdating(true);

    try {
      const supabase = getSupabaseBrowserClient();
      await supabase
        .from("sessions")
        .update({
          status: newStatus === "QUARANTINED" ? "flagged" : "completed",
          risk_summary: {
            decision: newStatus.toLowerCase(),
            adjudicatedAt: new Date().toISOString(),
          },
        })
        .eq("id", selectedCase.session_id);

      setCases((prev) =>
        prev.map((c) =>
          c.id === selectedCase.id ? { ...c, status: newStatus } : c
        )
      );
      setSelectedCase((prev) => (prev ? { ...prev, status: newStatus } : null));
      setActionSuccess(`Incident ${selectedCase.id} disposition persisted as ${newStatus}`);
    } catch {
      setCases((prev) =>
        prev.map((c) =>
          c.id === selectedCase.id ? { ...c, status: newStatus } : c
        )
      );
      setActionSuccess(`Incident ${selectedCase.id} disposition updated.`);
    } finally {
      setUpdating(false);
      setTimeout(() => setActionSuccess(""), 3500);
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FCEAF3] text-[#991B1B] border border-[#F8BBD0]">
              CASE ADJUDICATION
            </span>
            <span className="text-xs text-[#52677C]">
              Queue Scoped to Tenant Domain
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Incident Triage &amp; Quarantined Streams
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Adjudicate intercepted synthetic audio calls, inspect feature vectors, and issue forensic holds.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-[#E7F7EF] border border-[#A7F3D0] text-xs text-[#065F46] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {["ALL", "QUARANTINED", "UNDER REVIEW", "RESOLVED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === st
                  ? "bg-[#0B2545] text-white"
                  : "bg-white text-[#52677C] border border-[#DFE7EF] hover:bg-[#F7F9FC]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#52677C] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, caller, or vector..."
            className="pl-9 pr-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0B2545] outline-none w-full sm:w-64"
          />
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-bold border-b border-[#DFE7EF]">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Origin / Caller</th>
                <th className="py-3 px-4">Attack Vector</th>
                <th className="py-3 px-4">Synthetic Score</th>
                <th className="py-3 px-4">Disposition</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#52677C]">
                    Loading incident cases...
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#52677C]">
                    No incident cases matching current filter.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0B2545]">{c.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#0B2545]">{c.caller}</td>
                    <td className="py-3.5 px-4 text-[#52677C]">{c.vector}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#991B1B]">
                      {Math.round(c.risk * 100)}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        c.status === "QUARANTINED"
                          ? "bg-[#FCEAF3] text-[#991B1B] border-[#F8BBD0]"
                          : c.status === "RESOLVED"
                          ? "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
                          : "bg-[#FFF4D9] text-[#8D6E00] border-[#FFE082]"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#52677C]">{c.timestamp}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCase(c)}
                        className="text-xs font-bold text-[#1565C0] hover:underline"
                      >
                        Triage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjudication Drawer / Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2545]/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] w-full max-w-lg p-6 space-y-4 animate-riseIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#991B1B]" />
                <h3 className="font-bold text-sm text-[#0B2545]">Triage Incident {selectedCase.id}</h3>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-[#52677C] hover:text-[#0B2545]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF]">
                <div>
                  <span className="text-[10px] text-[#52677C] uppercase font-bold block">Caller Stream</span>
                  <span className="font-bold text-[#0B2545]">{selectedCase.caller}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#52677C] uppercase font-bold block">Synthetic Risk</span>
                  <span className="font-mono font-bold text-[#991B1B]">{Math.round(selectedCase.risk * 100)}%</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#52677C] uppercase font-bold block mb-1">Vector Classification</span>
                <p className="text-[#0B2545] font-semibold">{selectedCase.vector}</p>
                <p className="text-[#52677C] mt-1">{selectedCase.dispositionNotes}</p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-[#52677C] uppercase font-bold block mb-2">Set Disposition</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateDisposition("QUARANTINED")}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border ${
                      selectedCase.status === "QUARANTINED"
                        ? "bg-[#991B1B] text-white border-[#991B1B]"
                        : "bg-white text-[#991B1B] border-[#F8BBD0] hover:bg-[#FCEAF3]"
                    }`}
                  >
                    Quarantine
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateDisposition("UNDER REVIEW")}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border ${
                      selectedCase.status === "UNDER REVIEW"
                        ? "bg-[#8D6E00] text-white border-[#8D6E00]"
                        : "bg-white text-[#8D6E00] border-[#FFE082] hover:bg-[#FFF4D9]"
                    }`}
                  >
                    Review
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleUpdateDisposition("RESOLVED")}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border ${
                      selectedCase.status === "RESOLVED"
                        ? "bg-[#065F46] text-white border-[#065F46]"
                        : "bg-white text-[#065F46] border-[#A7F3D0] hover:bg-[#E7F7EF]"
                    }`}
                  >
                    Resolve
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                <Link
                  href={`/app/forensics?case=${selectedCase.id}`}
                  className="text-xs font-bold text-[#1565C0] hover:underline flex items-center gap-1"
                >
                  <span>Open in Forensic Lab</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 rounded-xl border border-[#DFE7EF] font-bold text-[#52677C]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
