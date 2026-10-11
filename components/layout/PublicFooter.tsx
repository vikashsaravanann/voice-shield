"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  CheckCircle2,
  ExternalLink,
  Cpu,
} from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-[#0B2545] text-white border-t border-[#18354F] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#18354F]">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1565C0] flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-6 h-6 text-[#45D9D2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-white">
                  VoiceShield
                </span>
                <span className="text-xs text-[#45D9D2] font-semibold tracking-wide">
                  AI Voice Fraud Prevention & Security
                </span>
              </div>
            </div>
            <p className="text-sm text-[#CBD5E1] max-w-sm leading-relaxed">
              VoiceShield by Logic Intelligence Technologies delivers real-time synthetic voice
              detection, neural spoofing mitigation, and Section 65B forensic chain-of-custody
              auditing for contact centers, financial networks, and enterprise communications.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#18354F] text-[#45D9D2] border border-[#20496E]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                WCAG 2.1 AA Target
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#18354F] text-[#CBD5E1] border border-[#20496E]">
                <Lock className="w-3.5 h-3.5" />
                Encrypted Audio Pipeline
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#18354F] text-[#CBD5E1] border border-[#20496E]">
                <FileCheck2 className="w-3.5 h-3.5" />
                Section 65B Admissible
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#45D9D2] mb-4">
              Product
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/features" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Core Features
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[#CBD5E1] hover:text-white transition-colors">
                  How Detection Works
                </Link>
              </li>
              <li>
                <Link href="/use-cases" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Enterprise Use Cases
                </Link>
              </li>
              <li>
                <Link href="/threat-intel" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Threat Intelligence
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Industry Solutions
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Integrations & Telephony
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Pricing & Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Technical */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#45D9D2] mb-4">
              Resources & Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/docs" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="text-[#CBD5E1] hover:text-white transition-colors">
                  System Architecture
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-[#CBD5E1] hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Interactive Demo</span>
                  <span className="text-[9px] bg-[#FFF4D9] text-[#8D6E00] px-1 py-0.2 rounded font-bold">SIM</span>
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Incident Reporting
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Security & Trust
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-[#CBD5E1] hover:text-white transition-colors">
                  System Status
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Changelog & Models
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#45D9D2] mb-4">
              Trust & Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/acceptable-use" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Acceptable Use
                </Link>
              </li>
              <li>
                <Link href="/ai-limitations" className="text-[#CBD5E1] hover:text-white transition-colors">
                  AI & Model Limitations
                </Link>
              </li>
              <li>
                <Link href="/data-retention" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Data & Retention Controls
                </Link>
              </li>
              <li>
                <Link href="/telephony-consent" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Telephony & Recording Consent
                </Link>
              </li>
              <li>
                <Link href="/responsible-disclosure" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Vulnerability Disclosure
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link href="/copyright" className="text-[#CBD5E1] hover:text-white transition-colors">
                  Copyright & DMCA Agent
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>
            &copy; {new Date().getFullYear()} Logic Intelligence Technologies. All rights reserved.
            VoiceShield™ is an enterprise voice fraud mitigation platform.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white transition-colors">
              About LIT
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="/compliance" className="hover:text-white transition-colors">
              Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
