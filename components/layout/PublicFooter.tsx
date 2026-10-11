"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  CheckCircle2,
  ArrowUpRight,
  Cookie,
  Cpu,
  Database,
  PhoneCall,
  ShieldAlert,
  Eye,
  FileCode2,
  FileText,
} from "lucide-react";

/**
 * Trust & Legal Repository Links for VoiceShield.
 * Arranged strictly in horizontal pairs:
 * Row 1: Button 1 (Privacy Policy) | Button 2 (Terms of Service)
 * Row 2: Button 3 (Cookie Policy)  | Button 4 (Acceptable Use)
 * Row 3: Button 5 (AI & Model Limits) | Button 6 (Data & Retention)
 * Row 4: Button 7 (Telephony Consent) | Button 8 (Vulnerability Disclosure)
 * Row 5: Button 9 (Accessibility)  | Button 10 (Copyright & DMCA Agent)
 */
const TRUST_LEGAL_BUTTONS = [
  {
    title: "Privacy Policy",
    href: "/privacy",
    fullUrl: "https://voiceshield.logicintelligencetechnologies.in/privacy",
    description: "Audio privacy, real-time telemetry & zero biometric storage",
    icon: ShieldCheck,
  },
  {
    title: "Terms of Service",
    href: "/terms",
    fullUrl: "https://voiceshield.logicintelligencetechnologies.in/terms",
    description: "Enterprise SLA, licensing commitments & operational terms",
    icon: FileText,
  },
  {
    title: "Cookie Policy",
    href: "/cookie-policy",
    fullUrl: "https://voiceshield.logicintelligencetechnologies.in/cookie-policy",
    description: "Essential SOC tokens & fraud session cookies",
    icon: Cookie,
  },
  {
    title: "Acceptable Use",
    href: "/acceptable-use",
    fullUrl: "https://voiceshield.logicintelligencetechnologies.in/acceptable-use",
    description: "Ethical defensive usage & spoof prevention standards",
    icon: CheckCircle2,
  },
  {
    title: "AI & Model Limitations",
    href: "/ai-limitations",
    fullUrl: "https://voiceshield.logicintelligencetechnologies.in/ai-limitations",
    description: "Probabilistic boundaries & false-positive governance",
    icon: Cpu,
  },
  {
    title: "Data & Retention Controls",
    href: "/data-retention",
    fullUrl: "https://voiceshield.logicintelligencetechnologies.in/data-retention",
    description: "Zero-retention defaults & forensic audit trail controls",
    icon: Database,
  },
  {
    title: "Telephony & Recording Consent",
    href: "/telephony-consent",
    fullUrl: "https://voiceshield.logicintelligencetechnologies.in/telephony-consent",
    description: "Multi-party recording disclosures & carrier compliance",
    icon: PhoneCall,
  },
  {
    title: "Vulnerability Disclosure",
    href: "/responsible-disclosure",
    fullUrl: "https://voiceshield.logicintelligencetechnologies.in/responsible-disclosure",
    description: "ISO/IEC 29147 coordinated security bug reporting",
    icon: ShieldAlert,
  },
  {
    title: "Accessibility Statement",
    href: "/accessibility",
    fullUrl: "https://voiceshield.logicintelligencetechnologies.in/accessibility",
    description: "WCAG 2.1 Level AA conformance & screen-reader support",
    icon: Eye,
  },
  {
    title: "Copyright & DMCA Agent",
    href: "/copyright",
    fullUrl: "https://voiceshield.logicintelligencetechnologies.in/copyright",
    description: "Designated DMCA agent & intellectual property claims",
    icon: FileCode2,
  },
];

export function PublicFooter() {
  return (
    <footer className="bg-white border-t border-[#DFE7EF] pt-14 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Trust Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TRUST & LEGAL REPOSITORY</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B2545] to-[#1565C0] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#45D9D2]" />
            </div>
            <span className="font-bold text-xl sm:text-2xl text-[#0B2545] tracking-tight">
              VoiceShield
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] rounded border border-[#BBDEFB] uppercase">
              AI SOC
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#52677C] leading-relaxed max-w-2xl mx-auto">
            VoiceShield by <strong className="text-[#0B2545] font-semibold">Logic Intelligence Technologies</strong> delivers
            enterprise voice fraud mitigation, synthetic voice detection, and Section 65B admissible forensic auditing.
            Review our published legal agreements, regulatory disclosures, and operating policies below.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[#F7F9FC] text-[#065F46] border border-[#A7F3D0]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              WCAG 2.1 AA Target
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[#F7F9FC] text-[#0B2545] border border-[#CBD5E1]">
              <Lock className="w-3.5 h-3.5 text-[#1565C0]" />
              Encrypted Telephony Pipeline
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[#F7F9FC] text-[#0B2545] border border-[#CBD5E1]">
              <FileCheck2 className="w-3.5 h-3.5 text-[#1565C0]" />
              Section 65B Admissible
            </span>
          </div>
        </div>

        {/* 
          10 Trust & Legal Buttons in Equal 2-Column Grid:
          Button 1 and Button 2 are horizontal.
          Button 3 is bottom of Button 1; Button 4 is bottom of Button 2, and so forth.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 max-w-4xl mx-auto">
          {TRUST_LEGAL_BUTTONS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white hover:bg-[#F0F7FF] border border-[#DFE7EF] hover:border-[#1565C0] shadow-xs hover:shadow-sm transition-all duration-200 min-h-[72px]\ text-left"
                title={item.title}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#E7F3FF] group-hover:bg-[#1565C0] text-[#1565C0] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-[#1565C0] opacity-80">
                        0{index + 1}
                      </span>
                      <span className="text-sm font-bold text-[#0B2545] group-hover:text-[#1565C0] transition-colors truncate">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#52677C] font-normal truncate mt-0.5">
                      {item.description}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1565C0] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#DFE7EF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#52677C]">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Logic Intelligence Technologies. All rights reserved.
            VoiceShield™ is an enterprise voice fraud mitigation platform.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/status"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#065F46] hover:text-[#047857] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Operational · Live v2.4</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
