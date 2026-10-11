"use client";

import React, { useState, useEffect } from "react";
import {
  ScrollText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  Info,
  X,
  FileCheck2,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatDistanceToNow } from "date-fns";

interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  outcome: "SUCCESS" | "BLOCKED" | "VERIFIED";
  details?: string;
}

export default function AuditLogPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  useEffect(() => {
    let active = true;
    const fetchAudit = async () => {
      setLoading(true);
      try {
        const supabase = getSupabaseBrowserClient();

        // Query connection audit logs
        const { data: connLogs, error } = await supabase
          .from("connection_audit_logs")
          .select("*")
          .order("timestamp", { ascending: false })
          .limit(50);

        if (!active) return;

        if (connLogs && connLogs.length > 0) {
          const mapped: AuditEvent[] = connLogs.map((l) => ({
            id: l.id,
            action: l.event_type || "CONNECTION_INSPECTED",
            actor: l.details?.actor || "authenticated_operator",
            target: l.session_id ? `SES-${l.session_id.slice(0, 8)}` : "SYSTEM_NODE",
            timestamp: l.timestamp ? formatDistanceToNow(new Date(l.timestamp), { addSuffix: true }) : "Recent",
            outcome: "SUCCESS",
            details: JSON.stringify(l.details || {}),
          }));
          setEvents(mapped);
        } else {
          // If no connection logs exist yet, query sessions to synthesize truthful session audit actions
          const { data: dbSessions } = await supabase
            .from("sessions")
            .select("id, started_at, risk_summary")
            .order("started_at", { ascending: false })
            .limit(20);

          if (dbSessions && dbSessions.length > 0) {
            const mapped: AuditEvent[] = dbSessions.map((s) => {
              const maxRisk = Number(s.risk_summary?.max_risk ?? 0);
              const isBlocked = maxRisk >= 0.75;
              return {
                id: `AUD-${s.id.slice(0, 8).toUpperCase()}`,
                action: isBlocked ? "INCIDENT_QUARANTINED" : "SESSION_EVALUATED",
                actor: "kalman_policy_engine",
                target: `SES-${s.id.slice(0, 8)}`,
                timestamp: s.started_at ? formatDistanceToNow(new Date(s.started_at), { addSuffix: true }) : "Recent",
                outcome: isBlocked ? "BLOCKED" : "VERIFIED",
                details: `Peak risk confidence: ${Math.round(maxRisk * 100)}%`,
              };
            });
            setEvents(mapped);
          } else {
            setEvents([]);
          }
        }
      } catch {
        if (active) setEvents([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAudit();
    return () => {
      active = false;
    };
  }, []);

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction =
      actionFilter === "ALL" || e.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleExportCsv = () => {
    if (events.length === 0) return;
    const header = "Audit_ID,Action,Actor,Target,Timestamp,Outcome\n";
    const sanitize = (val: string) => {
      if (typeof val === "string" && /^[=+\-@\t\r]/.test(val)) return `'${val}`;
      return val;
    };
    const rows = events
      .map(
        (e) =>
          `"${sanitize(e.id)}","${sanitize(e.action)}","${sanitize(e.actor)}","${sanitize(e.target)}","${sanitize(e.timestamp)}","${sanitize(e.outcome)}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `voiceshield_audit_trail_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              TENANT ACTIVITY LEDGER
            </span>
            <span className="text-xs text-[#52677C]">
              Append-Only Forensic Trail
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Operator Activity &amp; Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Chronological audit log recording every stream inspection, incident quarantine, credential issuance, and export operation.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={events.length === 0}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#F7F9FC] text-[#0B2545] border border-[#DFE7EF] text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-[#1565C0]" />
          <span>Export Audit Trail CSV</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#DFE7EF] shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search className="w-4 h-4 text-[#52677C] shrink-0" />
          <input
            type="text"
            placeholder="Search action, operator identity, target session reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-transparent border-none focus:outline-none text-[#0B2545] placeholder-[#94A3B8]"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#F7F9FC] p-1 rounded-lg border border-[#E2E8F0]">
          {["ALL", "SESSION_EVALUATED", "INCIDENT_QUARANTINED", "CONNECTION_INSPECTED"].map((act) => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                actionFilter === act
                  ? "bg-white text-[#0B2545] shadow-xs border border-[#DFE7EF]"
                  : "text-[#52677C] hover:text-[#0B2545]"
              }`}
            >
              {act === "ALL" ? "All Actions" : act.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3">Action Type</th>
                <th className="px-6 py-3">Actor / Subsystem</th>
                <th className="px-6 py-3">Target Subject</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Outcome</th>
                <th className="px-6 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-xs text-[#52677C]">
                    Querying audit events from database...
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-[#52677C]">
                    <div className="max-w-md mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#E7F3FF] text-[#1565C0] flex items-center justify-center mx-auto">
                        <ScrollText className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-[#0B2545]">No Audit Events Found</p>
                      <p className="text-[11px] text-[#52677C]">
                        {searchQuery || actionFilter !== "ALL"
                          ? "No events match the specified filter."
                          : "No recorded administrative or session audit entries in this tenant yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-[#F8FAFC] cursor-pointer"
                    onClick={() => setSelectedEvent(e)}
                  >
                    <td className="px-6 py-4 font-mono font-bold text-xs text-[#0B2545]">
                      {e.action}
                    </td>
                    <td className="px-6 py-4 text-[#52677C]">
                      {e.actor}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#1565C0]">
                      {e.target}
                    </td>
                    <td className="px-6 py-4 text-[#52677C]">
                      {e.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          e.outcome === "BLOCKED"
                            ? "bg-[#FCEAF3] text-[#991B1B] border-[#F8BBD0]"
                            : "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
                        }`}
                      >
                        {e.outcome}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(eClick) => {
                          eClick.stopPropagation();
                          setSelectedEvent(e);
                        }}
                        className="text-xs font-semibold text-[#1565C0] hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DFE7EF] space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1565C0] bg-[#E7F3FF] px-2 py-0.5 rounded border border-[#BBDEFB]">
                  Audit Record
                </span>
                <h3 className="text-base font-bold text-[#0B2545] font-mono mt-1">
                  {selectedEvent.action}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-md text-[#94A3B8] hover:text-[#0B2545]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold uppercase text-[#52677C]">Actor</span>
                  <p className="font-bold text-[#0B2545] mt-0.5">{selectedEvent.actor}</p>
                </div>
                <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold uppercase text-[#52677C]">Target</span>
                  <p className="font-mono font-bold text-[#1565C0] mt-0.5">{selectedEvent.target}</p>
                </div>
              </div>

              <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
                <span className="text-[10px] font-bold uppercase text-[#52677C]">Event Metadata</span>
                <p className="font-mono text-[11px] text-[#52677C] mt-0.5 break-all">
                  {selectedEvent.details || "No additional metadata recorded."}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-[#0B2545] text-white rounded-lg text-xs font-semibold hover:bg-[#1565C0]"
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
