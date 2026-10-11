import type { Metadata } from "next";
import { BarChart3, TrendingUp, Clock, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Telemetry & Model Drift Analytics | VoiceShield",
  description: "Acoustic detection latency, false positive trends, and model drift statistics.",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Telemetry &amp; Model Drift</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Continuous statistical evaluation of FFT spectral features, inference latency, and false positive ratios.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#DFE7EF] shadow-sm">
          <p className="text-xs text-[#52677C] font-semibold uppercase">P95 Stream Latency</p>
          <p className="text-3xl font-black text-[#0B2545] mt-2">64ms</p>
          <p className="text-xs text-[#10B981] mt-1">Within SLA (&lt;85ms target)</p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-[#DFE7EF] shadow-sm">
          <p className="text-xs text-[#52677C] font-semibold uppercase">Model Drift Index</p>
          <p className="text-3xl font-black text-[#0B2545] mt-2">0.03</p>
          <p className="text-xs text-[#10B981] mt-1">Stable baseline</p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-[#DFE7EF] shadow-sm">
          <p className="text-xs text-[#52677C] font-semibold uppercase">Kalman Filter Smoothing</p>
          <p className="text-3xl font-black text-[#0B2545] mt-2">99.4%</p>
          <p className="text-xs text-[#52677C] mt-1">Transient spike suppression</p>
        </div>
      </div>
    </div>
  );
}
