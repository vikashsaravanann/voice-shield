import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Activity,
  Languages,
  WifiOff,
  Lock,
  ArrowRight,
  Sparkles,
  Mic,
  Cpu,
  FileCheck2,
  CheckCircle2,
  Radio,
  Layers,
  PhoneCall,
  Search,
  Scale,
  Server,
} from "lucide-react";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "VoiceShield | Enterprise AI Voice Security & Telephony Fraud Detection",
  description:
    "VoiceShield by Logic Intelligence Technologies delivers real-time synthetic voice detection, neural spoofing mitigation, and Section 65B forensic chain-of-custody auditing.",
  openGraph: {
    title: "VoiceShield | Enterprise AI Voice Security",
    description:
      "Real-time synthetic voice detection and Section 65B forensic chain-of-custody auditing.",
  },
};

const CAPABILITIES = [
  {
    icon: Zap,
    title: "Real-Time Streaming Inference",
    status: "AVAILABLE",
    statusColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "Sub-second PCM audio chunk analysis evaluating spectral, prosodic, and acoustic cues without blocking live call streams.",
  },
  {
    icon: Activity,
    title: "Spectral & Kalman Smoothing",
    status: "AVAILABLE",
    statusColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "Multi-band FFT analysis and state-space Kalman filtering to prevent momentary noise spikes from triggering false alarms.",
  },
  {
    icon: Languages,
    title: "Indic & English Challenge Response",
    status: "AVAILABLE",
    statusColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "Active phonetic challenge phrases with real-time verification to detect pre-recorded replay and text-to-speech clones.",
  },
  {
    icon: FileCheck2,
    title: "Section 65B Forensic Certificates",
    status: "AVAILABLE",
    statusColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "Cryptographically verifiable evidentiary reports aligned with Indian Evidence Act Section 65B court admissibility rules.",
  },
  {
    icon: PhoneCall,
    title: "Twilio & SIP Telephony Ingestion",
    status: "CONFIGURABLE",
    statusColor: "bg-[#E7F3FF] text-[#1565C0] border-[#BBDEFB]",
    desc: "Native webhook and media stream interception for Twilio Voice, FreeSWITCH, and standard SIP trunking environments.",
  },
  {
    icon: Server,
    title: "Multi-Model Ensemble",
    status: "AVAILABLE",
    statusColor: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
    desc: "Dual-axis decision engine combining lightweight edge acoustic classifiers with deep forensic artifact analysis.",
  },
];

