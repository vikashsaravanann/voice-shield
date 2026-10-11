import React from "react";
import Link from "next/link";
import {
  Shield,
  FileCheck,
  PhoneCall,
  Zap,
  Lock,
  AlertOctagon,
  Scale,
  Award,
  CheckCircle,
  Clock,
  ArrowRight,
  Sliders,
  Radio,
} from "lucide-react";

export const metadata = {
  title: "TERMS OF SERVICE & TELEPHONY ACCEPTABLE USE | VOICESHIELD",
  description: "Operational service agreement, telephony middleware terms, fail-safe protocols, and Logic Intelligence Technologies evaluation conditions.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "VoiceShield",
    title: "Terms of Service | VoiceShield",
    description: "Operational service agreement, telephony middleware terms, fail-safe protocols, and Logic Intelligence Technologies evaluation conditions.",
    images: [{ url: "/banner.png", width: 1200, height: 630, alt: "VoiceShield Banner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | VoiceShield",
    description: "Operational service agreement, telephony middleware terms, fail-safe protocols, and Logic Intelligence Technologies evaluation conditions.",
    images: ["/banner.png"],
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#121826] font-sans pb-24">
      <section className="border-b border-slate-200 bg-white/90 backdrop-blur-xl pt-16 pb-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#64748B] uppercase">
              <Link href="/" className="hover:text-[#1565C0] transition-colors">VOICESHIELD</Link>
              <span>/</span>
              <span className="text-[#1565C0] font-bold">TERMS OF SERVICE</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-blue-50 text-[#1565C0] border border-blue-200">
                <Award aria-hidden className="w-3.5 h-3.5 text-[#1565C0]" />
                PRE-RELEASE EVALUATION TERMS
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-[#1565C0] text-xs font-mono font-bold tracking-widest uppercase">
              <Scale className="w-3.5 h-3.5" />
              <span>OPERATIONAL CARRIER & EVALUATION AGREEMENT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B2545] tracking-tight leading-tight uppercase">
              TERMS OF SERVICE & ACCEPTABLE USE POLICY
            </h1>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-4xl font-normal">
              These terms govern the operational deployment, programmatic API access, SIP trunk interception middleware, and Logic Intelligence Technologies evaluation usage of the <strong className="text-[#0B2545] font-semibold">VoiceShield Real-Time Audio Deepfake Mitigation System</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-[#F7F9FC] space-y-1.5">
              <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block">LATENCY TARGET</span>
              <span className="text-base font-mono font-black text-[#1565C0] uppercase block">DESIGN TARGET (VERIFY)</span>
              <p className="text-xs text-[#475569] leading-normal">Validate under your deployment conditions.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-[#F7F9FC] space-y-1.5">
              <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block">EMERGENCY PROTOCOL</span>
              <span className="text-base font-mono font-black text-[#065F46] uppercase block">FAIL-OPEN (112 / SOS)</span>
              <p className="text-xs text-[#475569] leading-normal">Uninterrupted emergency life-safety routing.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-[#F7F9FC] space-y-1.5">
              <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block">FINANCIAL PROTOCOL</span>
              <span className="text-base font-mono font-black text-[#991B1B] uppercase block">FAIL-CLOSED (HIGH RISK)</span>
              <p className="text-xs text-[#475569] leading-normal">Block path for high-risk voice-authorized transfers when configured.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-[#F7F9FC] space-y-1.5">
              <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block">CODEC INVARIANCE</span>
              <span className="text-base font-mono font-black text-[#0D9488] uppercase block">G.711 / AMR / OPUS</span>
              <p className="text-xs text-[#475569] leading-normal">Designed for PSTN, VoIP and mobile voice codecs.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 space-y-20">
        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-[#1565C0] font-mono text-xs font-bold uppercase tracking-wider">CLAUSE 1.0</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2545] tracking-tight uppercase">AUTHORIZED DEPLOYMENT SCOPE & TELEPHONY ARCHITECTURE</h2>
            </div>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-4xl">
              VoiceShield is authorized for deployment as an inline or tap audio inspection filter across authenticated telecommunication networks, enterprise PBXs, and banking voice channels where contractually permitted.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1565C0]"><PhoneCall className="w-5 h-5" /></div>
              <h3 className="text-lg font-bold text-[#0B2545] uppercase tracking-wider">CARRIER & SIP TRUNK INTEGRATION</h3>
              <p className="text-sm text-[#475569] leading-relaxed">Telecommunications service providers may integrate VoiceShield via SBCs, SIP REC, or media-forking WebSocket gateways when properly authorized.</p>
            </div>
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0D9488]"><Radio className="w-5 h-5" /></div>
              <h3 className="text-lg font-bold text-[#0B2545] uppercase tracking-wider">BANKING & CONTACT CENTERS</h3>
              <p className="text-sm text-[#475569] leading-relaxed">Financial institutions may use VoiceShield for high-risk voice verification workflows with human review and configured mitigation policies.</p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-[#1565C0] font-mono text-xs font-bold uppercase tracking-wider">CLAUSE 2.0</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2545] tracking-tight uppercase">DUAL FAIL-SAFE STANDARD</h2>
            </div>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-4xl">VoiceShield instances should follow dual fail-safe principles: emergency paths fail-open; high-risk financial paths may fail-closed when configured.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-5 rounded-xl bg-white border border-emerald-200 shadow-sm space-y-3">
              <span className="text-xs font-mono font-bold text-[#065F46] uppercase">FAIL-OPEN · EMERGENCY</span>
              <h3 className="text-base font-bold text-[#0B2545] uppercase">UNINTERRUPTED EMERGENCY ROUTING</h3>
              <p className="text-xs text-[#475569] leading-relaxed">Emergency responder gateways must not be severed or delayed by inspection failures.</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-rose-200 shadow-sm space-y-3">
              <span className="text-xs font-mono font-bold text-[#991B1B] uppercase">FAIL-CLOSED · HIGH RISK</span>
              <h3 className="text-base font-bold text-[#0B2545] uppercase">ACTIVE MITIGATION & CHALLENGE GATE</h3>
              <p className="text-xs text-[#475569] leading-relaxed">When risk thresholds are exceeded, configured mitigation (challenge or block) may apply subject to operator policy.</p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-[#0D9488] font-mono text-xs font-bold uppercase tracking-wider">CLAUSE 3.0</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2545] tracking-tight uppercase">EVALUATION / DEMO ACCESS LICENSE</h2>
            </div>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-4xl">Authorized evaluators reviewing <strong className="text-[#0B2545] font-semibold">VoiceShield</strong> (Logic Intelligence Technologies) may inspect operational metrics under granted access.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
              <div className="text-xs font-mono font-bold text-[#1565C0] uppercase">RIGHT 01 · DEMO</div>
              <h3 className="text-sm font-bold text-[#0B2545] uppercase tracking-wider">CONFIGURED DEMO ACCESS</h3>
              <p className="text-xs text-[#475569] leading-relaxed">Authorized evaluators can use configured demo access without pre-registered carrier credentials.</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
              <div className="text-xs font-mono font-bold text-[#0D9488] uppercase">RIGHT 02 · FORENSIC</div>
              <h3 className="text-sm font-bold text-[#0B2545] uppercase tracking-wider">EVIDENCE EXPORT</h3>
              <p className="text-xs text-[#475569] leading-relaxed">Ability to export structured analysis records for review where enabled.</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
              <div className="text-xs font-mono font-bold text-[#1FA9A2] uppercase">RIGHT 03 · STRESS</div>
              <h3 className="text-sm font-bold text-[#0B2545] uppercase tracking-wider">STREAM TESTING</h3>
              <p className="text-xs text-[#475569] leading-relaxed">Authorized evaluators may inject synthetic audio into the live WebSocket to stress-test classification.</p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-[#1565C0] font-mono text-xs font-bold uppercase tracking-wider">CLAUSE 4.0</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2545] tracking-tight uppercase">TELECOMMUNICATIONS COMPLIANCE</h2>
            </div>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-4xl">VoiceShield deployments should be operated in accordance with applicable DoT, TRAI, and IT Act requirements for the customer&apos;s jurisdiction and use case.</p>
          </div>
        </section>

        <section className="space-y-8">
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-lg font-bold text-[#0B2545] uppercase">READY TO OPERATE OR EVALUATE VOICESHIELD?</h3>
              <p className="text-xs text-[#475569] max-w-xl leading-relaxed">Launch the live browser evaluation or sign in to the operator console when authorized.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/demo" className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#0B2545] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-sm">LIVE MIC DEMO</Link>
              <Link href="/login" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B2545] text-white hover:bg-[#1565C0] font-mono font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95">
                <span>OPERATOR SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
