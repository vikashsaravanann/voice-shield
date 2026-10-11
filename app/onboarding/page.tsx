import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Mic, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Operator Onboarding | VoiceShield",
  description: "Configure microphone permissions, understand test modes, and launch the private security workspace.",
};

export default function OnboardingPage() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-[#DFE7EF] p-8 sm:p-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Operator Orientation</span>
        </div>
        <h1 className="text-3xl font-bold text-[#0B2545] tracking-tight mb-2">
          Welcome to VoiceShield SOC
        </h1>
        <p className="text-sm text-[#52677C] leading-relaxed">
          Follow these three initial checks to prepare your workstation for real-time acoustic fraud monitoring.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF] flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#1565C0] shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B2545] mb-1">1. Audio Input Permissions</h3>
            <p className="text-xs text-[#52677C] leading-relaxed">
              When using the Live Console or Interactive Demo, your browser will request microphone access. Audio is digitized into 16kHz PCM chunks locally.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF] flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#1565C0] shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B2545] mb-1">2. Zero Audio Retention</h3>
            <p className="text-xs text-[#52677C] leading-relaxed">
              By default, live audio is evaluated in transient RAM ring buffers and purged immediately after feature extraction.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF] flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#1565C0] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B2545] mb-1">3. Section 65B Compliance Ready</h3>
            <p className="text-xs text-[#52677C] leading-relaxed">
              Every flagged synthetic call interaction can generate a signed forensic certificate for legal and regulatory submission.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors shadow-sm"
        >
          <span>Enter Security Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
