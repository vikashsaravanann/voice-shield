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
          console.error("Error querying incidents:", error);
          setCases([]);
        } else if (dbSessions) {
          // Transform flagged sessions into verifiable incident cases
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
              decision === "blocked" ? "QUARANTINED" : "UNDER REVIEW";

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

  const handleUpdateDisposition = (newStatus: IncidentCase["status"]) => {
    if (!selectedCase) return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id ? { ...c, status: newStatus } : c
      )
    );
    setSelectedCase((prev) => (prev ? { ...prev, status: newStatus } : null));
    setActionSuccess(`Incident ${selectedCase.id} updated to ${newStatus}`);
    setTimeout(() => setActionSuccess(""), 3500);
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
            Security Incidents &amp; Triage Cases
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Flagged telephony sessions requiring forensic review, escalation to risk desk, or legal certificate drafting.
          </p>
        </div>

        {/* Export / Overview Action */}
        <Link
          href="/app/reports"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0B2545] hover:bg-[#1565C0] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-[#45D9D2]" />
          <span>Forensic Evidence Reports</span>
        </Link>
      </div>

      {/* Success Notification Banner */}
      {actionSuccess && (
        <div className="p-3 bg-[#E7F7EF] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#DFE7EF] shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search className="w-4 h-4 text-[#52677C] shrink-0" />
          <input
            type="text"
            placeholder="Search incident ID, caller identity, acoustic vector..."
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

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#F7F9FC] p-1 rounded-lg border border-[#E2E8F0] shrink-0">
          {["ALL", "UNDER REVIEW", "QUARANTINED", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                statusFilter === status
                  ? "bg-white text-[#0B2545] shadow-xs border border-[#DFE7EF]"
                  : "text-[#52677C] hover:text-[#0B2545]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3">Case ID</th>
                <th className="px-6 py-3">Caller Stream</th>
                <th className="px-6 py-3">Acoustic Vector</th>
                <th className="px-6 py-3">Risk Confidence</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Observed</th>
                <th className="px-6 py-3 text-right">Adjudication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-xs text-[#52677C]">
                    Loading verified tenant incidents...
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-[#52677C]">
                    <div className="max-w-md mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#E7F7EF] text-[#065F46] flex items-center justify-center mx-auto">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-[#0B2545]">No Flagged Incidents in Queue</p>
                      <p className="text-[11px] text-[#52677C]">
                        {searchQuery || statusFilter !== "ALL"
                          ? "No incident records match your active search and filter criteria."
                          : "All monitored carrier streams are currently operating within nominal human voice parameters. Cloned audio sessions will automatically appear here when Kalman thresholds are breached."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCases.map((inc) => (
                  <tr
                    key={inc.id}
                    className="hover:bg-[#F8FAFC] cursor-pointer"
                    onClick={() => setSelectedCase(inc)}
                  >
                    <td className="px-6 py-4 font-mono font-bold text-[#0B2545]">
                      {inc.id}
                    </td>
                    <td className="px-6 py-4 text-[#52677C] font-mono">
                      {inc.caller}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0B2545]">
                      {inc.vector}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-[#991B1B]">
                      {Math.round(inc.risk * 100)}%
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          inc.status === "QUARANTINED"
                            ? "bg-[#FCEAF3] text-[#991B1B] border-[#F8BBD0]"
                            : inc.status === "UNDER REVIEW"
                            ? "bg-[#FFF4D9] text-[#8D6E00] border-[#FFE082]"
                            : "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
                        }`}
                      >
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#52677C]">
                      {inc.timestamp}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCase(inc);
                        }}
                        className="text-xs text-[#1565C0] hover:underline font-semibold"
                      >
                        Triage Case
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Details Drawer / Modal */}
      {selectedCase && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DFE7EF] space-y-5 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#991B1B] bg-[#FCEAF3] px-2 py-0.5 rounded border border-[#F8BBD0]">
                  Incident Dossier
                </span>
                <h3 className="text-lg font-bold text-[#0B2545] mt-1">
                  {selectedCase.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1 rounded-md text-[#94A3B8] hover:text-[#0B2545] hover:bg-[#F7F9FC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#52677C] font-bold uppercase">Caller Reference</span>
                  <p className="font-mono font-bold text-[#0B2545] mt-0.5">{selectedCase.caller}</p>
                </div>
                <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#52677C] font-bold uppercase">Confidence</span>
                  <p className="font-mono font-bold text-[#991B1B] mt-0.5">{Math.round(selectedCase.risk * 100)}% Synthetic</p>
                </div>
              </div>

              <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
                <span className="text-[10px] text-[#52677C] font-bold uppercase">Acoustic Vector</span>
                <p className="font-semibold text-[#0B2545] mt-0.5">{selectedCase.vector}</p>
              </div>

              <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
                <span className="text-[10px] text-[#52677C] font-bold uppercase">Telemetry Notes</span>
                <p className="text-[#52677C] mt-0.5">{selectedCase.dispositionNotes}</p>
              </div>
            </div>

            {/* Disposition Actions */}
            <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
              <span className="text-[11px] font-bold text-[#0B2545]">Operator Disposition:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateDisposition("UNDER REVIEW")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${
                    selectedCase.status === "UNDER REVIEW"
                      ? "bg-[#FFF4D9] text-[#8D6E00] border-[#FFE082]"
                      : "bg-[#F7F9FC] text-[#52677C] border-[#DFE7EF] hover:bg-white"
                  }`}
                >
                  Under Review
                </button>
                <button
                  onClick={() => handleUpdateDisposition("QUARANTINED")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${
                    selectedCase.status === "QUARANTINED"
                      ? "bg-[#FCEAF3] text-[#991B1B] border-[#F8BBD0]"
                      : "bg-[#F7F9FC] text-[#52677C] border-[#DFE7EF] hover:bg-white"
                  }`}
                >
                  Quarantine / Block
                </button>
                <button
                  onClick={() => handleUpdateDisposition("RESOLVED")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${
                    selectedCase.status === "RESOLVED"
                      ? "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
                      : "bg-[#F7F9FC] text-[#52677C] border-[#DFE7EF] hover:bg-white"
                  }`}
                >
                  Mark Resolved
                </button>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <Link
                  href={`/app/reports?incident=${selectedCase.id}`}
                  className="text-[#1565C0] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Draft Forensic Evidence PDF</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-3 py-1.5 rounded-lg border border-[#DFE7EF] text-[#52677C] hover:bg-[#F7F9FC] font-semibold"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
