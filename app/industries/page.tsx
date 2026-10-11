import type { Metadata } from "next";
import Link from "next/link";
import { Landmark, PhoneCall, Building2, Scale, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Industry Solutions | VoiceShield",
  description: "Specialized synthetic voice defense solutions for banking, telecommunications, healthcare, and government.",
};

const SECTORS = [
  {
    icon: Landmark,
    title: "Banking & Financial Services",
    desc: "Safeguard high-value telephone transactions, voice OTP verification, and institutional wealth management desks."
  },
  {
    icon: PhoneCall,
    title: "Telecommunications & Carrier Networks",
    desc: "Inspect SIP trunks, detect robo-call deepfakes at the exchange level, and enforce regulatory caller verification."
  },
  {
    icon: Building2,
    title: "Healthcare & Patient Data Portals",
    desc: "Protect telehealth interactions and medical record access authorized via telephone communications."
  },
  {
    icon: Scale,
    title: "Legal & Law Enforcement",
    desc: "Equip forensic experts with Section 65B compliant automated certificates for evidence admissibility in courts."
  }
];

export default function IndustriesPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <Landmark className="w-3.5 h-3.5" />
            <span>Vertical Solutions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Built for Regulated Industries
          </h1>
          <p className="text-base text-[#52677C] leading-relaxed">
            Compliance-first architecture designed to fulfill strict regulatory requirements including DPDP, RBI circulars, and WCAG standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SECTORS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="p-8 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF] hover:border-[#1565C0] hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#1565C0] mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0B2545] mb-2">{s.title}</h3>
                <p className="text-sm text-[#52677C] leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors">
            <span>Consult an Industry Architect</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
