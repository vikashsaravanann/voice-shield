import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | VoiceShield",
  description: "Technical, legal, and operational answers regarding VoiceShield acoustic fraud detection.",
};

const FAQS = [
  {
    q: "How does VoiceShield detect synthetic speech without transcribing the conversation?",
    a: "VoiceShield operates directly on acoustic PCM waveforms using digital signal processing (DSP) and lightweight neural classifiers. It analyzes harmonic jitter, glottal pulse shapes, and spectral phase continuity—acoustic properties inherent to synthetic vocoders—without needing to transcribe or understand conversational content."
  },
  {
    q: "What is the typical detection latency for live phone calls?",
    a: "In standard production streaming mode, VoiceShield processes 100ms to 500ms audio chunks with inference latency under 85ms, ensuring real-time alerts before a fraudulent caller can execute financial actions."
  },
  {
    q: "How are false positives prevented during poor cellular connections?",
    a: "We utilize state-space Kalman filtering and temporal smoothing to distinguish cellular packet drops or codec compression from intentional voice cloning signatures. Alerts are only escalated when anomalies persist across continuous frames."
  },
  {
    q: "What makes Section 65B forensic reports legally admissible in Indian courts?",
    a: "Under Section 65B of the Indian Evidence Act, digital evidence requires technical certification of machine provenance, cryptographic hashes, and verification that the monitoring computer operated normally without tampering. VoiceShield automates this exact certificate format."
  },
  {
    q: "Does VoiceShield store recording audio permanently?",
    a: "No. Enterprises can configure zero-retention ephemeral modes where audio exists only in RAM for the duration of inference. When evidence retention is mandated by policy, audio is encrypted at rest using AES-256 with tenant-scoped keys."
  }
];

export default function FAQPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-[#52677C]">
            Clear technical explanations of VoiceShield architecture, detection mechanics, and compliance safeguards.
          </p>
        </div>

        <div className="space-y-6">
          {FAQS.map((item) => (
            <div key={item.q} className="p-6 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF]">
              <h3 className="text-base font-bold text-[#0B2545] mb-2">{item.q}</h3>
              <p className="text-sm text-[#52677C] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-[#52677C] mb-4">Have a specialized technical question?</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors">
            <span>Contact Technical Team</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
