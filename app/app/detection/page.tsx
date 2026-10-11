"use client";

import React from "react";
import { LiveConsole } from "@/components/demo/LiveConsole";
import { Radio, ShieldAlert, CheckCircle2, Lock } from "lucide-react";

export default function WorkspaceDetectionPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F7EF] text-[#065F46] border border-[#A7F3D0]">
              LIVE CONSOLE
            </span>
            <span className="text-xs text-[#52677C]">WSS: /ws/audio</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Live Acoustic Stream Detector
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Connect an authorized microphone or SIP audio stream to inspect spectrogram flux and synthetic probabilities in real-time.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DFE7EF] shadow-sm">
        <LiveConsole />
      </div>
    </div>
  );
}
