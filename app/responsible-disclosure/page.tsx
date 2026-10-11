import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Mail, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Responsible Vulnerability Disclosure | VoiceShield",
  description: "Reporting security vulnerabilities to the Logic Intelligence Technologies security response team.",
};

export default function ResponsibleDisclosurePage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F7EF] text-[#065F46] border border-[#A7F3D0] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security Bounty &amp; Disclosure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Vulnerability Disclosure Policy
          </h1>
          <p className="text-xs text-[#52677C]">Active Policy • Logic Intelligence Technologies Security Team</p>
        </div>

        <section className="space-y-4 text-sm text-[#52677C] leading-relaxed">
          <h2 className="text-lg font-bold text-[#0B2545]">1. Safe Harbor Commitment</h2>
          <p>
            We appreciate the contributions of independent security researchers. If you conduct vulnerability research in good faith in accordance with this policy, we will not pursue legal action against you.
          </p>

          <h2 className="text-lg font-bold text-[#0B2545]">2. Submission Guidelines</h2>
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] space-y-2">
            <p><strong>Official Mailbox:</strong> security@logicintelligencetechnologies.in</p>
            <p><strong>PGP Encryption:</strong> Available upon request for sensitive exploit payloads.</p>
            <p><strong>SLA:</strong> Initial acknowledgment within 24 business hours; triage within 72 hours.</p>
          </div>

          <h2 className="text-lg font-bold text-[#0B2545]">3. Out-of-Scope Research</h2>
          <p>
            Denial of service (DoS/DDoS), spamming, social engineering of employees, and physical intrusion of data centers are strictly out of scope and prohibited.
          </p>
        </section>
      </div>
    </div>
  );
}
