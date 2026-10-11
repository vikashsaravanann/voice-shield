import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie & Local Storage Policy | VoiceShield",
  description: "Disclosures regarding session cookies, essential localstorage tokens, and zero-cross-site-tracking guarantee.",
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <Cookie className="w-3.5 h-3.5" />
            <span>Privacy Disclosure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Cookie &amp; Local Storage Policy
          </h1>
          <p className="text-xs text-[#52677C]">Effective Date: October 11, 2026 • Version 2.4</p>
        </div>

        <section className="space-y-4 text-sm text-[#52677C] leading-relaxed">
          <h2 className="text-lg font-bold text-[#0B2545]">1. Zero Third-Party Advertising Trackers</h2>
          <p>
            VoiceShield does not use third-party advertising cookies, retargeting pixels, or behavioral tracking beacons. We operate exclusively with strictly necessary operational tokens required for authentication and security posture.
          </p>

          <h2 className="text-lg font-bold text-[#0B2545]">2. Strictly Necessary Cookies</h2>
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] space-y-2">
            <p><strong className="text-[#0B2545]">sb-access-token / sb-refresh-token:</strong> Supabase authentication session tokens. Used solely to authenticate your security analyst seat and maintain authorized access to the private /app workspace.</p>
            <p><strong className="text-[#0B2545]">vs-session-id:</strong> Ephemeral session identifier used to correlate real-time audio chunk metrics during active call analysis.</p>
          </div>

          <h2 className="text-lg font-bold text-[#0B2545]">3. Local Storage &amp; Audio Buffers</h2>
          <p>
            Microphone audio processed in the interactive demo or forensic lab is converted to raw PCM16 buffers in transient browser memory (Float32Array / Int16Array). These buffers are cleared immediately upon session termination and are never written to permanent browser localStorage or IndexedDB without explicit user action.
          </p>

          <h2 className="text-lg font-bold text-[#0B2545]">4. Managing Your Preferences</h2>
          <p>
            You can configure your browser to reject all cookies; however, authentication to the secure /app workspace requires functional HTTP session cookies. For inquiries, contact <strong className="text-[#0B2545]">privacy@logicintelligencetechnologies.in</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
