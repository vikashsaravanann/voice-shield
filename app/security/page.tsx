import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ShieldCheck, Key, FileCheck2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Security & Trust Architecture | VoiceShield",
  description: "Enterprise data encryption, tenant isolation, zero-knowledge audio policies, and compliance controls.",
};

const CONTROLS = [
  {
    icon: Lock,
    title: "Data Encryption in Transit & Rest",
    desc: "TLS 1.3 encryption for all WebSocket audio streams and HTTPS REST endpoints. AES-256 for persistent database storage."
  },
  {
    icon: Key,
    title: "Strict Tenant Isolation (Row Level Security)",
    desc: "Database rows are partitioned by tenant identity with PostgreSQL RLS policies preventing any cross-customer access."
  },
  {
    icon: ShieldCheck,
    title: "Zero-Knowledge Audio Buffering",
    desc: "In-memory circular buffers hold audio only for the microsecond duration required to compute FFT features."
  },
  {
    icon: FileCheck2,
    title: "Tamper-Evident Audit Logging",
    desc: "Append-only cryptographic event logs recording every risk evaluation, alert dispatch, and operator action."
  }
];

export default function SecurityPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Trust Assurance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Enterprise Security &amp; Trust
          </h1>
          <p className="text-base text-[#52677C] leading-relaxed">
            Security is not an add-on; VoiceShield is engineered from the ground up for hostile telephony environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CONTROLS.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="p-8 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF]">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#1565C0] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0B2545] mb-2">{c.title}</h3>
                <p className="text-sm text-[#52677C] leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href="/compliance" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors">
            <span>Review Statutory Compliance Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
