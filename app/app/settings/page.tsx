import type { Metadata } from "next";
import { Settings, ShieldCheck, Database, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "System Settings & Privacy Defaults | VoiceShield",
  description: "Data retention schedules, zero-persistence toggles, and CSP configuration.",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Workspace Settings</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Configure ephemeral memory processing, risk thresholds, and tenant compliance policies.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm max-w-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <p className="text-sm font-bold text-[#0B2545]">Zero-Persistence Audio Buffering</p>
            <p className="text-xs text-[#52677C]">Purge PCM audio buffers from RAM immediately after feature extraction.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E7F7EF] text-[#065F46] border border-[#A7F3D0]">
            ENABLED
          </span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <p className="text-sm font-bold text-[#0B2545]">Automated Section 65B Signing</p>
            <p className="text-xs text-[#52677C]">Cryptographically sign all incident packages for Indian court admissibility.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E7F7EF] text-[#065F46] border border-[#A7F3D0]">
            ENABLED
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#0B2545]">Kalman Filter Sensitivity</p>
            <p className="text-xs text-[#52677C]">Balances transient spike rejection against sudden voice clone transition speed.</p>
          </div>
          <span className="font-mono text-xs font-bold text-[#0B2545]">0.85 (Recommended)</span>
        </div>
      </div>
    </div>
  );
}
