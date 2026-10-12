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
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const [zeroPersistence, setZeroPersistence] = useState(true);
  const [sec65bEnabled, setSec65bEnabled] = useState(true);
  const [isolateDemo, setIsolateDemo] = useState(true);
  const [retentionDays, setRetentionDays] = useState(30);
  const [kalmanSensitivity, setKalmanSensitivity] = useState(85);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setZeroPersistence(Boolean(data.zeroPersistence));
            setSec65bEnabled(Boolean(data.sec65bEnabled));
            setIsolateDemo(Boolean(data.isolateDemo));
            setRetentionDays(Number(data.retentionDays) || 30);
            setKalmanSensitivity(Number(data.kalmanSensitivity) || 85);
          }
        }
      } catch {
        try {
          const stored = localStorage.getItem("vs_workspace_settings");
          if (stored && active) {
            const parsed = JSON.parse(stored);
            if (typeof parsed.zeroPersistence === "boolean") setZeroPersistence(parsed.zeroPersistence);
            if (typeof parsed.sec65bEnabled === "boolean") setSec65bEnabled(parsed.sec65bEnabled);
            if (typeof parsed.isolateDemo === "boolean") setIsolateDemo(parsed.isolateDemo);
            if (typeof parsed.retentionDays === "number") setRetentionDays(parsed.retentionDays);
            if (typeof parsed.kalmanSensitivity === "number") setKalmanSensitivity(parsed.kalmanSensitivity);
          }
        } catch {
          // Defaults
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchSettings();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
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

    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      localStorage.setItem("vs_workspace_settings", JSON.stringify(payload));
      setSuccessToast("Workspace compliance policies and retention rules saved and persisted to tenant backend.");
    } catch {
      localStorage.setItem("vs_workspace_settings", JSON.stringify(payload));
      setSuccessToast("Workspace policies saved to local storage cache.");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessToast(""), 4000);
    }
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
              TENANT POLICIES
            </span>
            <span className="text-xs text-[#52677C]">
              Statutory Retention &amp; Audio Processing Parameters
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            System &amp; Privacy Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Configure ephemeral processing windows, Section 65B automation, and Kalman state-space filtering sensitivity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-xs font-semibold text-[#52677C] hover:text-[#0B2545] border border-[#DFE7EF] hover:bg-[#F7F9FC] transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-4 rounded-xl bg-[#E7F7EF] border border-[#A7F3D0] text-xs text-[#065F46] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />
            <span className="font-semibold">{successToast}</span>
          </div>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Policy Group 1: Audio Privacy & Retention */}
        <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-2xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <Database className="w-4 h-4 text-[#1565C0]" />
            <h2 className="text-sm font-bold text-[#0B2545]">Statutory Audio Storage &amp; DPDP 2023 Rules</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF]">
              <div>
                <span className="font-bold text-xs text-[#0B2545] block">
                  Zero Audio Persistence Mode (Ephemeral DSP)
                </span>
                <p className="text-xs text-[#52677C] mt-0.5">
                  Raw PCM16 telephony audio buffers are discarded from RAM immediately after feature extraction. Only cryptographic hashes and detection vectors are retained.
                </p>
              </div>
              <input
                type="checkbox"
                checked={zeroPersistence}
                onChange={(e) => setZeroPersistence(e.target.checked)}
                className="w-4 h-4 rounded text-[#1565C0] focus:ring-[#1565C0] border-[#CBD5E1] mt-1 cursor-pointer"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF]">
              <div>
                <span className="font-bold text-xs text-[#0B2545] block">
                  Automate Section 65B Draft Generation
                </span>
                <p className="text-xs text-[#52677C] mt-0.5">
                  Pre-compile tamper-evident SHA-256 certificate drafts upon incident quarantine to accelerate judicial filings under the Indian Evidence Act / BSA 2023.
                </p>
              </div>
              <input
                type="checkbox"
                checked={sec65bEnabled}
                onChange={(e) => setSec65bEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-[#1565C0] focus:ring-[#1565C0] border-[#CBD5E1] mt-1 cursor-pointer"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF]">
              <div>
                <span className="font-bold text-xs text-[#0B2545] block">
                  Isolate Browser Demo Sessions from SOC Incident Log
                </span>
                <p className="text-xs text-[#52677C] mt-0.5">
                  Prevent synthetic test microphone audio executed via /demo or /app/detection from polluting enterprise telephony audit logs.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isolateDemo}
                onChange={(e) => setIsolateDemo(e.target.checked)}
                className="w-4 h-4 rounded text-[#1565C0] focus:ring-[#1565C0] border-[#CBD5E1] mt-1 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1.5">
                Audit Event Retention Horizon
              </label>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-full sm:w-72 px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0B2545] focus:ring-2 focus:ring-[#1565C0] outline-none"
              >
                <option value={7}>7 Days (Strict Minimalist)</option>
                <option value={30}>30 Days (Standard Enterprise Default)</option>
                <option value={90}>90 Days (RBI Banking Guidance)</option>
                <option value={180}>180 Days (Forensic Investigation Archive)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Policy Group 2: Algorithmic Filter Parameters */}
        <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-2xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <Sliders className="w-4 h-4 text-[#1565C0]" />
            <h2 className="text-sm font-bold text-[#0B2545]">Kalman Filter Sensitivity &amp; Discontinuity Threshold</h2>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#0B2545] uppercase tracking-wider">
                Synthetic Detection Scrutiny Index
              </label>
              <span className="text-xs font-mono font-bold text-[#1565C0] px-2 py-0.5 rounded bg-[#E7F3FF] border border-[#BBDEFB]">
                {kalmanSensitivity}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              value={kalmanSensitivity}
              onChange={(e) => setKalmanSensitivity(Number(e.target.value))}
              className="w-full accent-[#1565C0] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#52677C] mt-1 font-mono">
              <span>50% (Permissive / High Telephony Noise)</span>
              <span>85% (Balanced Default)</span>
              <span>95% (Zero-Tolerance Banking)</span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Persisting Policy Parameters...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Workspace Policies</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
