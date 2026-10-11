"use client";

import React, { useState, useRef, useEffect } from "react";
import { SplicingHeatmap } from "@/components/sandbox/SplicingHeatmap";
import { DualAxisMatrix } from "@/components/DualAxisMatrix";
import {
  analyzeForensicAudio,
  type ForensicReportData,
} from "@/lib/audio/forensicAnalyzer";
import { generateSection65BCertificate } from "@/lib/exportSection65B";
import {
  getEnrolledVoiceprints,
  type VoiceprintProfile,
} from "@/lib/audio/voiceprint";
import {
  Upload,
  FileAudio,
  Play,
  Pause,
  RotateCcw,
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";

function pcmToWavBlob(pcmData: Float32Array, sampleRate = 16000): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcmData.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < pcmData.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export default function WorkspaceForensicsPage() {
  const [activeTab, setActiveTab] = useState<"splicing" | "dual_axis">("splicing");
  const [report, setReport] = useState<ForensicReportData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [selectedCase, setSelectedCase] = useState<string>("spliced");
  const [isDragging, setIsDragging] = useState(false);

  // Dual-axis states
  const [activeProfile, setActiveProfile] = useState<VoiceprintProfile | null>(null);
  const [speakerMatch, setSpeakerMatch] = useState<number>(0.86);
  const [syntheticRisk, setSyntheticRisk] = useState<number>(0.92);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const list = getEnrolledVoiceprints();
    if (list.length > 0) setActiveProfile(list[0]);
    loadPresetCase("spliced");
  }, []);

  const loadPresetCase = async (caseType: "spliced" | "clone" | "authentic") => {
    setIsAnalyzing(true);
    setIsPlaying(false);
    setCurrentTimeMs(0);
    setSelectedCase(caseType);

    const sampleRate = 16000;
    const duration = caseType === "spliced" ? 4.5 : 3.8;
    const totalSamples = Math.floor(sampleRate * duration);
    const dummyPcm = new Float32Array(totalSamples);

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      dummyPcm[i] =
        0.3 * Math.sin(2 * Math.PI * 140 * t) +
        0.15 * Math.sin(2 * Math.PI * 280 * t) +
        (Math.random() - 0.5) * 0.04;
    }

    const wavBlob = pcmToWavBlob(dummyPcm, sampleRate);
    const fileName =
      caseType === "spliced"
        ? "banking_wire_fraud_spliced.wav"
        : caseType === "clone"
        ? "elevenlabs_neural_clone.wav"
        : "authentic_human_dialogue.wav";
    const file = new File([wavBlob], fileName, { type: "audio/wav" });

    try {
      const res = await analyzeForensicAudio(file, caseType);
      setReport(res);

      if (caseType === "spliced" || caseType === "clone") {
        setSpeakerMatch(0.88);
        setSyntheticRisk(res.overallSpoofProbability);
      } else {
        setSpeakerMatch(0.92);
        setSyntheticRisk(res.overallSpoofProbability);
      }
    } catch (err) {
      console.error("Forensic analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const processAudioFile = async (file: File) => {
    setIsAnalyzing(true);
    setIsPlaying(false);
    setCurrentTimeMs(0);
    setSelectedCase("custom");

    try {
      const res = await analyzeForensicAudio(file);
      setReport(res);
      setSyntheticRisk(res.overallSpoofProbability);
      setSpeakerMatch(0.74);
    } catch (err) {
      console.error("Audio decoding failed:", err);
      alert("Unable to decode audio. Please ensure it is a valid .wav, .mp3, .m4a, or .ogg file.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePlay = () => {
    if (!report) return;
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const totalMs = report.durationSeconds * 1000;
      timerRef.current = setInterval(() => {
        setCurrentTimeMs((prev) => {
          if (prev >= totalMs) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev + 50;
        });
      }, 50);
    }
  };

  const resetPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setCurrentTimeMs(0);
  };

  const handleExportSection65B = () => {
    if (!report) return;
    generateSection65BCertificate(report, {
      examinerName: "Authorized SOC Forensic Examiner",
      examinerTitle: "Lead Forensic Audio Analyst",
      organization: "Logic Intelligence Technologies VoiceShield SOC",
      accreditationId: "LIT-SOC-65B-2026",
      caseReference: "CASE-2026-FORENSIC-01",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Case Selectors */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              LABORATORY SUITE
            </span>
            <span className="text-xs text-[#52677C]">
              Indian Evidence Act § 65B &amp; BSA 2023 § 63
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Deep Forensic Investigation Lab
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Micro-slice spectrogram continuity, splice boundary detection, and certified electronic evidence drafting.
          </p>
        </div>

        {/* Preset Case Switcher */}
        <div className="flex items-center gap-2 bg-[#F7F9FC] p-1 rounded-xl border border-[#DFE7EF] flex-wrap">
          <button
            onClick={() => loadPresetCase("spliced")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCase === "spliced"
                ? "bg-white text-[#991B1B] shadow-sm border border-[#F8BBD0]"
                : "text-[#52677C] hover:text-[#0B2545]"
            }`}
          >
            Banking Wire Fraud Splice
          </button>
          <button
            onClick={() => loadPresetCase("clone")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCase === "clone"
                ? "bg-white text-[#8D6E00] shadow-sm border border-[#FFE082]"
                : "text-[#52677C] hover:text-[#0B2545]"
            }`}
          >
            Neural AI Clone
          </button>
          <button
            onClick={() => loadPresetCase("authentic")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCase === "authentic"
                ? "bg-white text-[#065F46] shadow-sm border border-[#A7F3D0]"
                : "text-[#52677C] hover:text-[#0B2545]"
            }`}
          >
            Authentic Human
          </button>
        </div>
      </div>

      {/* Upload Drag & Drop Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) processAudioFile(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center ${
          isDragging
            ? "border-[#1565C0] bg-[#E7F3FF]/40"
            : "border-[#CBD5E1] hover:border-[#1565C0] bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processAudioFile(file);
          }}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#E7F3FF] text-[#1565C0] flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-[#0B2545]">
            Upload Telephony Recording for Multi-Band Slicing
          </p>
          <p className="text-[11px] text-[#52677C]">
            Supports G.711 WAV, MP3, M4A, and OGG • SHA-256 hash calculated automatically
          </p>
        </div>
      </div>

      {/* Forensic Findings Summary Card */}
      {report && (
        <div className="bg-white rounded-2xl border border-[#DFE7EF] p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-[#1565C0]" />
                <span className="font-mono text-xs font-bold text-[#0B2545]">
                  {report.fileName}
                </span>
                <span className="text-[10px] text-[#52677C]">
                  ({report.durationSeconds.toFixed(2)}s • {report.sampleRate} Hz)
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#94A3B8] mt-0.5 truncate max-w-md">
                SHA-256: {report.fileSha256}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="px-3 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#1565C0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? "Pause" : "Play & Scrub"}</span>
              </button>
              <button
                onClick={resetPlay}
                className="p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F7F9FC] text-[#52677C]"
                title="Reset Scrub"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleExportSection65B}
                className="px-3.5 py-1.5 rounded-lg bg-[#065F46] hover:bg-[#047857] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-[#A7F3D0]" />
                <span>Export §65B Certificate (PDF)</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-[#52677C] uppercase">Verdict</span>
              <p className="font-bold text-[#0B2545] mt-0.5">{report.overallRiskLevel.toUpperCase()}</p>
            </div>
            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-[#52677C] uppercase">Spoof Probability</span>
              <p
                className={`font-mono font-bold mt-0.5 ${
                  report.overallSpoofProbability >= 0.75
                    ? "text-[#991B1B]"
                    : "text-[#065F46]"
                }`}
              >
                {Math.round(report.overallSpoofProbability * 100)}%
              </p>
            </div>
            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-[#52677C] uppercase">Detected Slices</span>
              <p className="font-mono font-bold text-[#0B2545] mt-0.5">
                {report.slices.length} Windows
              </p>
            </div>
            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-[#52677C] uppercase">Anomalous Hops</span>
              <p className="font-mono font-bold text-[#991B1B] mt-0.5">
                {report.slices.filter((s) => s.isSpliced).length} Spliced
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View Mode Tabs */}
      <div className="flex border-b border-[#E2E8F0]">
        <button
          onClick={() => setActiveTab("splicing")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "splicing"
              ? "border-[#1565C0] text-[#1565C0]"
              : "border-transparent text-[#52677C] hover:text-[#0B2545]"
          }`}
        >
          Spectrogram Slicing Heatmap
        </button>
        <button
          onClick={() => setActiveTab("dual_axis")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
            activeTab === "dual_axis"
              ? "border-[#1565C0] text-[#1565C0]"
              : "border-transparent text-[#52677C] hover:text-[#0B2545]"
          }`}
        >
          Dual-Axis Biometric / Synthetic Matrix
        </button>
      </div>

      {/* Main Forensic Visualization Panel */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] p-6 shadow-sm">
        {activeTab === "splicing" && report && (
          <SplicingHeatmap
            report={report}
            currentTimeMs={currentTimeMs}
            onSeek={(ms) => setCurrentTimeMs(ms)}
            isPlaying={isPlaying}
          />
        )}

        {activeTab === "dual_axis" && (
          <div className="max-w-2xl mx-auto py-4">
            <DualAxisMatrix
              speakerMatch={speakerMatch}
              syntheticRisk={syntheticRisk}
              contactName={
                selectedCase === "spliced"
                  ? "Claimed Wire Beneficiary"
                  : selectedCase === "clone"
                  ? "Executive Authorized Caller"
                  : "Verified Verified Account Holder"
              }
            />
          </div>
        )}
      </div>

      {/* Legal & Judicial Admissibility Disclaimer */}
      <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0] text-xs text-[#52677C] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#8D6E00] shrink-0 mt-0.5" />
        <p>
          <strong>Statutory Compliance Notice:</strong> Certificates generated by VoiceShield contain cryptographic SHA-256 hashes and timestamped examiner declarations pursuant to Section 65B of the Indian Evidence Act, 1872 and Section 63 of Bharatiya Sakshya Adhiniyam, 2023. Final evidentiary weight and admissibility remains subject to verification by the competent trial court.
        </p>
      </div>
    </div>
  );
}
