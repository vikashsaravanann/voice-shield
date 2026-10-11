import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing & Plans | VoiceShield",
  description: "Transparent pricing models for enterprise voice fraud prevention, developer sandbox, and high-volume telephony.",
};

const PLANS = [
  {
    name: "Developer Sandbox",
    price: "Free Evaluation",
    period: "for testing",
    desc: "In-browser microphone simulator, sample audio uploads, and API documentation access.",
    features: [
      "Simulated DSP audio processing",
      "Spectrogram viewer & audio timeline",
      "Sample Section 65B certificate generation",
      "Community support"
    ],
    cta: "Launch Sandbox",
    href: "/demo",
    primary: false
  },
  {
    name: "Enterprise Dedicated SOC",
    price: "Custom Contract",
    period: "billed annually",
    desc: "Full production deployment with private tenant isolation, custom SIP trunking, and 24/7 SLA.",
    features: [
      "Sub-85ms streaming inference",
      "Unlimited simultaneous telephony channels",
      "Twilio / SIP trunk media stream forks",
      "Custom challenge-response dictionaries",
      "Court-admissible Sec 65B exports",
      "Dedicated Technical Account Manager"
    ],
    cta: "Contact Enterprise Sales",
    href: "/contact",
    primary: true
  }
];

export default function PricingPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Commercial Deployment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Predictable Enterprise Security Pricing
          </h1>
          <p className="text-base text-[#52677C] leading-relaxed">
            Tailored deployment models aligned with your call center volume, security compliance tiers, and SLA requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`p-8 rounded-2xl border flex flex-col justify-between ${
                p.primary
                  ? "bg-[#0B2545] text-white border-[#18354F] shadow-xl relative"
                  : "bg-[#F7F9FC] text-[#0B2545] border-[#DFE7EF]"
              }`}
            >
              <div>
                <h3 className={`text-xl font-bold mb-2 ${p.primary ? "text-white" : "text-[#0B2545]"}`}>
                  {p.name}
                </h3>
                <p className={`text-sm mb-6 ${p.primary ? "text-[#CBD5E1]" : "text-[#52677C]"}`}>
                  {p.desc}
                </p>
                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-black">{p.price}</span>
                  <span className={`text-xs ml-2 ${p.primary ? "text-[#94A3B8]" : "text-[#52677C]"}`}>
                    {p.period}
                  </span>
                </div>
                <div className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={p.href}
                className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-center transition-colors ${
                  p.primary
                    ? "bg-[#1565C0] hover:bg-[#1FA9A2] text-white shadow-md"
                    : "bg-[#0B2545] hover:bg-[#1565C0] text-white"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
