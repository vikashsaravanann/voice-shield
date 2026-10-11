import type { Metadata } from "next";
import { Webhook, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Outbound Webhooks | VoiceShield",
  description: "Real-time incident event dispatching to external SIEMs and automation workflows.",
};

export default function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Outbound Webhooks</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Configure HTTPS endpoints to receive structured JSON payloads whenever an interaction is flagged.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm space-y-4">
        <p className="text-xs text-[#52677C]">No outbound webhook destinations registered for this tenant.</p>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B2545] hover:bg-[#1565C0] text-white text-xs font-semibold rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" />
          <span>Register Endpoint</span>
        </button>
      </div>
    </div>
  );
}
