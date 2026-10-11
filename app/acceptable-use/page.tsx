import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, AlertTriangle, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Acceptable Use Policy | VoiceShield",
  description: "Strict prohibitions on non-consensual surveillance, unlawful wiretapping, and adversarial exploitation.",
};

export default function AcceptableUsePage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF4D9] text-[#8D6E00] border border-[#FFE082] mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Security Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Acceptable Use Policy (AUP)
          </h1>
          <p className="text-xs text-[#52677C]">Effective Date: October 11, 2026 • Version 2.4</p>
        </div>

        <section className="space-y-4 text-sm text-[#52677C] leading-relaxed">
          <h2 className="text-lg font-bold text-[#0B2545]">1. Authorized Scope</h2>
          <p>
            VoiceShield is an enterprise defensive security technology developed by Logic Intelligence Technologies to protect organizations from synthetic voice fraud, executive impersonation, and automated telephony abuse.
          </p>

          <h2 className="text-lg font-bold text-[#0B2545]">2. Express Prohibitions</h2>
          <div className="p-4 rounded-xl bg-[#FCEAF3] border border-[#F8BBD0] text-[#991B1B] space-y-2">
            <p><strong>Unlawful Surveillance:</strong> Operators may not deploy VoiceShield to intercept communications without requisite two-party or one-party consent as mandated by applicable wiretapping laws.</p>
            <p><strong>Adversarial Model Harvesting:</strong> Using VoiceShield API endpoints or model inference outputs to train, fine-tune, or benchmark competing generative voice cloning tools is strictly prohibited.</p>
            <p><strong>Circumvention of Access Controls:</strong> Any attempt to inject unauthenticated user identifiers into WebSocket headers or tamper with Section 65B hashes will result in immediate tenant revocation.</p>
          </div>

          <h2 className="text-lg font-bold text-[#0B2545]">3. Enforcement &amp; Termination</h2>
          <p>
            Violations of this policy result in immediate suspension of API keys, termination of the enterprise workspace, and formal referral to law enforcement when statutory violations occur.
          </p>
        </section>
      </div>
    </div>
  );
}
