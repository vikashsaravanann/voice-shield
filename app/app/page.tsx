import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/app/dashboard/DashboardClient";

export const revalidate = 0;

export default async function WorkspaceOverviewPage() {
  const supabase = await createClient();

  const { data: dbSessions, error } = await supabase
    .from("sessions")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Unable to load workspace sessions:", error.message);
  }

  const sessions = dbSessions ?? [];
  const total = sessions.length;
  const blocked = sessions.filter(
    (s) => s.status === "flagged" || s.risk_summary?.decision === "blocked"
  ).length;
  const averageRisk = total
    ? sessions.reduce(
        (sum, session) => sum + Number(session.risk_summary?.avg_risk ?? 0),
        0
      ) / total
    : 0;
  const latencyValues = sessions
    .map((session) => Number(session.risk_summary?.latency_ms))
    .filter((latency) => Number.isFinite(latency) && latency > 0);

  const stats = {
    total,
    blocked,
    averageRisk,
    averageLatency: latencyValues.length
      ? latencyValues.reduce((sum, latency) => sum + latency, 0) / latencyValues.length
      : 84,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Security Operations Center (SOC)
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Real-time telephony stream monitoring, synthetic voice detection, and incident response.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E7F7EF] text-[#065F46] border border-[#A7F3D0] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Active Stream Interceptor</span>
          </span>
        </div>
      </div>

      <div className="bg-[#0B2545] rounded-2xl p-4 sm:p-6 shadow-md text-white">
        <DashboardClient sessions={sessions} stats={stats} />
      </div>
    </div>
  );
}
