"use client";

import React from "react";
import Link from "next/link";
import { Shield, Award, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      role: "Product & ML Systems Architecture",
      focus: "Model selection, dual-stream INT8 quantization, calibration, and policy thresholds",
    },
    {
      role: "Audio DSP & Speech Processing",
      focus: "LFCC linear filterbanks, bispectral quadratic coupling B(f1, f2), VAD gating",
    },
    {
      role: "Real-Time Streaming & Backend",
      focus: "WebSocket duplex streaming, ring buffer replay, Redis session state, SIP trunking",
    },
    {
      role: "Security & Full-Stack Systems",
      focus: "Dynamic phonemic challenge-response, DPDP Act 2023 zero-retention, SOC dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#121826] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 bg-white text-[#1565C0] text-xs font-mono font-bold tracking-widest uppercase shadow-sm">
            <Award className="w-3.5 h-3.5" />
            <span>LOGIC INTELLIGENCE TECHNOLOGIES · PRODUCT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0B2545] uppercase">
            ABOUT VOICESHIELD
          </h1>
          <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
            VoiceShield is an enterprise AI security product by Logic Intelligence Technologies.
            Real-time detection and prevention of voice-cloning impersonation attacks across telephony and digital voice channels.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <span className="text-xs font-mono font-bold text-[#1565C0] uppercase tracking-widest">
            THE CORE MISSION
          </span>
          <h2 className="text-2xl font-bold text-[#0B2545] uppercase tracking-tight">
            STOPPING VOICE CLONE FRAUD INSIDE THE CALL, NOT AFTER IT
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            Existing speech forensics tools are offline batch processors — they report fraud hours after the damage is done.
            VoiceShield is built as real-time middleware: detect, challenge, and block within the live conversation while respecting DPDP-aligned zero raw-audio retention.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#0B2545] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#1565C0]" />
            Engineering focus areas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {team.map((t) => (
              <div
                key={t.role}
                className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-sm"
              >
                <h3 className="text-sm font-bold text-[#0B2545] tracking-wide">{t.role}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{t.focus}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
          <span className="text-xs font-mono font-bold text-[#1565C0] uppercase tracking-widest">
            Product ownership
          </span>
          <ul className="space-y-2 text-sm text-[#475569]">
            <li className="flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#065F46] shrink-0 mt-0.5" />
              Designed and operated by Logic Intelligence Technologies
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#065F46] shrink-0 mt-0.5" />
              Company site: www.logicintelligencetechnologies.in/voice-shield
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#065F46] shrink-0 mt-0.5" />
              Access via registered demo / beta request — not public self-serve
            </li>
          </ul>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#1565C0] hover:text-[#0D47A1] pt-2"
          >
            Back to overview <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
