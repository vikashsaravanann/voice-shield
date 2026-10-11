import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ShieldCheck, Zap, Layers, ArrowRight, CheckCircle2, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | VoiceShield Acoustic Pipeline",
  description: "Detailed explanation of VoiceShield multi-stage synthetic speech detection, DSP feature extraction, and risk calibration.",
};

const STAGES = [
  {
    num: "01",
    title: "Encrypted Stream Ingestion",
    detail: "Audio chunks (16-bit PCM, 16kHz or 8kHz narrowband) stream over authenticated WSS with client verification.",
    tech: "WebSocket RFC 6455 • TLS 1.3 • Ring buffer memory management"
  },
  {
    num: "02",
    title: "DSP Signal Preprocessing & VAD",
    detail: "Voice Activity Detection (VAD) separates conversational speech from ambient silence, line noise, and DTMF tones.",
    tech: "Zero-crossing density • Energy thresholding • 100ms analysis frames"
  },
  {
    num: "03",
    title: "Spectral & Biometric Extraction",
    detail: "Spectrogram analysis reveals phase discontinuities, robotic harmonic pitch artifacts, and absence of natural human jitter.",
    tech: "FFT Multi-band flux • Pitch period tracking • Glottal cycle consistency"
  },
  {
    num: "04",
    title: "Ensemble Inference & Kalman Smoothing",
    detail: "Scores from local acoustic models feed into a Kalman filter that prevents false alerts caused by fleeting network glitches.",
    tech: "State-space estimation • Dynamic covariance • Calibrated synthetic risk [0.0 - 1.0]"
  },
  {
    num: "05",
    title: "Forensic Chain-of-Custody & Alerting",
    detail: "Incidents generate structured cryptographic evidence packages including Section 65B certificates for formal dispute filing.",
    tech: "SHA-256 fingerprinting • Append-only audit logs • Twilio SMS & Webhook dispatch"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <Activity className="w-3.5 h-3.5" />
            <span>Explainable Security</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            The Science of Detecting Synthetic Voice
          </h1>
          <p className="text-base text-[#52677C] leading-relaxed">
            Generative AI and voice cloners leave micro-acoustic artifacts invisible to the human ear. VoiceShield isolates these digital fingerprints in milliseconds.
          </p>
        </div>

        <div className="space-y-6">
          {STAGES.map((s) => (
            <div key={s.num} className="p-6 sm:p-8 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#1565C0] transition-colors">
              <div className="flex items-start gap-4 sm:gap-6">
                <span className="text-3xl sm:text-4xl font-black text-[#1565C0] shrink-0">{s.num}</span>
                <div>
                  <h3 className="text-lg font-bold text-[#0B2545] mb-1">{s.title}</h3>
                  <p className="text-sm text-[#52677C] leading-relaxed mb-2">{s.detail}</p>
                  <p className="text-xs font-mono text-[#0B2545] bg-white px-2.5 py-1 rounded border border-[#E2E8F0] inline-block">
                    {s.tech}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/architecture" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors">
            <span>View Complete Infrastructure Diagram</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
