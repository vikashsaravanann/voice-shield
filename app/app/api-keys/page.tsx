import type { Metadata } from "next";
import { Key, Copy, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "API Keys & Telephony Tokens | VoiceShield",
  description: "Scoped API credentials for carrier media ingestion and WebSocket streaming.",
};

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Ingestion API Keys</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Authenticate external telephony servers, FreeSWITCH, or backend microservices to stream PCM audio.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">Production Stream Key</label>
          <div className="flex items-center gap-2">
            <input type="text" readOnly value="vs_live_79a2f1c84b9012e88a03" className="w-full font-mono text-xs px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-[#0B2545]" />
            <button className="px-3 py-2 bg-[#0B2545] text-white text-xs font-semibold rounded-lg">Copy</button>
          </div>
          <p className="text-[11px] text-[#52677C] mt-1">Bearer token required in WebSocket header or URL authorization token.</p>
        </div>
      </div>
    </div>
  );
}
