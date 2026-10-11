import { ThreatMap } from "@/components/ThreatMap";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function WorkspaceThreatMapPage() {
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
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Geographic Threat Distribution</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Origin telemetry, caller exchange routing anomalies, and synthetic attack distribution.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm">
        <ThreatMap sessions={sessions} />
      </div>
    </div>
  );
}
