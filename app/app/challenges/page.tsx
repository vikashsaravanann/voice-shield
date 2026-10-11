"use client";

import React from "react";
import { ChallengeResponse } from "@/components/ChallengeResponse";
import { MessageSquare, ShieldCheck, Languages, Radio, CheckCircle2, Info } from "lucide-react";

export default function WorkspaceChallengesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              ACTIVE CHALLENGE-RESPONSE
            </span>
            <span className="text-xs text-[#52677C]">
              Indic &amp; English Dynamic ASR Verifier
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Dynamic Verification Challenges
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Phonetic challenge phrases generated at runtime in Hindi, Tamil, and English to defeat pre-recorded deepfakes and acoustic replays.
          </p>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] text-xs text-[#52677C] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#1565C0] shrink-0 mt-0.5" />
        <p>
          <strong>Operational Workflow:</strong> When an active telephony stream reaches an Amber risk threshold (&ge; 35% synthetic probability), the telephony bot injects a dynamic phonetic prompt into the call. The caller must repeat the specific phrase. Speech latency and phonetic formants are analyzed to confirm live human vocal cord response.
        </p>
      </div>

      {/* Interactive Challenge Component */}
      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm">
        <ChallengeResponse />
      </div>

      {/* Language Coverage Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="font-bold text-[#0B2545]">English (EN-IN / EN-US)</span>
          </div>
          <p className="text-[#52677C]">Consonant clusters and fricative transitions calibrated for acoustic neural clone detection.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="font-bold text-[#0B2545]">Hindi (HI-IN)</span>
          </div>
          <p className="text-[#52677C]">Devanagari aspirated stops (महाप्राण) and nasalization features designed to expose synthetic vocoder gaps.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="font-bold text-[#0B2545]">Tamil (TA-IN)</span>
          </div>
          <p className="text-[#52677C]">Dravidian retroflex consonants (ழ, ள, ற) highly resistant to generative AI zero-shot cloning.</p>
        </div>
      </div>
    </div>
  );
}
