import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Cpu, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "AI & Model Limitations Disclosure | VoiceShield",
  description: "Probabilistic confidence bounds, cellular compression artifacts, and human-in-the-loop requirements.",
};

export default function AILimitationsPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF4D9] text-[#8D6E00] border border-[#FFE082] mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Responsible AI Disclosure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            AI &amp; Model Limitations Disclosure
          </h1>
          <p className="text-xs text-[#52677C]">Updated: October 11, 2026 • Statutory Disclosure</p>
        </div>

        <section className="space-y-4 text-sm text-[#52677C] leading-relaxed">
          <h2 className="text-lg font-bold text-[#0B2545]">1. Probabilistic Nature of Acoustic Inference</h2>
          <p>
            VoiceShield inference engines output a calibrated probability score [0.0 - 1.0] representing acoustic confidence that an audio stream contains synthetic artifacts. <strong>A risk score is not an absolute legal determination of criminal fraud.</strong>
          </p>

          <h2 className="text-lg font-bold text-[#0B2545]">2. Telephony Degradation &amp; Cellular Codecs</h2>
          <p>
            Narrowband cellular telephony (such as AMR 8kHz or VoIP jitter buffers) can strip natural high-frequency voice harmonics. While VoiceShield employs Kalman state-space estimation to compensate, severely degraded audio may exhibit elevated uncertainty intervals.
          </p>

          <h2 className="text-lg font-bold text-[#0B2545]">3. Mandatory Human-in-the-Loop Protocol</h2>
          <p>
            In accordance with international responsible AI directives, VoiceShield is designed as a decision-support copilot for qualified security analysts. Critical actions (e.g. freezing bank accounts or denying emergency services) must incorporate human review.
          </p>

          <h2 className="text-lg font-bold text-[#0B2545]">4. Model Drift &amp; Retraining</h2>
          <p>
            As adversarial generative vocoders advance, acoustic baselines require periodic model fine-tuning. We release model updates and publish corresponding changelog entries to preserve high detection sensitivity.
          </p>
        </section>
      </div>
    </div>
  );
}
