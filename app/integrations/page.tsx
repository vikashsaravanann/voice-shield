import type { Metadata } from "next";
import Link from "next/link";
import { PhoneCall, Webhook, Server, Database, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Integrations & APIs | VoiceShield",
  description: "Native connectors for Twilio Voice, FreeSWITCH, SIP forks, and REST/WebSocket APIs.",
};

const INTEGRATIONS = [
  {
    icon: PhoneCall,
    name: "Twilio Voice Media Streams",
    status: "CONFIGURABLE",
    statusColor: "bg-[#E7F3FF] text-[#1565C0] border-[#BBDEFB]",
    desc: "Stream real-time bi-directional audio directly from Twilio phone numbers via TwiML Media Streams."
  },
  {
    icon: Server,
    name: "Raw PCM16 WebSocket Stream",
    status: "AVAILABLE",
    statusColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "Standard high-performance WebSocket endpoint accepting raw 16kHz PCM16 audio buffers from any client or PBX."
  },
  {
    icon: Webhook,
    name: "Outbound Incident Webhooks",
    status: "AVAILABLE",
    statusColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "Post structured incident JSON payloads to external SIEMs, Splunk, Slack, or automated incident dispatch queues."
  },
  {
    icon: Database,
    name: "Supabase Postgres Auditing",
    status: "AVAILABLE",
    statusColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "Tamper-resistant audit logs and caller session metadata with fine-grained Row-Level Security (RLS)."
  }
];

export default function IntegrationsPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <Webhook className="w-3.5 h-3.5" />
            <span>Telephony & API Ecosystem</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Seamless Integration with Your Voice Stack
          </h1>
          <p className="text-base text-[#52677C] leading-relaxed">
            Plug VoiceShield into your existing telephony providers, contact center platforms, and SOC monitoring tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INTEGRATIONS.map((i) => {
            const Icon = i.icon;
            return (
              <div key={i.name} className="p-8 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF] flex flex-col justify-between hover:border-[#1565C0] transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#1565C0]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${i.statusColor}`}>
                      {i.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0B2545] mb-2">{i.name}</h3>
                  <p className="text-sm text-[#52677C] leading-relaxed">{i.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href="/docs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors">
            <span>Explore Developer Documentation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
