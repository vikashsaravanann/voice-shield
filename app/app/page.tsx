import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Activity,
  ShieldAlert,
  Radio,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  History,
  FileText,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  const underReview = sessions.filter(
    (s) => s.status === "active" || s.risk_summary?.decision === "challenge"
  ).length;

  const averageRisk = total
    ? Math.round(
        (sessions.reduce(
          (sum, session) => sum + Number(session.risk_summary?.avg_risk ?? 0),
          0
        ) /
          total) *
          100
      )
    : 0;

  const latencyValues = sessions
    .map((session) => Number(session.risk_summary?.latency_ms))
    .filter((latency) => Number.isFinite(latency) && latency > 0);

  const averageLatency = latencyValues.length
    ? `${Math.round(
        latencyValues.reduce((sum, latency) => sum + latency, 0) /
          latencyValues.length
      )} ms`
    : "Awaiting Data";

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              TENANT SOC OVERVIEW
            </span>
            <span className="text-xs text-[#52677C]">
              Node: Production Primary
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Security Operations Center (SOC)
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Live telemetry, acoustic threat mitigation, and real-time carrier call stream oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/app/detection"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1565C0] hover:bg-[#0B2545] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-[#45D9D2]" />
            <span>Launch Live Console</span>
          </Link>
          <Link
            href="/app"
            className="p-2 bg-white hover:bg-[#F7F9FC] text-[#52677C] border border-[#E2E8F0] rounded-lg text-xs font-medium transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Monitored Sessions */}
        <div className="bg-white rounded-2xl p-5 border border-[#DFE7EF] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#52677C] uppercase tracking-wider">
              Total Monitored Calls
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E7F3FF] flex items-center justify-center text-[#1565C0]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#0B2545] tracking-tight">
              {total}
            </div>
            <p className="text-[11px] text-[#52677C] mt-1 flex items-center gap-1">
              <span>Scoped to authenticated tenant</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Spoofs & Attacks Blocked */}
        <div className="bg-white rounded-2xl p-5 border border-[#DFE7EF] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#52677C] uppercase tracking-wider">
              Synthetic Clones Blocked
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FCEAF3] flex items-center justify-center text-[#991B1B]">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#991B1B] tracking-tight">
              {blocked}
            </div>
            <p className="text-[11px] text-[#52677C] mt-1">
              {total > 0
                ? `${Math.round((blocked / total) * 100)}% of monitored streams`
                : "Zero flagged attacks recorded"}
            </p>
          </div>
        </div>

        {/* Metric 3: Mean Acoustic Latency */}
        <div className="bg-white rounded-2xl p-5 border border-[#DFE7EF] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#52677C] uppercase tracking-wider">
              Mean DSP Latency
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF4D9] flex items-center justify-center text-[#8D6E00]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#0B2545] tracking-tight">
              {averageLatency}
            </div>
            <p className="text-[11px] text-[#52677C] mt-1">
              {latencyValues.length
                ? "Measured across live PCM frames"
                : "No latency fallback fabricated"}
            </p>
          </div>
        </div>

        {/* Metric 4: Average Risk Confidence */}
        <div className="bg-white rounded-2xl p-5 border border-[#DFE7EF] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#52677C] uppercase tracking-wider">
              Average Risk Score
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E7F7EF] flex items-center justify-center text-[#065F46]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#0B2545] tracking-tight">
              {total > 0 ? `${averageRisk}%` : "0%"}
            </div>
            <p className="text-[11px] text-[#52677C] mt-1">
              {averageRisk < 35
                ? "Optimal acoustic baseline"
                : averageRisk < 75
                ? "Elevated scrutiny threshold"
                : "High spoofing activity"}
            </p>
          </div>
        </div>
      </div>

      {/* Operational Assurance Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#DFE7EF] shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E7F7EF] text-[#065F46] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#0B2545] uppercase tracking-wider">
              Active Prevention Loop
            </h2>
            <p className="text-xs text-[#52677C] mt-0.5">
              Continuous Spectral Flux &rarr; Dynamic Replay Challenge &rarr; In-Call Drop
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#DFE7EF] shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E7F3FF] text-[#1565C0] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#0B2545] uppercase tracking-wider">
              Zero-Persistence Audio
            </h2>
            <p className="text-xs text-[#52677C] mt-0.5">
              Raw PCM audio buffers destroyed in volatile RAM immediately after DSP feature extraction.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#DFE7EF] shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFF4D9] text-[#8D6E00] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#0B2545] uppercase tracking-wider">
              Section 65B Admissibility
            </h2>
            <p className="text-xs text-[#52677C] mt-0.5">
              Tamper-evident forensic hashes generated for court-grade electronic evidence packages.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Sessions Table & Feed */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0B2545]">
              Recent Monitored Telephony Streams
            </h2>
            <p className="text-xs text-[#52677C]">
              Most recent call sessions analyzed by the VoiceShield DSP and ML inference pipeline.
            </p>
          </div>
          <Link
            href="/app/sessions"
            className="text-xs font-semibold text-[#1565C0] hover:underline flex items-center gap-1"
          >
            <span>View All Sessions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3">Session Token</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Max Risk</th>
                <th className="px-6 py-3">Latency</th>
                <th className="px-6 py-3">Policy Decision</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-[#52677C]">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-10 h-10 rounded-full bg-[#E7F3FF] text-[#1565C0] flex items-center justify-center mx-auto">
                        <Radio className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-[#0B2545]">No Telephony Sessions Recorded Yet</p>
                      <p className="text-[11px] text-[#52677C]">
                        Your workspace is initialized and ready. Open the Live Detection Console to start streaming real microphone audio or connect a SIP trunk.
                      </p>
                      <Link
                        href="/app/detection"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1565C0] text-white font-semibold text-xs rounded-lg hover:bg-[#0B2545] transition-colors"
                      >
                        Start Live Detection
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                sessions.slice(0, 8).map((s) => {
                  const maxRisk = Number(s.risk_summary?.max_risk ?? 0);
                  const isFlagged = maxRisk >= 0.75 || s.status === "flagged";
                  const decision = s.risk_summary?.decision ?? (isFlagged ? "BLOCKED" : "PASSED");

                  return (
                    <tr key={s.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4 font-mono text-xs text-[#0B2545] font-semibold">
                        {s.id.slice(0, 16)}...
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
                        {s.risk_summary?.latency_ms
                          ? `${s.risk_summary.latency_ms} ms`
                          : "Measured live"}
                      </td>
                      <td className="px-6 py-4 font-semibold">
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
                        <Link
                          href={`/app/sessions?session=${s.id}`}
                          className="text-xs font-semibold text-[#1565C0] hover:underline"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
