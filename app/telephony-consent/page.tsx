import type { Metadata } from "next";
import Link from "next/link";
import { PhoneCall, Scale, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Telephony & Recording Consent Guidelines | VoiceShield",
  description: "Statutory wiretapping, call recording consent, and telecommunications compliance requirements.",
};

export default function TelephonyConsentPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Telephony Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Recording &amp; Telephony Consent Guidelines
          </h1>
          <p className="text-xs text-[#52677C]">Updated: October 11, 2026</p>
        </div>

        <section className="space-y-4 text-sm text-[#52677C] leading-relaxed">
          <h2 className="text-lg font-bold text-[#0B2545]">1. Legal Notice Obligations</h2>
          <p>
            When integrating VoiceShield with live telephone networks or contact centers, enterprises must ensure compliance with applicable call-recording and wiretapping laws. Most jurisdictions require either one-party or all-party notification prior to monitoring.
          </p>

          <h2 className="text-lg font-bold text-[#0B2545]">2. Recommended IVR Audio Disclosure</h2>
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] font-mono text-xs text-[#0B2545]">
            &quot;This call may be monitored and analyzed using automated security systems for fraud prevention and quality assurance.&quot;
          </div>

          <h2 className="text-lg font-bold text-[#0B2545]">3. Real-Time Security Warning Tones</h2>
          <p>
            In high-risk scenarios, VoiceShield can inject audible compliance chime tones into the call audio stream to signal active biometric verification in accordance with carrier regulations.
          </p>
        </section>
      </div>
    </div>
  );
}
