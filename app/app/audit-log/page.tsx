import type { Metadata } from "next";
import { ScrollText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Cryptographic Audit Log | VoiceShield SOC",
  description: "Immutable append-only audit trail recording every inspection, export, and operator decision.",
};

const LOG_ENTRIES = [
  { action: "SESSION_INSPECTED", actor: "analyst@enterprise.com", target: "SES-9812", time: "5 mins ago", outcome: "NORMAL" },
  { action: "INCIDENT_QUARANTINED", actor: "system_policy_engine", target: "SES-8821", time: "12 mins ago", outcome: "BLOCKED" },
  { action: "CERTIFICATE_GENERATED", actor: "compliance@enterprise.com", target: "INC-2026-8812", time: "2 hours ago", outcome: "SIGNED" }
];

export default function AuditLogPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Cryptographic Audit Log</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Append-only tamper-resistant record preserving audit integrity for judicial and compliance verification.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#F7F9FC] text-[#52677C] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Actor</th>
              <th className="px-6 py-3">Target Reference</th>
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {LOG_ENTRIES.map((e, idx) => (
              <tr key={idx} className="hover:bg-[#F8FAFC]">
                <td className="px-6 py-4 font-mono font-bold text-[#0B2545]">{e.action}</td>
                <td className="px-6 py-4 text-[#52677C]">{e.actor}</td>
                <td className="px-6 py-4 font-mono text-xs text-[#0B2545]">{e.target}</td>
                <td className="px-6 py-4 text-[#52677C]">{e.time}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F7EF] text-[#065F46] border border-[#A7F3D0]">
                    {e.outcome}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
