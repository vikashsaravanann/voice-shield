import type { Metadata } from "next";
import Link from "next/link";
import { Cpu, Lock, Mic, ShieldCheck, ArrowRight } from "lucide-react";
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

export default function DemoPage() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>IN-BROWSER AUDIO SIMULATOR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B2545]">
          Voice Analysis Console
        </h1>
        <p className="mt-3 text-base text-[#52677C] leading-relaxed">
          Speak into your microphone and watch the pipeline score each 333 ms segment of audio for synthetic-voice
          indicators. Use <strong className="text-[#0B2545] font-semibold">Simulate cloned voice</strong> to see how the
          console escalates to a spoken challenge.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2.5" aria-label="How this demo handles your audio">
          {FACTS.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="inline-flex items-center gap-2 rounded-xl border border-[#DFE7EF] bg-white px-3.5 py-2 text-xs font-medium text-[#0B2545] shadow-xs"
            >
              <Icon aria-hidden className="h-3.5 w-3.5 text-[#1565C0] shrink-0" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </header>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DFE7EF] shadow-sm">
        <LiveConsole />
      </div>

      <div className="mt-8 p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#52677C]">
        <p>
          Need to connect high-volume production SIP trunks or carrier media forks?
        </p>
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 font-semibold text-[#1565C0] hover:underline shrink-0"
        >
          <span>Launch Enterprise SOC Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
