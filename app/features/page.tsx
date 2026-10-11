import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Activity, Languages, FileCheck2, PhoneCall, Server, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Features | VoiceShield Voice Fraud Prevention",
  description: "Comprehensive feature catalog for real-time acoustic spoofing detection, Kalman smoothing, and Section 65B forensic certification.",
};

const FEATURES = [
  {
    icon: Zap,
    title: "Real-Time Streaming WebSocket Ingestion",
    tag: "AVAILABLE",
    tagColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "16kHz and 8kHz PCM chunk streaming designed for zero latency overhead in high-throughput enterprise telephony.",
    bullets: ["Direct WebSocket protocol (/ws/audio)", "Sub-85ms processing loop", "Configurable chunk sizes from 100ms to 500ms"]
  },
  {
    icon: Activity,
    title: "DSP Acoustic Feature Extraction & FFT",
    tag: "AVAILABLE",
    tagColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "Real-time extraction of zero-crossing density, spectral flux, MFCC coefficients, and pitch jitter markers.",
    bullets: ["Multi-band spectrogram analysis", "Synthetic phase continuity checks", "Glottal pulse shape anomaly detection"]
  },
  {
    icon: Languages,
    title: "Interactive Challenge-Response Prompts",
    tag: "AVAILABLE",
    tagColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "Dynamic phonetic prompts in Indic languages and English to defeat pre-recorded replays and cloned speech.",
    bullets: ["Multilingual prompt dictionary", "Temporal alignment scoring", "Anti-replay cryptographic nonce"]
  },
  {
    icon: FileCheck2,
    title: "Section 65B Forensic Evidentiary Reports",
    tag: "AVAILABLE",
    tagColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "Indian Evidence Act Section 65B compliant automated certificates for legal proceedings and cybercrime reporting.",
    bullets: ["Cryptographic SHA-256 audio hash", "Chain-of-custody timestamp logs", "Tamper-evident PDF/JSON download"]
  },
  {
    icon: PhoneCall,
    title: "Telephony Carrier & SIP Integration",
    tag: "CONFIGURABLE",
    tagColor: "bg-[#E7F3FF] text-[#1565C0] border-[#BBDEFB]",
    desc: "Pre-built connectors for Twilio Voice, FreeSWITCH, Asterisk, and carrier-grade SIP media forks.",
    bullets: ["Native Twilio Media Streams webhook", "Bi-directional caller warning tones", "Call quarantine & route deflection"]
  },
  {
    icon: Server,
    title: "Dual-Axis Decision & Kalman Filter",
    tag: "AVAILABLE",
    tagColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "State-space Kalman smoothing ensures momentary acoustic noise or cellular packet loss does not trigger false alerts.",
    bullets: ["Adaptive risk smoothing", "Configurable alert sensitivity", "Explainable factor attribution"]
  }
];

export default function FeaturesPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Capability Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Enterprise-Grade Synthetic Voice Defense
          </h1>
          <p className="text-base text-[#52677C] leading-relaxed">
            Explore VoiceShield core architectural components engineered to detect, isolate, and document deepfake audio in mission-critical environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="p-6 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF] flex flex-col justify-between hover:border-[#1565C0] hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#0B2545]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0B2545] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#52677C] mb-4 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                  {item.bullets.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-xs text-[#0B2545]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-[#0B2545] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Ready to test these capabilities live?</h3>
            <p className="text-sm text-[#CBD5E1]">Run our interactive in-browser audio evaluation simulator now.</p>
          </div>
          <Link href="/demo" className="px-5 py-2.5 rounded-lg bg-[#1565C0] hover:bg-[#1FA9A2] text-white text-sm font-semibold transition-colors flex items-center gap-2 shrink-0">
            <span>Launch Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
