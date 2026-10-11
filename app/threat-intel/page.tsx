import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Threat Intelligence | VoiceShield Research",
  description: "Tracking synthetic speech attack vectors, neural TTS architectures, and telephony fraud trends.",
};

const THREATS = [
  {
    vector: "Zero-Shot Voice Cloners (VALL-E, XTTS, Chatterbox)",
    severity: "CRITICAL",
    severityColor: "bg-[#FCEAF3] text-[#991B1B] border-[#F8BBD0]",
    desc: "Requires as little as 3 seconds of clean target audio to generate arbitrary conversational speech mimicking voice timbre."
  },
  {
    vector: "Real-Time Neural Voice Changers (RVC, DDSP)",
    severity: "HIGH",
    severityColor: "bg-[#FFF4D9] text-[#8D6E00] border-[#FFE082]",
    desc: "Low-latency streaming models transforming a caller's voice in real-time to match executive or family member profiles."
  },
  {
    vector: "Replay & Acoustic Splicing Attacks",
    severity: "HIGH",
    severityColor: "bg-[#FFF4D9] text-[#8D6E00] border-[#FFE082]",
    desc: "Pre-recorded segments stitched together to answer standard identity verification questions without authentic live speech."
  },
  {
    vector: "Cellular Bandwidth Masking",
    severity: "MEDIUM",
    severityColor: "bg-[#E7F3FF] text-[#1565C0] border-[#BBDEFB]",
    desc: "Intentional channel degradation (AMR-NB 8kHz transcoding) intended to obfuscate high-frequency synthetic phase artifacts."
  }
];

export default function ThreatIntelPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Research & Vector Intel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Synthetic Voice Threat Matrix
          </h1>
          <p className="text-base text-[#52677C] leading-relaxed">
            Ongoing research tracking commercial and open-source neural generative models targeting enterprise voice communication networks.
          </p>
        </div>

        <div className="space-y-6">
          {THREATS.map((t) => (
            <div key={t.vector} className="p-6 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-[#0B2545]">{t.vector}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${t.severityColor}`}>
                    {t.severity}
                  </span>
                </div>
                <p className="text-sm text-[#52677C] leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/security" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors">
            <span>View Enterprise Security Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
