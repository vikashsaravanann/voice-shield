import type { Metadata } from "next";
import Link from "next/link";
import { Database, Clock, Trash2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Data Retention & Storage Controls | VoiceShield",
  description: "Retention schedules for raw audio buffers, DSP feature vectors, and forensic incident packages.",
};

export default function DataRetentionPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Data Lifecycle</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Data Retention &amp; Storage Controls
          </h1>
          <p className="text-xs text-[#52677C]">Effective Date: October 11, 2026 • DPDP Aligned</p>
        </div>

        <section className="space-y-4 text-sm text-[#52677C] leading-relaxed">
          <h2 className="text-lg font-bold text-[#0B2545]">1. Data Categorization &amp; Retention Schedules</h2>
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] space-y-3">
            <div>
              <p><strong className="text-[#0B2545]">Raw PCM Audio Streams:</strong> Retained only in transient RAM buffers during active call processing. In Zero-Persistence mode, deleted within 500ms of call completion.</p>
            </div>
            <div>
              <p><strong className="text-[#0B2545]">Acoustic Feature Telemetry:</strong> Anonymized FFT spectral flux, pitch jitter, and Kalman scores retained for 30 days for drift analysis unless customer specifies shorter window.</p>
            </div>
            <div>
              <p><strong className="text-[#0B2545]">Section 65B Forensic Evidence:</strong> Exported PDF/JSON reports and cryptographic SHA-256 hashes retained per customer compliance policy (typically 1 to 7 years for court cases).</p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-[#0B2545]">2. Right to Erasure &amp; Purge Requests</h2>
          <p>
            In accordance with India DPDP Act 2023 and EU GDPR Article 17, enterprise administrators can trigger cryptographic data purge across their tenant via the Settings panel or automated REST API endpoints.
          </p>
        </section>
      </div>
    </div>
  );
}
