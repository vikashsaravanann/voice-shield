import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Scale, TrendingUp, Lock, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Enterprise Benefits | VoiceShield",
  description: "Measurable security, compliance, and operational benefits of deploying VoiceShield in enterprise voice networks.",
};

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Prevent Impersonation & CEO Fraud",
    desc: "Neutralize executive voice cloning attacks targeting wire transfers, payroll redirects, and confidential corporate communications."
  },
  {
    icon: Scale,
    title: "Section 65B Legal Chain of Custody",
    desc: "Generate court-admissible forensic certificates instantly, giving law enforcement and legal teams verified technical evidence."
  },
  {
    icon: TrendingUp,
    title: "Reduced Call Center Handle Times",
    desc: "Automate biometric spoofing verification without forcing legitimate callers through friction-heavy multi-step interrogation."
  },
  {
    icon: Lock,
    title: "Zero Audio Persistence Option",
    desc: "Configure ephemeral analysis modes where raw audio never persists to disk, ensuring strict compliance with DPDP and GDPR."
  },
  {
    icon: Users,
    title: "Explainable Operator Attribution",
    desc: "Empower tier-1 call operators with plain-language confidence explanations instead of mysterious black-box scores."
  }
];

export default function BenefitsPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Value & ROI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Why Enterprises Rely on VoiceShield
          </h1>
          <p className="text-base text-[#52677C] leading-relaxed">
            Designed for financial institutions, telecom carriers, and contact centers requiring verifiable voice security without compromising user trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="p-6 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF] hover:border-[#1565C0] hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#E7F3FF] text-[#1565C0] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0B2545] mb-2">{b.title}</h3>
                <p className="text-sm text-[#52677C] leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors">
            <span>Request Enterprise Security Review</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
