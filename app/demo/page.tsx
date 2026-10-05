import type { Metadata } from "next";
import Link from "next/link";
import { Cpu, Lock, Mic } from "lucide-react";
import { LiveConsole } from "@/components/demo/LiveConsole";

export const metadata: Metadata = {
  title: "Live Demo | VoiceShield",
  description:
    "Try the VoiceShield analysis pipeline on your own microphone. Runs in your browser; audio is not uploaded or stored.",
};

const FACTS = [
  { icon: Mic, text: "Uses your microphone after you press Start" },
  { icon: Lock, text: "Audio stays in this browser tab; nothing is uploaded or stored" },
  { icon: Cpu, text: "Lightweight in-browser detector, not the production model" },
];

/**
 * VoiceShield live demo. The interactive console lives in
 * components/demo/LiveConsole.tsx (mic capture, risk score, challenge, reconnect).
 */
export default function DemoPage() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="max-w-3xl">
        <p className="eyebrow">Live demo</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">Voice analysis console</h1>
        <p className="mt-3 text-base text-slate-300 leading-relaxed">
          Speak into your microphone and watch the pipeline score each 333 ms segment of audio for synthetic-voice
          indicators. Use <strong className="text-white font-semibold">Simulate cloned voice</strong> to see how the
          console escalates to a spoken challenge.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="How this demo handles your audio">
          {FACTS.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300"
            >
              <Icon aria-hidden className="h-3.5 w-3.5 text-brand-400 shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-8">
        <LiveConsole />
      </div>

      <p className="mt-10 text-sm text-slate-400">
        Scores on this page come from the in-browser detector and show how the pipeline behaves; they are not output of
        the production inference service. See the{" "}
        <Link href="/architecture" className="text-brand-300 underline underline-offset-4 hover:text-brand-200">
          architecture
        </Link>{" "}
        for how the production path works.
      </p>
    </div>
  );
}
