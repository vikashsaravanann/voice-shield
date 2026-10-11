import type { Metadata } from "next";
import Link from "next/link";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Email Address | VoiceShield",
  description: "Check your corporate inbox for the verification link to activate your security operator seat.",
};

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-[#DFE7EF] p-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#E7F3FF] text-[#1565C0] flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
          Verify Your Corporate Email
        </h1>
        <p className="text-sm text-[#52677C] leading-relaxed">
          We sent a cryptographic confirmation link to your registered email address. Click the link to complete account verification.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] text-xs text-[#52677C] text-left space-y-1.5">
        <p>• Verification links expire after 24 hours.</p>
        <p>• If you don&apos;t see the message, check your corporate spam quarantine.</p>
      </div>

      <div className="pt-2">
        <Link
          href="/login"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors"
        >
          <span>Return to Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
