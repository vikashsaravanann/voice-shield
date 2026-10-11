import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Copyright & DMCA Designated Agent | VoiceShield",
  description: "Designated DMCA agent information, copyright ownership, and takedown procedures.",
};

export default function CopyrightPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Ownership</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Copyright &amp; DMCA Designated Agent
          </h1>
          <p className="text-xs text-[#52677C]">Updated: October 11, 2026</p>
        </div>

        <section className="space-y-4 text-sm text-[#52677C] leading-relaxed">
          <h2 className="text-lg font-bold text-[#0B2545]">1. Intellectual Property Ownership</h2>
          <p>
            The VoiceShield platform, including its acoustic signal processing algorithms, user interface, Section 65B generator, and proprietary models, is the intellectual property of Logic Intelligence Technologies.
          </p>

          <h2 className="text-lg font-bold text-[#0B2545]">2. DMCA Designated Agent Details</h2>
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] space-y-2">
            <p><strong className="text-[#0B2545]">Designated Agent:</strong> Legal Counsel, Logic Intelligence Technologies</p>
            <p><strong className="text-[#0B2545]">Email Address:</strong> dmca@logicintelligencetechnologies.in</p>
            <p><strong className="text-[#0B2545]">Mailing Address:</strong> Logic Intelligence Technologies, Legal Operations Desk, India</p>
          </div>

          <h2 className="text-lg font-bold text-[#0B2545]">3. Notice and Takedown Procedure</h2>
          <p>
            To file a notice of alleged copyright infringement, provide a physical or electronic signature, description of the copyrighted work, URL location, contact details, and statement of good faith belief.
          </p>
        </section>
      </div>
    </div>
  );
}
