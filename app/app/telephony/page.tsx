"use client";

import React from "react";
import { TwilioPhonePanel } from "@/components/TwilioPhonePanel";
import { PhoneCall, ShieldCheck, Radio, Server, Info, ExternalLink, CheckCircle2 } from "lucide-react";

export default function WorkspaceTelephonyPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              CARRIER INTEGRATION
            </span>
            <span className="text-xs text-[#52677C]">
              SIP Trunking &bull; Twilio Voice &bull; FreeSWITCH G.711
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Telephony &amp; SIP Connections
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Ingest live telephone calls from carrier SIP trunks or CPaaS providers for real-time deepfake audio inspection.
          </p>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] text-xs text-[#52677C] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#1565C0] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#0B2545]">
            Carrier Ingestion Architecture
          </p>
          <p>
            VoiceShield operates as an out-of-band SIP packet analyzer or an inline proxy via standard G.711 &mu;-law/A-law media forks. Carrier credentials are stored exclusively in encrypted environment vaults and are never exposed in the browser.
          </p>
        </div>
      </div>

      {/* Live Carrier Panel */}
      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm">
        <TwilioPhonePanel />
      </div>

      {/* SIP Trunking & Integration Guides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-4 h-4 text-[#1565C0]" />
            <span className="font-bold text-[#0B2545]">Twilio Media Streams</span>
          </div>
          <p className="text-[#52677C]">Bidirectional WebSocket fork using TwiML &lt;Stream&gt; tag for 50Hz packet inspection.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-4 h-4 text-[#065F46]" />
            <span className="font-bold text-[#0B2545]">FreeSWITCH mod_audio_fork</span>
          </div>
          <p className="text-[#52677C]">High-density enterprise PBX connector forwarding raw 16-bit linear PCM streams.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-4 h-4 text-[#8D6E00]" />
            <span className="font-bold text-[#0B2545]">Asterisk AudioSocket</span>
          </div>
          <p className="text-[#52677C]">Zero-overhead Unix domain socket bridge for low-latency call center deployments.</p>
        </div>
      </div>
    </div>
  );
}
