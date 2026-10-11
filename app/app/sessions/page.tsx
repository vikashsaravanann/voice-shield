import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { PhoneCall, ShieldCheck, ShieldAlert, Clock } from "lucide-react";

export const revalidate = 0;

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data: dbSessions } = await supabase
    .from("sessions")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(50);

  const sessions = dbSessions ?? [];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Call Sessions History</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Log of recent telephone streams, duration, feature extractions, and final fraud classifications.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3">Session Token</th>
                <th className="px-6 py-3">Started</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Max Risk</th>
                <th className="px-6 py-3">Latency</th>
                <th className="px-6 py-3">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-xs text-[#52677C]">
                    No monitored sessions recorded in tenant database yet. Launch the Live Console to stream audio.
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4 font-mono text-xs text-[#0B2545]">{s.id.slice(0, 16)}...</td>
                    <td className="px-6 py-4 text-[#52677C]">
                      {s.started_at ? formatDistanceToNow(new Date(s.started_at), { addSuffix: true }) : "Recent"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-[#0B2545]">
                      {s.risk_summary?.max_risk ? Math.round(s.risk_summary.max_risk * 100) + "%" : "0%"}
                    </td>
                    <td className="px-6 py-4 text-[#52677C]">
                      {s.risk_summary?.latency_ms ? s.risk_summary.latency_ms + "ms" : "<85ms"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#0B2545]">
                      {s.risk_summary?.decision ?? "PASSED"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