const ARCHITECTURE_STEPS = [
  {
    step: "01",
    title: "Authorized Audio Ingestion",
    desc: "Audio arrives via WebSocket PCM16 streaming (16kHz or 8kHz narrowband telephony) with consent tokens and caller verification.",
  },
  {
    step: "02",
    title: "Acoustic Feature Extraction",
    desc: "High-speed DSP extracts zero-crossing rates, spectral centroids, pitch jitter, and harmonic ratios across 100ms analysis windows.",
  },
  {
    step: "03",
    title: "Probabilistic Risk Scoring",
    desc: "Inference engine produces calibrated synthetic probability [0.0 - 1.0] with explainable biometric anomaly markers.",
  },
  {
    step: "04",
    title: "Automated Policy Action",
    desc: "High-risk interactions trigger operator alerts, interactive challenge prompts, or call quarantine based on SOC rules.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section with Healthcare Navy/White Split */}
      <section className="relative bg-gradient-to-b from-[#F7F9FC] via-white to-white border-b border-[#E2E8F0] overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Product Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
                <ShieldCheck className="w-4 h-4 text-[#1565C0]" />
                <span>Enterprise Voice Threat Intelligence v2.4</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-bold text-[#0B2545] tracking-tight leading-tight">
                Detect the Clone. <br />
                <span className="text-[#1565C0]">Protect the Conversation.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#52677C] leading-relaxed max-w-2xl">
                VoiceShield delivers real-time acoustic spoofing detection, synthetic voice risk scoring,
                and Section 65B forensic chain-of-custody verification for high-assurance telephony
                and contact center operations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#1565C0] rounded-xl shadow-sm hover:shadow transition-all duration-200"
                >
                  <Radio className="w-4 h-4 text-[#45D9D2]" />
                  <span>Interactive Audio Simulator</span>
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#0B2545] bg-[#F7F9FC] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded-xl transition-colors"
                >
                  <span>How Detection Works</span>
                  <ArrowRight className="w-4 h-4 text-[#52677C]" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="font-bold text-base sm:text-lg text-[#0B2545]">&lt; 85ms</p>
                  <p className="text-[#52677C] mt-0.5">Streaming Latency</p>
                </div>
                <div>
                  <p className="font-bold text-base sm:text-lg text-[#0B2545]">Dual-Axis</p>
                  <p className="text-[#52677C] mt-0.5">Acoustic + Forensic</p>
                </div>
                <div>
                  <p className="font-bold text-base sm:text-lg text-[#0B2545]">Sec 65B</p>
                  <p className="text-[#52677C] mt-0.5">Evidence Generator</p>
                </div>
              </div>
            </div>

            {/* Right Column: Embedded Operator Sign-In Card */}
            <div className="lg:col-span-5 flex justify-center">
              <Suspense fallback={<div className="w-full max-w-md h-96 rounded-2xl bg-white/50 animate-pulse border border-[#DFE7EF]" />}>
                <AuthCard
                  title="Security Analyst Sign In"
                  subtitle="Authenticate to view live call intercepts, telemetry, and forensic cases."
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Platform Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2545] tracking-tight">
              Architected for Real-Time Telephony Protection
            </h2>
            <p className="text-sm sm:text-base text-[#52677C] mt-2">
              Every module is verified against concrete source implementations and strict tenant boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="p-6 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF] hover:border-[#1565C0] hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#0B2545] group-hover:bg-[#1565C0] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${cap.statusColor}`}
                      >
                        {cap.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#0B2545] mb-2">
                      {cap.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#52677C] leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detection Pipeline Architecture */}
      <section className="py-16 sm:py-20 bg-[#F7F9FC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Inspection Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2545] tracking-tight">
              Four-Stage Acoustic Verification Pipeline
            </h2>
            <p className="text-sm sm:text-base text-[#52677C] mt-2">
              How raw telephone audio transforms into actionable fraud indicators with cryptographic certainty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ARCHITECTURE_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white p-6 rounded-2xl border border-[#DFE7EF] relative shadow-sm hover:shadow transition-shadow"
              >
                <div className="text-2xl font-black text-[#1565C0] mb-2">
                  {item.step}
                </div>
                <h3 className="text-sm font-bold text-[#0B2545] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#52677C] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 rounded-xl bg-white border border-[#CBD5E1] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E7F7EF] text-[#065F46] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-[#0B2545] font-medium">
                Explore the complete system architecture diagram with dataflow diagrams and boundaries.
              </p>
            </div>
            <Link
              href="/architecture"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#1565C0] rounded-lg transition-colors shrink-0"
            >
              <span>View Technical Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enterprise CTA Section */}
      <section className="py-16 sm:py-20 bg-[#0B2545] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 text-white">
            Deploy VoiceShield in Your Security Operation Center
          </h2>
          <p className="text-sm sm:text-base text-[#CBD5E1] mb-8 leading-relaxed">
            Equip your contact center, fraud investigation unit, and compliance teams with real-time
            acoustic protection against generative voice cloning.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl bg-[#1565C0] hover:bg-[#1FA9A2] text-white font-semibold text-sm shadow-md transition-colors flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#45D9D2]" />
              <span>Access Operator Workspace</span>
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-[#18354F] hover:bg-[#20496E] text-white font-semibold text-sm border border-[#20496E] transition-colors"
            >
              Contact Sales &amp; POC
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
