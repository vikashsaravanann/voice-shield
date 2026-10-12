import type { Metadata } from "next";
import Link from "next/link";
import { Scale, ArrowRight, ShieldCheck, CheckCircle2, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Statutory Governance & Compliance Posture | VoiceShield",
  description: "Architectural alignment with Digital Personal Data Protection Act (DPDP), Section 65B Indian Evidence Act, and ISO security frameworks.",
};

const FRAMEWORKS = [
  {
    name: "Indian Evidence Act — Section 65B / BSA 2023",
    status: "GENERATOR v2.4 ALIGNED",
    desc: "Automated cryptographic generation of electronic record draft certificates, capturing SHA-256 hashes, system time, and server node attestations for judicial scrutiny."
  },
  {
    name: "Digital Personal Data Protection (DPDP) Act 2023",
    status: "ARCHITECTURAL CONTROLS ACTIVE",
    desc: "Purpose limitation, data minimization, ephemeral in-memory DSP audio processing, and affirmative consent controls for biometric voiceprint records."
  },
  {
    name: "RBI Master Direction on Cyber Security",
    status: "FRAMEWORK ALIGNED",
    desc: "Continuous call fraud monitoring, suspicious voice interaction interception, real-time telephony anomaly scoring, and immutable audit logging."
  },
  {
    name: "WCAG 2.1 AA Accessibility",
    status: "EVALUATION TARGET",
    desc: "High-contrast semantic design tokens, full keyboard navigability, reduced-motion preferences, and screen-reader compliant ARIA landmarks."
  }
];

export default function CompliancePage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Statutory Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Statutory &amp; Regulatory Alignment Posture
          </h1>
          <p className="text-base text-[#52677C] leading-relaxed">
            VoiceShield is engineered with explicit data provenance and privacy-by-design principles to support banking, telecom, and enterprise compliance requirements.
          </p>
        </div>

        {/* Framework Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FRAMEWORKS.map((f) => (
            <div key={f.name} className="p-8 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF] hover:border-[#CBD5E1] transition-colors shadow-2xs space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-bold text-[#0B2545]">{f.name}</h3>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded border bg-[#E7F3FF] text-[#1565C0] border-[#BBDEFB] whitespace-nowrap">
                  {f.status}
                </span>
              </div>
              <p className="text-sm text-[#52677C] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust Notice */}
        <div className="mt-12 p-6 rounded-2xl bg-[#FFF4D9] border border-[#FFE082] text-xs text-[#8D6E00] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#8D6E00] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Legal Verification Notice</p>
            <p className="leading-relaxed">
              Statements of statutory alignment describe technical capabilities and architecture controls implemented within VoiceShield v2.4. Judicial admissibility of electronic records remains subject to court evaluation under applicable procedural law.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/privacy" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors shadow-sm">
            <span>Review Full Privacy Policy</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/telephony-consent" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F7F9FC] text-[#0B2545] font-semibold text-sm border border-[#DFE7EF] transition-colors">
            <span>Telephony Consent Guidelines</span>
            <FileText className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
