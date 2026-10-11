"use client";

import React, { useState } from "react";
import { LiveConsole } from "@/components/demo/LiveConsole";
import {
  Radio,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Volume2,
  Cpu,
  Info,
  Sliders,
  Sparkles,
} from "lucide-react";

export default function WorkspaceDetectionPage() {
  const [operationalMode, setOperationalMode] = useState<"live" | "demo">("live");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F7EF] text-[#065F46] border border-[#A7F3D0]">
              {operationalMode === "live" ? "REALTIME INFERENCE" : "SIMULATION SANDBOX"}
            </span>
            <span className="text-xs text-[#52677C]">Acoustic Stream: 16 kHz G.711 / PCM16</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Live Acoustic Stream Detector
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Capture authorized microphone or telephony audio to analyze spectrogram continuity, pitch jitter, and synthetic clone probability in real time.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-[#F7F9FC] p-1 rounded-xl border border-[#DFE7EF]">
          <button
            onClick={() => setOperationalMode("live")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              operationalMode === "live"
                ? "bg-white text-[#0B2545] shadow-sm border border-[#DFE7EF]"
                : "text-[#52677C] hover:text-[#0B2545]"
            }`}
          >
            Live Microphone
          </button>
          <button
            onClick={() => setOperationalMode("demo")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              operationalMode === "demo"
                ? "bg-white text-[#0B2545] shadow-sm border border-[#DFE7EF]"
                : "text-[#52677C] hover:text-[#0B2545]"
            }`}
          >
            Attack Simulator
          </button>
        </div>
      </div>

      {/* Advisory & Consent Banner */}
      <div className="p-4 rounded-xl bg-[#E7F3FF] border border-[#BBDEFB] text-[#1565C0] text-xs flex items-start gap-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#0B2545]">
            Explicit Operator Interaction Required
          </p>
          <p className="text-[#52677C]">
            Per privacy guidelines, audio capture never starts automatically. Click <strong>Start Live Detection</strong> below to prompt for microphone permission. Audio samples are analyzed in ephemeral RAM buffers and are immediately purged after Kalman smoothing.
          </p>
        </div>
      </div>

      {/* Main Live Console Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DFE7EF] shadow-sm">
        <LiveConsole />
      </div>

      {/* Detection Engine Parameters Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <p className="font-bold text-[#0B2545] uppercase tracking-wider text-[11px] mb-1">
            Sampling Pipeline
          </p>
          <p className="text-[#52677C]">16,000 Hz sample rate • 333 ms hop window • 4 sec ring buffer</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <p className="font-bold text-[#0B2545] uppercase tracking-wider text-[11px] mb-1">
            Dual Classification
          </p>
          <p className="text-[#52677C]">DSP Glottal Pulse Extraction + Zero-Shot Acoustic Clone Classifiers</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <p className="font-bold text-[#0B2545] uppercase tracking-wider text-[11px] mb-1">
            Evidence Handling
          </p>
          <p className="text-[#52677C]">Section 65B hash generation on persistent sessions for legal review</p>
        </div>
      </div>
    </div>
  );
}
