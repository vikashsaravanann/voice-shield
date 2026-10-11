import { ThreatMap } from "@/components/ThreatMap";
import { createClient } from "@/lib/supabase/server";
import { Globe, MapPin, ShieldAlert, ShieldCheck, Info, Table } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const revalidate = 0;

export default async function WorkspaceThreatMapPage() {
  const supabase = await createClient();
  const { data: dbSessions } = await supabase
    .from("sessions")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(50);

  const sessions = dbSessions ?? [];

  // Regional aggregated buckets
  const regionalBuckets = [
    { region: "India - National Capital Region (NCR / Delhi PoP)", active: 14, syntheticDetected: 2, status: "Normal" },
    { region: "India - Southern Hub (Chennai / Bangalore Gateway)", active: 22, syntheticDetected: 3, status: "Normal" },
    { region: "India - Western Hub (Mumbai Carrier Exchange)", active: 18, syntheticDetected: 1, status: "Normal" },
    { region: "International Inbound Media Gateways (G.711 / SIP)", active: 8, syntheticDetected: 4, status: "Elevated" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              GLOBAL ROUTING TELEMETRY
            </span>
            <span className="text-xs text-[#52677C]">
              Carrier Ingestion Origin Nodes
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Geographic Threat Distribution
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Carrier exchange routing anomalies, origin PoP aggregations, and synthetic attack distribution.
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] text-xs text-[#52677C] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#1565C0] shrink-0 mt-0.5" />
        <p>
          <strong>Privacy-Preserving Telemetry:</strong> All coordinates displayed reflect anonymized carrier Media Point-of-Presence (PoP) exchanges and country-level IP ranges. Exact subscriber GPS coordinates are never collected or processed, adhering to Section 3 of the DPDP Act 2023.
        </p>
      </div>

      {/* Regional Gateway Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {regionalBuckets.map((rb) => (
          <div key={rb.region} className="bg-white rounded-xl p-4 border border-[#DFE7EF] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#52677C]">PoP Gateway</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  rb.status === "Elevated"
                    ? "bg-[#FFF4D9] text-[#8D6E00] border-[#FFE082]"
                    : "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
                }`}
              >
                {rb.status}
              </span>
            </div>
            <p className="font-bold text-xs text-[#0B2545] truncate" title={rb.region}>
              {rb.region}
            </p>
            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#52677C]">
              <span>Active Streams: <strong>{rb.active}</strong></span>
              <span>Flagged: <strong className={rb.syntheticDetected > 0 ? "text-[#991B1B]" : "text-[#065F46]"}>{rb.syntheticDetected}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Map Visualizer */}
      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0B2545] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#1565C0]" />
            <span>Interactive Threat Vector Map</span>
          </h2>
          <span className="text-xs text-[#52677C]">
            Rendering {sessions.length} live carrier sessions
          </span>
        </div>
        <ThreatMap sessions={sessions} />
      </div>

      {/* Accessible Tabular Alternative */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0B2545] flex items-center gap-2">
              <Table className="w-4 h-4 text-[#1565C0]" />
              <span>Accessible Regional Ingestion Feed</span>
            </h2>
            <p className="text-xs text-[#52677C]">
              Tabular equivalent of spatial coordinate telemetry for assistive screen readers and compliance review.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3">Session Ref</th>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Carrier / Network</th>
                <th className="px-6 py-3">Gateway Location</th>
                <th className="px-6 py-3">Calculated Risk</th>
                <th className="px-6 py-3 text-right">Adjudication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-xs text-[#52677C]">
                    No monitored carrier sessions currently registered in the database.
                  </td>
                </tr>
              ) : (
                sessions.slice(0, 10).map((s) => {
                  const maxRisk = Number(s.risk_summary?.max_risk ?? 0);
                  const location = s.risk_summary?.location?.label || s.client_info?.carrier || "Standard Carrier Route";
                  return (
                    <tr key={s.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-[#0B2545]">
                        {s.id.slice(0, 16)}...
                      </td>
                      <td className="px-6 py-4 text-[#52677C]">
                        {s.started_at
                          ? formatDistanceToNow(new Date(s.started_at), { addSuffix: true })
                          : "Recent"}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#0B2545]">
                        {s.client_info?.carrier || "Enterprise SIP Trunk"}
                      </td>
                      <td className="px-6 py-4 text-[#52677C] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#1565C0] shrink-0" />
                        <span>{location}</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold">
                        <span className={maxRisk >= 0.75 ? "text-[#991B1B]" : maxRisk >= 0.35 ? "text-[#8D6E00]" : "text-[#065F46]"}>
                          {Math.round(maxRisk * 100)}%
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
