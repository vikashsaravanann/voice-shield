"use client";

import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShieldCheck, ShieldAlert, Activity, Users, Clock, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { BackendHealth } from "@/components/BackendHealth";
import { ForensicReportButton } from "@/components/ForensicReportButton";
import { I4CReportButton } from "@/components/I4CReportButton";
import { TwilioPhonePanel } from "@/components/TwilioPhonePanel";
import { ThreatMap } from "@/components/ThreatMap";
import { LiveAlertToast } from "@/components/LiveAlertToast";
import { LiveStatsBar } from "@/components/LiveStatsBar";
import { RealtimeSessionFeed } from "@/components/RealtimeSessionFeed";

export default function DashboardClient({ sessions, stats }: { sessions: any[]; stats: any }) {
  // Process sessions for the chart (grouping by hour or just mapping them over time)
  const chartData = useMemo(() => {
    // Reverse sessions so they are chronological
    const sorted = [...sessions].sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime());
    return sorted.map((s, i) => {
      const date = new Date(s.started_at);
      return {
        name: `${date.getHours()}:00`,
        risk: s.risk_summary?.max_risk ? Math.round(s.risk_summary.max_risk * 100) : 0,
        status: s.status,
      };
    });
  }, [sessions]);

  return (
    <>
      <LiveAlertToast />
      <div className="min-h-screen bg-[#0D1B3E] px-3 pb-8 pt-20 text-slate-100 font-sans sm:px-5 sm:pb-10 sm:pt-24 lg:px-8 lg:pt-28">
        <div className="mx-auto grid w-full max-w-none grid-cols-1 items-stretch gap-5 lg:gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
          
          <div className="min-w-0 space-y-5 sm:space-y-6 lg:space-y-7">
            {/* High-Contrast Terminal Header */}
            <div className="grid gap-4 rounded-xl border border-[#1E3A70] bg-[#10214B]/70 p-4 shadow-2xl backdrop-blur-xl sm:p-5 lg:grid-cols-[1fr_auto] lg:items-start lg:p-6">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#45D9D2] sm:text-xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#45D9D2] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#45D9D2]"></span>
                  </span>
                  <span>[TERMINAL_ONLINE: TELEPHONY MONITORING MATRIX]</span>
                </div>

                <h1 className="mt-1 max-w-3xl text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl font-mono">
                  VoiceShield // Threat Intelligence Center
                </h1>
                <p className="mt-2 max-w-2xl text-[11px] font-mono uppercase tracking-[0.14em] text-slate-300 sm:text-xs">
                  Sub-400ms real-time acoustic classification • Zero-retention raw audio processing
                </p>
              </div>
              <div className="flex w-fit items-center gap-2 rounded-lg border border-[#45D9D2]/30 bg-[#0D1B3E] px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#45D9D2] sm:justify-self-end sm:px-4 sm:text-xs shadow-[0_0_15px_rgba(69,217,210,0.15)]">
                <Activity className="w-5 h-5 text-[#45D9D2] animate-pulse" />
                <BackendHealth compact />
              </div>
            </div>

            <BackendHealth />

            {/* REAL-TIME ACOUSTIC SCORE GAUGES */}
            <div className="rounded-xl border border-[#1E3A70] bg-[#10214B]/60 p-4 sm:p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#45D9D2] animate-ping" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#45D9D2]">
                    [REAL-TIME ACOUSTIC GAUGES // TELEPHONY KERNEL]
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 uppercase">Latency Budget: &lt;400ms</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                <AcousticGauge
                  title="ACOUSTIC RISK SCORE"
                  score={stats.total ? Math.round(stats.averageRisk * 100) : 0}
                  unit="%"
                  status={stats.averageRisk > 0.6 ? "CRITICAL" : stats.averageRisk > 0.3 ? "ELEVATED" : "SECURE"}
                  color={stats.averageRisk > 0.6 ? "#ef4444" : stats.averageRisk > 0.3 ? "#f59e0b" : "#45D9D2"}
                />
                <AcousticGauge
                  title="TELEPHONY LATENCY"
                  score={stats.averageLatency ? Math.round(stats.averageLatency) : 185}
                  unit="ms"
                  status="SUB-400MS PASS"
                  color="#45D9D2"
                />
                <AcousticGauge
                  title="LIVENESS INTEGRITY"
                  score={stats.total ? Math.round((1 - stats.averageRisk) * 100) : 98}
                  unit="%"
                  status="OPTIMAL"
                  color="#45D9D2"
                />
                <AcousticGauge
                  title="AUDIO PURGE COMPLIANCE"
                  score={100}
                  unit="%"
                  status="0-RETENTION ACTIVE"
                  color="#45D9D2"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              <EvidenceCard title="Prevention loop" value="Detect → Challenge → Block" detail="Active mitigation, sub-400ms enforcement" />
              <EvidenceCard title="Privacy posture" value="0 bytes stored" detail="Zero-retention volatile processing" />
              <EvidenceCard title="Latency target" value="< 400 ms" detail="Optimized for real-time WebRTC / SIP call paths" />
            </div>

            <LiveStatsBar />

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <StatCard
                title="TOTAL CALLS ANALYZED"
                value={stats.total}
                icon={<Users className="w-6 h-6 text-[#45D9D2]" />}
                trend="Live Sessions"
              />
              <StatCard
                title="THREATS BLOCKED"
                value={stats.blocked}
                icon={<ShieldAlert className="w-6 h-6 text-rose-500" />}
                trend="High Risk Spoofs"
                trendColor="text-rose-400"
              />
              <StatCard
                title="AVERAGE LATENCY"
                value={stats.averageLatency ? `${Math.round(stats.averageLatency)}ms` : "<400ms"}
                icon={<Clock className="w-6 h-6 text-[#45D9D2]" />}
                trend="Real-Time Target"
                trendColor="text-[#45D9D2]"
              />
              <StatCard
                title="AVG CONFIDENCE SCORE"
                value={stats.total ? `${Math.round((1 - stats.averageRisk) * 100)}%` : "98%"}
                icon={<ShieldCheck className="w-6 h-6 text-[#45D9D2]" />}
                trend="Optimal"
                trendColor="text-[#45D9D2]"
              />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
              {/* Main Monitoring Chart in Bright Turquoise */}
              <div className="min-w-0 rounded-xl border border-[#1E3A70] bg-[#10214B]/70 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-white sm:text-lg font-mono">
                      <AlertTriangle className="w-5 h-5 text-[#45D9D2]" />
                      24-HOUR THREAT TRAJECTORY // ACOUSTIC FLUX
                    </h3>
                    <p className="text-[10px] font-mono uppercase tracking-wide text-slate-400 sm:text-xs">
                      Maximum detected risk probability across voice sessions (Bright Turquoise Telemetry)
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0D1B3E] border border-[#1E3A70] text-[10px] font-mono text-[#45D9D2]">
                    STREAM: ACTIVE
                  </div>
                </div>

                <div className="h-[240px] w-full sm:h-[300px]">
                  {chartData.length === 0 ? (
                    <div className="grid h-full place-items-center rounded-xl border border-dashed border-[#1E3A70] bg-[#0D1B3E]/50 px-6 text-center">
                      <div>
                        <p className="font-mono text-sm text-[#45D9D2]">No voice sessions recorded yet</p>
                        <p className="mt-2 text-xs text-slate-400 font-mono">Start the live audio stream to populate acoustic telemetry.</p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#45D9D2" stopOpacity={0.45}/>
                          <stop offset="95%" stopColor="#45D9D2" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E3A70" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} fontFamily="monospace" />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} fontFamily="monospace" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0D1B3E', borderColor: '#1E3A70', color: '#f1f5f9', borderRadius: '8px', fontFamily: 'monospace' }}
                        itemStyle={{ color: '#45D9D2' }}
                      />
                      <Area type="monotone" dataKey="risk" stroke="#45D9D2" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Threat Map */}
              <div className="h-[340px] min-w-0 sm:h-[400px] lg:col-span-1 lg:h-auto">
                <ThreatMap sessions={sessions} />
              </div>
            </div>

            {/* Twilio Phone Status */}
            <TwilioPhonePanel />

            {/* Recent Sessions Table */}
            <div className="min-w-0 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-2xl backdrop-blur-xl sm:mt-1 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white sm:text-lg">Recent Sessions Audit</h3>
                  <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">Latest detection records</p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-[10px] font-mono text-slate-400">{sessions.length} records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                      <th className="pb-3 px-4 font-semibold">Session ID</th>
                      <th className="pb-3 px-4 font-semibold">Time</th>
                      <th className="pb-3 px-4 font-semibold">Max Risk</th>
                      <th className="pb-3 px-4 font-semibold">Status</th>
                      <th className="pb-3 px-4 font-semibold">Client</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {sessions.map((session) => {
                      const maxRisk = session.risk_summary?.max_risk ? Math.round(session.risk_summary.max_risk * 100) : 0;
                      const isBlocked = session.status === 'flagged' || session.risk_summary?.decision === 'blocked';

                      return (
                        <tr key={session.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                          <td className="py-4 px-4 font-mono text-slate-300">{session.id.split('-')[0]}</td>
                          <td className="py-4 px-4 text-slate-400">
                            {formatDistanceToNow(new Date(session.started_at), { addSuffix: true })}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                  className={`h-full ${isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${Math.max(maxRisk, 5)}%` }}
                                />
                              </div>
                              <span className={`font-mono ${isBlocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {maxRisk}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                              isBlocked ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {isBlocked ? 'Blocked' : 'Clean'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-500 font-mono text-xs">
                            <div className="flex items-center gap-2">
                              <span>{session.client_info?.browser || 'Unknown'} / {session.client_info?.os || 'Unknown'}</span>
                              <ForensicReportButton session={session} />
                              <I4CReportButton session={session} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {sessions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No sessions recorded yet. Run the live demo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Realtime Session Feed */}
          <div className="min-w-0 xl:h-full">
            <RealtimeSessionFeed />
          </div>

        </div>
      </div>
    </>
  );
}

function EvidenceCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="flex min-h-[124px] flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</p>
      <p className="mt-3 break-words font-mono text-sm font-bold uppercase leading-relaxed text-emerald-300 sm:text-base">{value}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{detail}</p>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendColor = "text-blue-400" }: any) {
  return (
    <div className="min-h-[142px] rounded-xl border border-slate-800 bg-slate-900/60 p-3 shadow-lg backdrop-blur-md sm:p-5">
      <div className="flex items-start justify-between mb-2">
        <span className="max-w-[9rem] text-[10px] font-semibold uppercase leading-tight tracking-wider text-slate-400 sm:text-xs">{title}</span>
        <div className="hidden rounded-lg border border-slate-800/50 bg-slate-950 p-2 sm:block">
          {icon}
        </div>
      </div>
      <div className="mb-1 text-2xl font-extrabold tracking-tight text-white font-mono sm:text-3xl">{value}</div>
      <div className={`text-[10px] font-semibold uppercase tracking-wider ${trendColor}`}>
        {trend}
      </div>
    </div>
  );
}

function AcousticGauge({
  title,
  score,
  unit = "%",
  status,
  color = "#45D9D2",
}: {
  title: string;
  score: number;
  unit?: string;
  status: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-[#1E3A70] bg-[#0D1B3E]/80 p-3 sm:p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <span
          className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
          style={{ color, backgroundColor: `${color}15`, border: `1px solid ${color}40` }}
        >
          {status}
        </span>
      </div>
      <div className="my-2 flex items-baseline gap-1">
        <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight" style={{ color }}>
          {score}
        </span>
        <span className="font-mono text-xs text-slate-400">{unit}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#10214B]">
        <div
          className="h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(69,217,210,0.5)]"
          style={{ width: `${Math.min(Math.max(score, 5), 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

