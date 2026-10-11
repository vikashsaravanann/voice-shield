import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Product Changelog & Model Updates | VoiceShield",
  description: "Version history, neural detector updates, and platform improvements.",
};

const LOGS = [
  {
    version: "v2.4.0",
    date: "October 11, 2026",
    title: "Complete Enterprise Workspace Redesign & Section 65B Audit Hardening",
    items: [
      "Separated public customer marketing platform from private authorized /app security workspace.",
      "Hardened Supabase RLS policies across sessions, detection events, and support tickets.",
      "Upgraded Next.js font loading to native self-hosted standard without runtime CDN queries.",
      "Implemented bilingual challenge-response verification console for live telephony."
    ]
  },
  {
    version: "v2.3.2",
    date: "September 28, 2026",
    title: "Kalman Filter & Noise Rejection Optimization",
    items: [
      "Enhanced state-space Kalman smoother reducing false positives in narrow-band 8kHz cellular streams.",
      "Integrated Twilio Voice Media Stream bi-directional WebSocket handler."
    ]
  }
];

export default function ChangelogPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Release History</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            VoiceShield Platform Changelog
          </h1>
          <p className="text-base text-[#52677C]">
            Continuous engineering updates keeping our acoustic models ahead of generative cloning advancements.
          </p>
        </div>

        <div className="space-y-12">
          {LOGS.map((log) => (
            <div key={log.version} className="border-l-2 border-[#1565C0] pl-6 relative space-y-3">
              <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-[#1565C0] text-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-base text-[#1565C0]">{log.version}</span>
                <span className="text-xs text-[#52677C]">{log.date}</span>
              </div>
              <h3 className="text-lg font-bold text-[#0B2545]">{log.title}</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#52677C]">
                {log.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
