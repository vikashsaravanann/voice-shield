import type { Metadata } from "next";
import Link from "next/link";
import { Scale, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Regulatory Compliance & Standards | VoiceShield",
  description: "Compliance posture with Digital Personal Data Protection Act (DPDP), Section 65B Indian Evidence Act, and ISO standards.",
};

const FRAMEWORKS = [
  {
    name: "Indian Evidence Act — Section 65B",
    status: "COMPLIANT",
    desc: "Automated cryptographic generation of electronic record certificates verifying uncorrupted computer operation for judicial admissibility."
  },
  {
    name: "Digital Personal Data Protection (DPDP) Act",
    status: "ALIGNED",
    desc: "Purpose limitation, data minimization, ephemeral voice processing, and user deletion rights natively supported."
  },
  {
    name: "Reserve Bank of India (RBI) Cyber Security Guidelines",
    status: "ALIGNED",
    desc: "Continuous transaction monitoring, suspicious voice interaction interception, and tamper-resistant audit logs."
  },
  {
    name: "WCAG 2.1 AA Accessibility",
    status: "AUDITED",
    desc: "High-contrast semantic UI tokens, keyboard accessible navigation, and screen-reader compliant aria landmarks."
  }
];

export default function CompliancePage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Statutory Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Statutory &amp; Regulatory Alignment
          </h1>
          <p className="text-base text-[#52677C] leading-relaxed">
            Designed to meet exacting legal and privacy requirements across Indian and global regulatory jurisdictions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FRAMEWORKS.map((f) => (
            <div key={f.name} className="p-8 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#0B2545]">{f.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]">
                  {f.status}
                </span>
              </div>
              <p className="text-sm text-[#52677C] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/privacy" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors">
            <span>Review Full Privacy Policy</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
