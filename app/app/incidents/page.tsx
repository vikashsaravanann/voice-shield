import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ShieldAlert, CheckCircle2, FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Incident Cases | VoiceShield SOC",
  description: "Flagged call incidents, synthetic risk alerts, and operator disposition cases.",
};

const SAMPLE_INCIDENTS = [
  {
    id: "INC-2026-8821",
    caller: "+91 98201 XXXXX",
    timestamp: "10 mins ago",
    vector: "XTTS Zero-Shot Clone",
    risk: "0.94",
    status: "QUARANTINED",
    statusColor: "bg-[#FCEAF3] text-[#991B1B] border-[#F8BBD0]"
  },
  {
    id: "INC-2026-8819",
    caller: "+1 415 555 XXXX",
    timestamp: "1 hour ago",
    vector: "Acoustic Splice / Replay",
    risk: "0.81",
    status: "UNDER REVIEW",
    statusColor: "bg-[#FFF4D9] text-[#8D6E00] border-[#FFE082]"
  },
  {
    id: "INC-2026-8812",
    caller: "+91 80 4123 XXXX",
    timestamp: "4 hours ago",
    vector: "Pitch Shifter / RVC",
    risk: "0.88",
    status: "RESOLVED",
    statusColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
  }
];

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Security Incidents &amp; Triage Cases
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Flagged telephony sessions requiring forensic review, law enforcement escalation, or customer contact.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3">Incident ID</th>
                <th className="px-6 py-3">Caller Identity</th>
                <th className="px-6 py-3">Acoustic Vector</th>
                <th className="px-6 py-3">Risk Confidence</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {SAMPLE_INCIDENTS.map((inc) => (
                <tr key={inc.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-6 py-4 font-mono font-bold text-[#0B2545]">{inc.id}</td>
                  <td className="px-6 py-4 text-[#52677C]">{inc.caller}</td>
                  <td className="px-6 py-4 font-medium text-[#0B2545]">{inc.vector}</td>
                  <td className="px-6 py-4 font-mono font-bold text-[#991B1B]">{inc.risk}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${inc.statusColor}`}>
                      {inc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/app/reports?incident=${inc.id}`} className="text-xs text-[#1565C0] hover:underline font-semibold">
                      Export Certificate
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
