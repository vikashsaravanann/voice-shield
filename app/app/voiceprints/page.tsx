"use client";

import React from "react";
import { VoiceprintVault } from "@/components/VoiceprintVault";
import { Fingerprint, ShieldCheck, Info, Lock, UserCheck } from "lucide-react";

export default function WorkspaceVoiceprintsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              BIOMETRIC IDENTITY
            </span>
            <span className="text-xs text-[#52677C]">
              DPDP Act 2023 &bull; Consented Speaker Embeddings
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Voiceprint Biometric Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Enrolled acoustic speaker profiles used for zero-trust caller identity verification and neural clone rejection.
          </p>
        </div>
      </div>

      {/* Storage & Privacy Transparency Notice */}
      <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] text-xs text-[#52677C] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#1565C0] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#0B2545]">
            Biometric Storage &amp; Encryption Posture
          </p>
          <p>
            Raw audio waveforms are <strong>never stored</strong> in the biometric vault. Voiceprints are preserved strictly as non-invertible, irreversible mathematical vectors (acoustic embeddings) tagged with an anonymized subject identifier. Enrolled records are scoped exclusively to your authorized enterprise tenant.
          </p>
        </div>
      </div>

      {/* Main Interactive Vault */}
      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm">
        <VoiceprintVault />
      </div>

      {/* Security Specifications */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <span className="font-bold text-[#0B2545] uppercase tracking-wider text-[11px] block mb-1">
            Embedding Dimensionality
          </span>
          <p className="text-[#52677C]">128-dimensional acoustic feature vector extracted from 5s consented audio pass.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <span className="font-bold text-[#0B2545] uppercase tracking-wider text-[11px] block mb-1">
            Matching Distance
          </span>
          <p className="text-[#52677C]">Cosine similarity metric evaluated with dynamic threshold calibration (&ge; 0.82 match).</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <span className="font-bold text-[#0B2545] uppercase tracking-wider text-[11px] block mb-1">
            Anti-Replay Defense
          </span>
          <p className="text-[#52677C]">Coupled with Indic/English dynamic phonetic challenge prompts to thwart recorded replays.</p>
        </div>
      </div>
    </div>
  );
}
