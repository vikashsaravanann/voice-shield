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
import { PastelFeatureCard, type PastelTone } from "@/components/shared/PastelFeatureCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/marketing/FaqSection";
import {
  ORGANIZATION_JSONLD,
  SOFTWARE_APP_JSONLD,
  HOMEPAGE_FAQS,
  faqPageJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "VoiceShield | AI Voice Security",
  description:
    "Real-time AI voice spoofing detection and telephony security platform.",
  openGraph: {
    title: "VoiceShield | AI Voice Security",
    description:
      "Real-time AI voice spoofing detection and telephony security platform.",
  },
};

interface CapabilityItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  status: string;
  badgeTone: "green" | "blue" | "gold" | "purple";
  tone: PastelTone;
  desc: string;
}

const CAPABILITIES: CapabilityItem[] = [
  {
    icon: Zap,
    title: "Real-Time Streaming Inference",
    status: "AVAILABLE",
    badgeTone: "green",
    tone: "sky",
    desc: "Sub-second PCM audio chunk analysis evaluating spectral, prosodic, and acoustic cues without blocking live call streams.",
  },
  {
    icon: Activity,
    title: "Spectral & Kalman Smoothing",
    status: "AVAILABLE",
    badgeTone: "green",
    tone: "purple",
    desc: "Multi-band FFT analysis and state-space Kalman filtering to prevent momentary noise spikes from triggering false alarms.",
  },
  {
    icon: Languages,
    title: "Indic & English Challenge Response",
    status: "AVAILABLE",
    badgeTone: "gold",
    tone: "gold",
    desc: "Active phonetic challenge phrases with real-time verification to detect pre-recorded replay and text-to-speech clones.",
  },
  {
    icon: FileCheck2,
    title: "Section 65B Forensic Certificates",
    status: "AVAILABLE",
    badgeTone: "green",
    tone: "green",
    desc: "Cryptographically verifiable evidentiary reports aligned with Indian Evidence Act Section 65B court admissibility rules.",
  },
  {
    icon: PhoneCall,
    title: "Twilio & SIP Telephony Ingestion",
    status: "CONFIGURABLE",
    badgeTone: "blue",
    tone: "sandal",
    desc: "Native webhook and media stream interception for Twilio Voice, FreeSWITCH, and standard SIP trunking environments.",
  },
  {
    icon: Server,
    title: "Multi-Model Ensemble",
    status: "AVAILABLE",
    badgeTone: "purple",
    tone: "pink",
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
      <JsonLd data={[ORGANIZATION_JSONLD, SOFTWARE_APP_JSONLD, faqPageJsonLd(HOMEPAGE_FAQS)]} />
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
                  <p className="font-bold text-base sm:text-lg text-[#0B2545]">Sub-Second</p>
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

      {/* Core Capabilities Section with Pastel Feature Cards */}
      <SectionReveal className="py-16 sm:py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Platform Matrix"
            title="Architected for Real-Time Telephony Protection"
            description="Every module is verified against concrete source implementations and strict tenant boundaries."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap) => (
              <PastelFeatureCard
                key={cap.title}
                tone={cap.tone}
                icon={cap.icon}
                title={cap.title}
                description={cap.desc}
                badge={cap.status}
                badgeTone={cap.badgeTone}
              />
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* Detection Pipeline Architecture */}
      <SectionReveal className="py-16 sm:py-20 bg-[#F7F9FC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Inspection Architecture"
            title="Four-Stage Acoustic Verification Pipeline"
            description="How raw telephone audio transforms into actionable fraud indicators with cryptographic certainty."
            align="left"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ARCHITECTURE_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white p-6 rounded-2xl border border-[#DFE7EF] relative shadow-xs hover:shadow-sm transition-shadow"
              >
                <div className="text-2xl font-black text-[#1565C0] mb-2 font-mono">
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
      </SectionReveal>

      {/* FAQ Section (visible content mirrored by FAQPage JSON-LD above) */}
      <FaqSection />

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
