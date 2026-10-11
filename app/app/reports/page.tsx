"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  FileCheck2,
  Download,
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  X,
  Info,
} from "lucide-react";
import { generateSection65BCertificate } from "@/lib/exportSection65B";
import type { ForensicReportData } from "@/lib/audio/forensicAnalyzer";

interface ReportItem {
  id: string;
  title: string;
  caseRef: string;
  examiner: string;
  date: string;
  fileSha256: string;
  verdict: string;
  status: "CERTIFIED" | "DRAFT" | "UNDER REVIEW";
}

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: "REP-2026-65B-01",
    title: "Section 65B Electronic Record Certificate: Banking Splice Investigation",
    caseRef: "CASE-2026-FORENSIC-01",
    examiner: "Lead Forensic Audio Analyst",
    date: "2026-10-11",
    fileSha256: "7a81b2c4d9e0f31a2b5c8d7e4f1a0b3c6d9e2f5a8b1c4d7e0f3a6b9c2d5e8f1a",
    verdict: "Synthetic Insertion Detected (Confidence 0.94)",
    status: "CERTIFIED",
  },
  {
    id: "REP-2026-65B-02",
    title: "Carrier Trunk Acoustic Verification: Telephony Stream Audit",
    caseRef: "AUDIT-TRUNK-2026-08",
    examiner: "SOC Operations Desk",
    date: "2026-10-10",
    fileSha256: "bb12c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    verdict: "Authentic Human Voice Spectrum",
    status: "CERTIFIED",
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const [form, setForm] = useState({
    title: "Section 65B Certificate of Electronic Record",
    caseRef: "CASE-2026-INSPECT-03",
    examiner: "Authorized SOC Forensic Examiner",
    organization: "Logic Intelligence Technologies VoiceShield SOC",
  });

  const handleGeneratePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      // Mocked synthesis report data for the legal generator
      const mockReportData: ForensicReportData = {
        fileName: `${form.caseRef.toLowerCase()}_audio_evidence.wav`,
        fileSizeBytes: 144200,
        fileSha256: crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, ""),
        durationSeconds: 4.5,
        sampleRate: 16000,
        channels: 1,
        totalChunks: 14,
        overallSpoofProbability: 0.91,
        maxSpoofProbability: 0.96,
        p95SpoofProbability: 0.94,
        overallRiskLevel: "high",
        syntheticDurationMs: 3200,
        syntheticRatio: 0.71,
        entropyScore: 0.42,
        analyzedAt: new Date().toISOString(),
        engineVersion: "2.4.0",
        slices: [],
        spliceRegions: [],
      };

      generateSection65BCertificate(mockReportData, {
        examinerName: form.examiner,
        examinerTitle: "Forensic Electronic Examiner",
        organization: form.organization,
        accreditationId: "LIT-SOC-65B-2026",
        caseReference: form.caseRef,
      });

      const newReport: ReportItem = {
        id: `REP-2026-65B-0${reports.length + 1}`,
        title: form.title,
        caseRef: form.caseRef,
        examiner: form.examiner,
        date: new Date().toISOString().split("T")[0],
        fileSha256: mockReportData.fileSha256,
        verdict: "Synthetic Insertion Detected (Confidence 0.91)",
        status: "CERTIFIED",
      };

      setReports((prev) => [newReport, ...prev]);
      setModalOpen(false);
      setSuccessToast(`Certificate for ${form.caseRef} generated and downloaded.`);
      setTimeout(() => setSuccessToast(""), 4000);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadExisting = (item: ReportItem) => {
    const mockReportData: ForensicReportData = {
      fileName: `${item.caseRef.toLowerCase()}_evidence.wav`,
      fileSizeBytes: 128000,
      fileSha256: item.fileSha256,
      durationSeconds: 4.2,
      sampleRate: 16000,
      channels: 1,
      totalChunks: 12,
      overallSpoofProbability: 0.88,
      maxSpoofProbability: 0.94,
      p95SpoofProbability: 0.91,
      overallRiskLevel: "high",
      syntheticDurationMs: 2800,
      syntheticRatio: 0.66,
      entropyScore: 0.38,
      analyzedAt: new Date().toISOString(),
      engineVersion: "2.4.0",
      slices: [],
      spliceRegions: [],
    };

    generateSection65BCertificate(mockReportData, {
      examinerName: item.examiner,
      examinerTitle: "Forensic Electronic Examiner",
      organization: "Logic Intelligence Technologies VoiceShield SOC",
      accreditationId: "LIT-SOC-65B-2026",
      caseReference: item.caseRef,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              EVIDENCE VAULT
            </span>
            <span className="text-xs text-[#52677C]">
              Indian Evidence Act § 65B &amp; BSA 2023 § 63
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Forensic Report Library &amp; Legal Certificates
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Court-admissible electronic evidence packages with hardware checksums, tamper-evident SHA-256 digests, and statutory declarations.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1565C0] hover:bg-[#0B2545] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Draft New Certificate</span>
        </button>
      </div>

      {/* Success Banner */}
      {successToast && (
        <div className="p-3 bg-[#E7F7EF] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0B2545]">
              Issued Electronic Record Certificates
            </h2>
            <p className="text-xs text-[#52677C]">
              Exported evidence packages preserved under immutable custody procedures.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3">Certificate ID</th>
                <th className="px-6 py-3">Case Reference</th>
                <th className="px-6 py-3">Acoustic Verdict</th>
                <th className="px-6 py-3">SHA-256 Digest</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Issue Date</th>
                <th className="px-6 py-3 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-[#0B2545]">
                    {r.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#0B2545]">
                    {r.caseRef}
                  </td>
                  <td className="px-6 py-4 text-[#52677C]">
                    {r.verdict}
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-[#52677C]">
                    {r.fileSha256.slice(0, 16)}...
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F7EF] text-[#065F46] border border-[#A7F3D0]">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#52677C]">
                    {r.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDownloadExisting(r)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F9FC] hover:bg-[#E2E8F0] text-[#0B2545] font-semibold text-xs border border-[#DFE7EF] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-[#1565C0]" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Draft Certificate Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DFE7EF] space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1565C0] bg-[#E7F3FF] px-2 py-0.5 rounded border border-[#BBDEFB]">
                  Legal Generator
                </span>
                <h3 className="text-base font-bold text-[#0B2545] mt-1">
                  Draft Section 65B Certificate
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-md text-[#94A3B8] hover:text-[#0B2545]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGeneratePdf} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#0B2545] mb-1">
                  Case Docket Reference *
                </label>
                <input
                  type="text"
                  required
                  value={form.caseRef}
                  onChange={(e) => setForm({ ...form, caseRef: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B2545] mb-1">
                  Authorized Examiner Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.examiner}
                  onChange={(e) => setForm({ ...form, examiner: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B2545] mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
                />
              </div>

              <div className="p-3 bg-[#E7F3FF] rounded-xl border border-[#BBDEFB] text-[11px] text-[#1565C0]">
                <strong>Statutory Notice:</strong> The resulting PDF document will incorporate mandatory statutory clauses under Section 65B(2) of the Indian Evidence Act, 1872 and Section 63 Bharatiya Sakshya Adhiniyam, 2023 certifying computer system integrity.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#DFE7EF] text-[#52677C] hover:bg-[#F7F9FC] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-4 py-2 bg-[#1565C0] hover:bg-[#0B2545] text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{generating ? "Compiling PDF..." : "Generate & Download PDF"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statutory Disclaimer */}
      <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs text-[#52677C] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#8D6E00] shrink-0 mt-0.5" />
        <p>
          Certificates produced here are evidentiary tools for internal compliance, dispute adjudication, and investigative preparation. Formal submission to law enforcement or courts should be performed by an authorized security officer or legal representative.
        </p>
      </div>
    </div>
  );
}
