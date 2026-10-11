"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ShieldCheck,
  Database,
  Lock,
  Save,
  RotateCcw,
  CheckCircle2,
  Info,
  Sliders,
  Server,
  Layers,
} from "lucide-react";

export default function SettingsPage() {
  const [zeroPersistence, setZeroPersistence] = useState(true);
  const [sec65bEnabled, setSec65bEnabled] = useState(true);
  const [isolateDemo, setIsolateDemo] = useState(true);
  const [retentionDays, setRetentionDays] = useState(30);
  const [kalmanSensitivity, setKalmanSensitivity] = useState(85);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vs_workspace_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.zeroPersistence === "boolean") setZeroPersistence(parsed.zeroPersistence);
        if (typeof parsed.sec65bEnabled === "boolean") setSec65bEnabled(parsed.sec65bEnabled);
        if (typeof parsed.isolateDemo === "boolean") setIsolateDemo(parsed.isolateDemo);
        if (typeof parsed.retentionDays === "number") setRetentionDays(parsed.retentionDays);
        if (typeof parsed.kalmanSensitivity === "number") setKalmanSensitivity(parsed.kalmanSensitivity);
      }
    } catch {
      // Use defaults
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      zeroPersistence,
      sec65bEnabled,
      isolateDemo,
      retentionDays,
      kalmanSensitivity,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem("vs_workspace_settings", JSON.stringify(payload));

    setTimeout(() => {
      setSaving(false);
      setSuccessToast("Workspace compliance policies and retention rules saved successfully.");
      setTimeout(() => setSuccessToast(""), 4000);
    }, 600);
  };

  const handleResetDefaults = () => {
    if (!window.confirm("Reset all settings to certified VoiceShield defaults?")) return;
    setZeroPersistence(true);
    setSec65bEnabled(true);
    setIsolateDemo(true);
    setRetentionDays(30);
    setKalmanSensitivity(85);
    localStorage.removeItem("vs_workspace_settings");
    setSuccessToast("Settings restored to factory certified defaults.");
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              TENANT GOVERNANCE
            </span>
            <span className="text-xs text-[#52677C]">
              DPDP Act 2023 &bull; ISO/IEC 27001 Data Policies
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Workspace Governance &amp; Privacy Policies
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Configure memory buffering zero-persistence, DPDP retention schedules, and acoustic filter gain.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F7F9FC] text-[#52677C] border border-[#DFE7EF] text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3 bg-[#E7F7EF] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Privacy and Data Retention */}
        <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <ShieldCheck className="w-4 h-4 text-[#1565C0]" />
            <h2 className="text-sm font-bold text-[#0B2545]">
              Ephemeral Processing &amp; Retention
            </h2>
          </div>

          {/* Toggle 1: Zero-Persistence Buffering */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
            <div>
              <label htmlFor="zero-persistence-toggle" className="font-bold text-xs text-[#0B2545] block">
                Zero-Persistence Audio Buffering
              </label>
              <p className="text-[11px] text-[#52677C] mt-0.5">
                Immediately zero-out raw PCM audio buffers from RAM upon completing 333ms feature extraction. No voice audio is written to disk.
              </p>
            </div>
            <input
              id="zero-persistence-toggle"
              type="checkbox"
              checked={zeroPersistence}
              onChange={(e) => setZeroPersistence(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-[#CBD5E1] text-[#1565C0] focus:ring-[#1565C0]"
            />
          </div>

          {/* Toggle 2: Automated Section 65B Certificate Generation */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
            <div>
              <label htmlFor="sec65b-toggle" className="font-bold text-xs text-[#0B2545] block">
                Automated §65B Certificate Drafting
              </label>
              <p className="text-[11px] text-[#52677C] mt-0.5">
                Automatically generate cryptographic SHA-256 evidence digests on confirmed attack sessions for Indian Evidence Act admissibility.
              </p>
            </div>
            <input
              id="sec65b-toggle"
              type="checkbox"
              checked={sec65bEnabled}
              onChange={(e) => setSec65bEnabled(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-[#CBD5E1] text-[#1565C0] focus:ring-[#1565C0]"
            />
          </div>

          {/* Toggle 3: Demo Sandbox Isolation */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
            <div>
              <label htmlFor="demo-isolation-toggle" className="font-bold text-xs text-[#0B2545] block">
                Isolate Public Demo Sessions
              </label>
              <p className="text-[11px] text-[#52677C] mt-0.5">
                Enforce strict tenant separation preventing unauthenticated public sandbox experiments from polluting production SOC telemetry.
              </p>
            </div>
            <input
              id="demo-isolation-toggle"
              type="checkbox"
              checked={isolateDemo}
              onChange={(e) => setIsolateDemo(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-[#CBD5E1] text-[#1565C0] focus:ring-[#1565C0]"
            />
          </div>

          {/* Retention Days Dropdown */}
          <div>
            <label htmlFor="retention-days-select" className="block text-xs font-bold text-[#0B2545] mb-1">
              Telemetry Retention Period (DPDP Act Schedule)
            </label>
            <select
              id="retention-days-select"
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-xs text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
            >
              <option value={7}>7 Days (Strict Minimal Retention)</option>
              <option value={30}>30 Days (Standard Enterprise SOC Default)</option>
              <option value={90}>90 Days (Financial Regulatory Compliance)</option>
              <option value={180}>180 Days (Extended Judicial Audit)</option>
            </select>
            <p className="text-[11px] text-[#52677C] mt-1">
              Expired session metadata and audit rows are permanently deleted via automated cron.
            </p>
          </div>
        </div>

        {/* Panel 2: Engine Calibration & Actions */}
        <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <Sliders className="w-4 h-4 text-[#1565C0]" />
            <h2 className="text-sm font-bold text-[#0B2545]">
              DSP Engine Parameters
            </h2>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label htmlFor="kalman-slider" className="font-bold text-[#0B2545]">Kalman Smoother Momentum Factor</label>
              <span className="font-mono font-bold text-[#1565C0]">0.{kalmanSensitivity}</span>
            </div>
            <input
              id="kalman-slider"
              type="range"
              min={60}
              max={95}
              value={kalmanSensitivity}
              onChange={(e) => setKalmanSensitivity(Number(e.target.value))}
              className="w-full accent-[#1565C0]"
            />
            <p className="text-[11px] text-[#52677C] mt-1">
              Balances transient line crackle rejection against clone onset detection speed. Default 0.85 is certified for telephony.
            </p>
          </div>

          <div className="p-4 bg-[#F7F9FC] rounded-xl border border-[#DFE7EF] text-xs text-[#52677C] space-y-2">
            <div className="flex items-center gap-2 text-[#0B2545] font-bold">
              <Info className="w-4 h-4 text-[#1565C0]" />
              <span>Statutory Compliance Declaration</span>
            </div>
            <p>
              Under Section 4(1) of the Digital Personal Data Protection Act, 2023, personal data processing must be limited to declared lawful purposes. VoiceShield processes strictly mathematical feature snapshots; caller biometrics are never shared with external aggregators.
            </p>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-[#1565C0] hover:bg-[#0B2545] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Policies..." : "Save Workspace Settings"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
