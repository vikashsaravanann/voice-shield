import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Activity,
  Languages,
  WifiOff,
  Lock,
  ArrowRight,
  Sparkles,
  Mic,
  Binary,
  ScrollText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "VoiceShield | AI-Powered Voice Security & Compliance Intelligence",
  description:
    "VoiceShield — an AI security product by Logic Intelligence Technologies. Analyze eligible voice interactions for configurable fraud-risk, security, compliance and quality signals, with structured evidence designed for enterprise workflows.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "VoiceShield",
    title: "VoiceShield | AI-Powered Voice Security & Compliance Intelligence",
    description:
      "An AI security product by Logic Intelligence Technologies. Configurable fraud-risk, security, compliance and quality signals with structured evidence for enterprise workflows.",
    images: [{ url: "/banner.png", width: 1200, height: 630, alt: "VoiceShield Banner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceShield | AI-Powered Voice Security & Compliance Intelligence",
    description:
      "An AI security product by Logic Intelligence Technologies. Voice security and compliance intelligence for enterprise workflows.",
    images: ["/banner.png"],
  },
};

const CORPORATE_REQUEST =
  "https://www.logicintelligencetechnologies.in/voice-shield/request";

const FEATURES = [
  {
    icon: Zap,
    title: "STREAMING WEBSOCKET INFERENCE",
    text: "Chunked PCM audio evaluated via feature extraction and a latency-focused model path. Designed so large LLM analysis is not placed in the real-time detector loop.",
  },
  {
    icon: Activity,
    title: "EXPLAINABLE SPECTRAL SIGNALS",
    text: "Spectral and signal markers surface anomaly indicators operators can review. Explanations never replace structured evidence.",
  },
  {
    icon: Languages,
    title: "CHALLENGE-RESPONSE WORKFLOWS",
    text: "Optional challenge prompts support active verification workflows where configured for the deployment.",
  },
  {
    icon: WifiOff,
    title: "RESILIENT STREAM BUFFERING",
    text: "Ring-buffer and reconnect strategies reduce impact of transient network loss during live sessions.",
  },
  {
    icon: Lock,
    title: "APPEND-ORIENTED AUDIT TRAIL",
    text: "Detection events, connection changes and auth challenges are designed to log to PostgreSQL with Row-Level Security where enabled.",
  },
  {
    icon: ShieldCheck,
    title: "PRIVACY-AWARE PROCESSING",
    text: "Designed to support configurable retention and privacy-oriented defaults. Exact retention depends on deployment, contracts and provider chain — not a universal zero-retention guarantee.",
  },
];

const METRICS = [
  ["REAL-TIME", "DETECTION PATH"],
  ["STRUCTURED", "EVIDENCE OUTPUT"],
  ["CONFIGURABLE", "RETENTION POLICY"],
  ["AUDIT-ORIENTED", "RLS LOGGING"],
];

/** Static architecture diagram. Uses only product terms already on this page; shows no live or sample telemetry. */
function DetectionPathDiagram() {
  const steps = [
    { icon: Mic, label: "Voice stream", sub: "Chunked PCM audio" },
    { icon: Zap, label: "Streaming WebSocket inference", sub: "Feature extraction · latency-focused model path" },
    { icon: Binary, label: "Explainable spectral signals", sub: "Markers operators can review" },
    { icon: ScrollText, label: "Append-oriented audit trail", sub: "PostgreSQL · Row-Level Security where enabled" },
  ];
  return (
    <figure
      aria-label="VoiceShield detection path: voice stream, streaming inference, spectral signals, audit trail"
      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,.7)]"
    >
      <figcaption className="flex items-center justify-between gap-3 mb-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-300">DEFENSE ARCHITECTURE</span>
        <span className="status status-normal">Product architecture</span>
      </figcaption>
      <ol className="relative space-y-3">
        <span aria-hidden className="absolute left-[19px] top-6 bottom-6 w-px bg-gradient-to-b from-brand-400/50 via-azure-500/40 to-slate-700" />
        {steps.map(({ icon: Icon, label, sub }, i) => (
          <li key={label} className="relative flex items-start gap-4 animate-riseIn" style={{ animationDelay: `${i * 70}ms` }}>
            <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-700 bg-slate-950 text-brand-300">
              <Icon aria-hidden className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-white uppercase tracking-wide break-words">{label}</p>
              <p className="text-[13px] text-slate-400 leading-snug">{sub}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-5 pt-4 border-t border-slate-800 text-xs text-slate-500 leading-relaxed">
        Capabilities describe the product architecture; live production behaviour depends on deployed models, hosts and configuration.
      </p>
    </figure>
  );
}

export default function HomePage() {
  return (
    <div className="text-slate-100 flex flex-col selection:bg-brand-400 selection:text-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/70 py-1.5 sm:py-2 px-4 text-center">
        <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.08em] sm:tracking-[0.14em] leading-snug text-brand-200 text-balance">
          A LOGIC INTELLIGENCE TECHNOLOGIES PRODUCT | AI SECURITY &amp; VOICE FRAUD INTELLIGENCE
        </p>
      </div>

      <section className="relative px-4 sm:px-6 pt-12 pb-14 md:pt-20 md:pb-24 max-w-7xl mx-auto w-full">
        <div className="grid gap-10 lg:gap-14 lg:grid-cols-[1.15fr_0.85fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700 bg-slate-900/80 text-xs text-slate-200 mb-7">
              <Sparkles aria-hidden className="w-3.5 h-3.5 text-brand-400" />
              <span>AI-Powered Voice Security &amp; Compliance Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05]">
              Detect the clone. <br />
              <span className="text-brand-400">Protect the conversation.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-9 leading-relaxed">
              Analyze eligible voice interactions for configurable fraud-risk,
              security, compliance and quality signals, with structured evidence
              designed for enterprise workflows. Built for telecom, BFSI, BPO and
              high-volume voice operations.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <a href={CORPORATE_REQUEST} className="btn btn-primary px-7 group">
                REQUEST ACCESS
                <ArrowRight aria-hidden className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link href="/architecture" className="btn btn-secondary px-7">EXPLORE PLATFORM</Link>
              <Link href="/docs" className="btn btn-ghost px-7">VIEW API / DOCS</Link>
            </div>
          </div>

          <DetectionPathDiagram />
        </div>
      </section>

      <section aria-label="Platform characteristics" className="border-y border-slate-800 bg-slate-900/40">
        <dl className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-800">
          {METRICS.map(([k, label]) => (
            <div key={k} className="px-4 py-7 sm:px-6 text-center">
              <dt className="text-base sm:text-xl font-semibold text-white tracking-wide break-words">{k}</dt>
              <dd className="mt-1 text-[11px] sm:text-xs text-slate-400 uppercase tracking-[0.14em] font-medium">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="px-4 sm:px-6 py-16 md:py-24 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300 block mb-3">
            DEFENSE ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white uppercase tracking-tight">
            ENGINEERED FOR ENTERPRISE VOICE SECURITY
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            VoiceShield is a product of Logic Intelligence Technologies. Capabilities below describe the product architecture; live
            production behaviour depends on deployed models, hosts and
            configuration.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-colors hover:border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 grid place-items-center text-brand-300 mb-4">
                <Icon aria-hidden className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-semibold text-white mb-2 uppercase tracking-wide">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
