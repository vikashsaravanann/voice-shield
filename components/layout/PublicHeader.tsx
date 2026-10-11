"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Lock,
  ArrowUpRight,
  Radio,
  FileCheck2,
  ChevronRight,
} from "lucide-react";

const PRIMARY_NAV = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/architecture", label: "Architecture" },
  { href: "/docs", label: "Docs" },
  { href: "/demo", label: "Live Demo", badge: "Simulated" },
  { href: "/pricing", label: "Pricing" },
];

export const MORE_NAV_GROUPS = [
  {
    id: "platform",
    title: "Core Platform",
    items: [
      { href: "/", label: "Overview", desc: "AI voice biometrics & fraud shield" },
      { href: "/features", label: "Features", desc: "Multi-signal spoof detection" },
      { href: "/how-it-works", label: "How It Works", desc: "Signal extraction & DSP pipeline" },
      { href: "/architecture", label: "Architecture", desc: "333ms inference & SIP topology" },
      { href: "/demo", label: "Live Demo", desc: "In-browser live microphone test" },
      { href: "/pricing", label: "Pricing & Plans", desc: "Enterprise licensing & volume tiers" },
      { href: "/threat-intel", label: "Threat Intelligence", desc: "Global synthetic voice telemetry" },
    ],
  },
  {
    id: "solutions",
    title: "Solutions & Telecom",
    items: [
      { href: "/industries", label: "Financial & Banking", desc: "High-risk wire verification" },
      { href: "/industries#contact-centers", label: "Contact Centers", desc: "IVR & agent call protection" },
      { href: "/integrations", label: "Telephony Forks", desc: "SBC, SIPREC & carrier media forks" },
      { href: "/benefits", label: "Enterprise Benefits", desc: "Operational ROI & risk reduction" },
      { href: "/status", label: "Telephony Liveness", desc: "Global carrier & cluster health" },
      { href: "/report", label: "Incident Report", desc: "Report voice impersonation attack" },
      { href: "/sandbox", label: "Sandbox Simulator", desc: "Interactive synthetic voice tester" },
    ],
  },
  {
    id: "dev",
    title: "Docs & Engineering",
    items: [
      { href: "/docs", label: "Documentation Hub", desc: "Developer guides & SDK references" },
      { href: "/docs#api", label: "REST & Streaming API", desc: "Real-time audio streaming endpoints" },
      { href: "/compliance", label: "Section 65B Audit", desc: "Forensic evidence admissibility" },
      { href: "/how-it-works#math", label: "DSP & Math Specs", desc: "Spectral analysis & formants" },
      { href: "/security", label: "Security & SOC 2", desc: "Encryption & key lifecycle" },
      { href: "/changelog", label: "System Changelog", desc: "Release history & version notes" },
    ],
  },
  {
    id: "company",
    title: "Company & Connect",
    items: [
      { href: "/about", label: "About VoiceShield", desc: "Mission, engineering & background" },
      { href: "/brief", label: "Research Brief", desc: "Executive whitepaper & findings" },
      { href: "/contact", label: "Enterprise Sales", desc: "Direct consultation & deployments" },
      { href: "/faq", label: "Frequently Asked", desc: "Common technical & legal answers" },
      { href: "/onboarding", label: "Operator Onboarding", desc: "SOC operator initial setup flow" },
    ],
  },
  {
    id: "trust",
    title: "Trust & Legal",
    items: [
      { href: "/privacy", label: "Privacy Policy", desc: "Audio privacy & customer safeguards" },
      { href: "/terms", label: "Terms of Service", desc: "Enterprise carrier agreements & SLA" },
      { href: "/cookie-policy", label: "Cookie Policy", desc: "Essential session state & tokens" },
      { href: "/acceptable-use", label: "Acceptable Use", desc: "Defensive protection & anti-abuse" },
      { href: "/ai-limitations", label: "AI & Model Limits", desc: "Probabilistic model boundaries" },
      { href: "/data-retention", label: "Data & Retention", desc: "Zero-retention & customer controls" },
      { href: "/telephony-consent", label: "Telephony Consent", desc: "Multi-party recording disclosures" },
      { href: "/responsible-disclosure", label: "Vulnerability Policy", desc: "ISO/IEC 29147 coordinated intake" },
      { href: "/accessibility", label: "Accessibility", desc: "WCAG 2.1 AA conformance" },
      { href: "/copyright", label: "Copyright & DMCA", desc: "Designated DMCA agent details" },
    ],
  },
  {
    id: "workspace",
    title: "Workspace & Identity",
    items: [
      { href: "/login", label: "Operator Sign In", desc: "Secure identity authentication" },
      { href: "/signup", label: "Request SOC Access", desc: "New enterprise tenant credentials" },
      { href: "/forgot-password", label: "Account Recovery", desc: "Reset operator credentials" },
      { href: "/app", label: "Enterprise SOC Console", desc: "Live multi-trunk fraud console" },
      { href: "/app/detection", label: "Live Detection", desc: "Real-time acoustic neural scoring" },
      { href: "/app/forensics", label: "Forensic Evidence", desc: "Section 65B signed hash bundles" },
      { href: "/app/telephony", label: "SIP Trunk Manager", desc: "SBC credentials & media streams" },
    ],
  },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileGroupOpen, setMobileGroupOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setMoreOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [moreOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Top 2px company-signature gradient accent line matching logicintelligencetechnologies */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1565C0] via-[#1FA9A2] to-[#45D9D2] z-[60]"/>

      <header
        className={`sticky top-0 z-50 transition-all duration-200 border-b ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-[#E2E8F0] shadow-[0_4px_20px_rgba(15,23,42,0.06)] py-1.5"
            : "bg-white/90 backdrop-blur-sm border-[#E2E8F0] py-2"
        }`}
      >
        <div className="mx-auto w-full max-w-[1680px] px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between gap-2 lg:gap-3 w-full h-12 sm:h-14 flex-nowrap">
            
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565C0] rounded-lg p-1 -ml-1"
              aria-label="VoiceShield Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B2545] to-[#1565C0] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#45D9D2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base sm:text-lg text-[#0B2545] tracking-tight whitespace-nowrap">
                    VoiceShield
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#E7F3FF] text-[#1565C0] rounded border border-[#BBDEFB] whitespace-nowrap uppercase">
                    AI SOC
                  </span>
                </div>
                <span className="text-[10px] text-[#52677C] font-semibold tracking-wider whitespace-nowrap uppercase hidden sm:inline">
                  Logic Intelligence Technologies
                </span>
              </div>
            </Link>

            {/* Desktop Primary Nav Bar */}
            <nav
              aria-label="Primary Navigation"
              className="hidden xl:flex items-center justify-center gap-0.5 2xl:gap-1 min-w-0 shrink"
            >
              {PRIMARY_NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center h-8 px-2.5 text-[11px] font-semibold tracking-[0.03em] whitespace-nowrap rounded-md transition-colors relative ${
                      active
                        ? "text-[#1565C0] font-bold bg-[#E7F3FF]"
                        : "text-[#52677C] hover:text-[#0B2545] hover:bg-[#F7F9FC]"
                    }`}
                  >
                    <span>{item.label.toUpperCase()}</span>
                    {item.badge && (
                      <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider bg-[#FFF4D9] text-[#8D6E00] px-1.5 py-0.2 rounded border border-[#FFE082] whitespace-nowrap">
                        {item.badge}
                      </span>
                    )}
                    {active && (
                      <span className="absolute left-2.5 right-2.5 bottom-0 h-[2px] rounded-full bg-[#1565C0]"/>
                    )}
                  </Link>
                );
              })}

              {/* MORE Menu Button (Mega Menu) */}
              <div ref={moreRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  aria-controls="more-mega-menu"
                  className={`inline-flex items-center h-8 px-2.5 text-[11px] font-bold tracking-[0.03em] whitespace-nowrap rounded-md transition-colors ${
                    moreOpen
                      ? "text-[#1565C0] bg-[#E7F3FF]"
                      : "text-[#52677C] hover:text-[#0B2545] hover:bg-[#F7F9FC]"
                  }`}
                >
                  <span>MORE</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${
                      moreOpen ? "rotate-180 text-[#1565C0]" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Mega Menu */}
                {moreOpen && (
                  <div className="fixed inset-x-0 top-[56px] sm:top-[64px] flex justify-center px-4 lg:px-6 pt-2 z-50 pointer-events-auto">
                    <div
                      id="more-mega-menu"
                      aria-label="All VoiceShield Pages"
                      className="w-full max-w-[1400px] max-h-[calc(100dvh-84px)] overflow-y-auto overscroll-contain rounded-2xl border border-[#DFE7EF] bg-white/98 backdrop-blur-2xl shadow-[0_20px_50px_rgba(15,23,42,0.14)] p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-5 gap-y-6 animate-in fade-in zoom-in-95 duration-150"
                    >
                      {MORE_NAV_GROUPS.map((group) => (
                        <div key={group.id} className="min-w-0">
                          <p className="px-2 mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1565C0] flex items-center gap-1.5 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0]" />
                            {group.title}
                          </p>
                          <ul className="space-y-1">
                            {group.items.map((item) => {
                              const active = pathname === item.href;
                              return (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    onClick={() => setMoreOpen(false)}
                                    aria-current={active ? "page" : undefined}
                                    className={`flex flex-col rounded-lg px-2.5 py-1.5 text-[11px] font-semibold tracking-wide uppercase transition-all ${
                                      active
                                        ? "bg-[#E7F3FF] text-[#1565C0] font-bold border border-[#BBDEFB]"
                                        : "text-[#52677C] hover:bg-[#F7F9FC] hover:text-[#0B2545]"
                                    }`}
                                  >
                                    <span className="whitespace-nowrap truncate">{item.label}</span>
                                    {item.desc && (
                                      <span className="text-[9.5px] text-[#64748B] tracking-normal lowercase font-normal truncate mt-0.5">
                                        {item.desc}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Side Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              <Link
                href="/status"
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#065F46] bg-[#E7F7EF] rounded-full border border-[#A7F3D0] hover:bg-[#D4EDDA] transition-colors whitespace-nowrap"
                title="System Operations & Telephony Liveness"
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>Live v2.4</span>
              </Link>

              <Link
                href="/login"
                className="hidden sm:inline-flex h-8 px-3.5 items-center rounded-lg text-xs font-bold uppercase tracking-wider text-[#0B2545] hover:text-[#1565C0] bg-white border border-[#DFE7EF] hover:border-[#1565C0] transition-all whitespace-nowrap shadow-xs"
              >
                Sign In
              </Link>

              <Link
                href="/app"
                className="inline-flex h-8 px-3.5 items-center gap-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#0B2545] hover:bg-[#1565C0] transition-all whitespace-nowrap shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-[#45D9D2]" />
                <span>Launch Workspace</span>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#0B2545] hover:bg-[#F7F9FC] border border-[#DFE7EF] transition-colors"
                aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden fixed inset-x-0 top-[56px] sm:top-[64px] bottom-0 bg-white/98 backdrop-blur-xl border-t border-[#DFE7EF] overflow-y-auto p-4 sm:p-6 z-40">
            <div className="space-y-4 max-w-lg mx-auto pb-12">
              
              <div className="flex items-center justify-between pb-2 border-b border-[#DFE7EF]">
                <Link
                  href="/status"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#065F46] bg-[#E7F7EF] rounded-full border border-[#A7F3D0]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>Live v2.4 Status</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold uppercase tracking-wider text-[#1565C0] hover:underline"
                >
                  Sign In
                </Link>
              </div>

              {/* Primary Mobile Links */}
              <div className="grid grid-cols-2 gap-2">
                {PRIMARY_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${
                      isActive(item.href)
                        ? "bg-[#E7F3FF] text-[#1565C0] border-[#BBDEFB]"
                        : "bg-white text-[#0B2545] border-[#DFE7EF] hover:bg-[#F7F9FC]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-[#FFF4D9] text-[#8D6E00] border border-[#FFE082]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Categorized Mega Groups */}
              <div className="pt-2 space-y-2">
                <p className="text-[11px] font-bold text-[#52677C] uppercase tracking-wider px-1">
                  All Platform Pages
                </p>
                {MORE_NAV_GROUPS.map((group) => {
                  const isOpen = mobileGroupOpen === group.id;
                  return (
                    <div key={group.id} className="border border-[#DFE7EF] rounded-xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setMobileGroupOpen(isOpen ? null : group.id)}
                        className="w-full p-3 text-left font-bold text-xs uppercase tracking-wider text-[#0B2545] flex items-center justify-between bg-[#F7F9FC]/60 hover:bg-[#F7F9FC]"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0]" />
                          {group.title}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-[#52677C] transition-transform ${isOpen ? "rotate-90" : ""}`} />
                      </button>
                      {isOpen && (
                        <div className="p-2 space-y-1 bg-white border-t border-[#DFE7EF]">
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block p-2 rounded-lg text-xs font-semibold text-[#0B2545] hover:bg-[#E7F3FF] hover:text-[#1565C0] transition-colors"
                            >
                              <div className="font-bold uppercase tracking-wide">{item.label}</div>
                              {item.desc && <div className="text-[10px] text-[#52677C] font-normal lowercase mt-0.5">{item.desc}</div>}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Workspace CTA Button */}
              <div className="pt-4">
                <Link
                  href="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0B2545] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#1565C0] transition-colors"
                >
                  <Lock className="w-4 h-4 text-[#45D9D2]" />
                  <span>Launch Enterprise SOC Workspace</span>
                </Link>
              </div>

            </div>
          </div>
        )}
      </header>
    </>
  );
}
