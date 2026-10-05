"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Radio,
  LayoutDashboard,
  Cpu,
  BookOpen,
  FileCheck2,
  Lock,
  Menu,
  X,
  ChevronRight,
  Layers,
} from "lucide-react";

const LIT_HOME = "https://www.logicintelligencetechnologies.in";
const LIT_REQUEST =
  "https://www.logicintelligencetechnologies.in/voice-shield/request";

const NAV = [
  { href: "/", label: "OVERVIEW", icon: Activity },
  { href: "/demo", label: "LIVE DEMO", icon: Radio },
  { href: "/sandbox", label: "FORENSIC LAB", icon: Layers },
  { href: "/dashboard", label: "SOC DASHBOARD", icon: LayoutDashboard },
  { href: "/architecture", label: "ARCHITECTURE", icon: Cpu },
  { href: "/docs", label: "DOCS", icon: BookOpen },
  { href: "/brief", label: "PRODUCT BRIEF", icon: FileCheck2 },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0D1B3E] text-slate-100 selection:bg-[#45D9D2] selection:text-[#0D1B3E] font-sans overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0D1B3E]/90 border-b border-[#1E3A70] shadow-2xl transition-all duration-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0 whitespace-nowrap">
            <div className="relative shrink-0">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-[#45D9D2]/60 flex items-center justify-center shadow-lg shadow-[#45D9D2]/20 group-hover:border-[#45D9D2] group-hover:shadow-[#45D9D2]/30 transition-all duration-300 group-hover:scale-105 overflow-hidden bg-[#0D1B3E] ring-1 ring-[#45D9D2]/20 ring-offset-1 ring-offset-[#0D1B3E]">
                <img src="/logo.png" alt="VoiceShield Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#45D9D2] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[#45D9D2]" />
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <span className="text-xs sm:text-base font-black tracking-[0.12em] text-white uppercase group-hover:text-[#45D9D2] transition-colors whitespace-nowrap">
                VOICESHIELD
              </span>
              <span className="px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold tracking-widest bg-[#10214B] text-[#45D9D2] border border-[#45D9D2]/30 uppercase whitespace-nowrap hidden min-[360px]:inline-block">
                LIT
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-[#10214B]/70 p-1 rounded-xl border border-[#1E3A70] backdrop-blur-md whitespace-nowrap flex-nowrap shrink-0">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    inline-flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold tracking-[0.05em] xl:tracking-[0.1em] uppercase transition-all duration-200 whitespace-nowrap shrink-0
                    ${active
                      ? "bg-[#45D9D2]/15 text-[#45D9D2] border border-[#45D9D2]/40 shadow-sm shadow-[#45D9D2]/20"
                      : "text-slate-400 hover:text-white hover:bg-[#162B5E]/60 border border-transparent"
                    }
                  `}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-[#45D9D2]" : "text-slate-500"}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap">
            <a
              href={LIT_HOME}
              className="hidden md:inline-flex items-center px-2 py-1 rounded-lg border border-[#1E3A70] text-[10px] font-mono text-slate-400 hover:text-[#45D9D2] hover:border-[#45D9D2]/40 uppercase tracking-wider"
            >
              Company
            </a>

            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#10214B] border border-[#1E3A70] text-[10px] font-mono text-slate-300 whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#45D9D2] animate-pulse shrink-0" />
              <span className="text-[#45D9D2] font-bold uppercase whitespace-nowrap">LIVE</span>
            </div>

            <Link
              href="/login"
              className="
                inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl
                bg-gradient-to-r from-[#45D9D2] to-[#0894DE] hover:from-[#60E0DA] hover:to-[#2BC5BD]
                text-[#0D1B3E] font-mono font-bold text-[10px] sm:text-xs tracking-wider uppercase
                transition-all duration-200 shadow-md shadow-[#45D9D2]/20 active:scale-95 whitespace-nowrap shrink-0
              "
            >
              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5] shrink-0" />
              <span className="whitespace-nowrap">SIGN IN</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#10214B] border border-[#1E3A70] text-slate-300 hover:text-white hover:border-[#45D9D2]/40 transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
            </button>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#45D9D2]/30 to-transparent" />
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-[#0D1B3E]/98 backdrop-blur-2xl border-b border-[#1E3A70] p-4 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2 max-w-md mx-auto pt-2">
            <div className="px-3 py-2 text-[10px] font-mono font-semibold tracking-widest text-slate-500 uppercase">
              NAVIGATION MODULES
            </div>

            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center justify-between p-3.5 rounded-xl border text-xs font-mono font-bold tracking-widest uppercase transition-all
                    ${active
                      ? "bg-[#10214B] text-[#45D9D2] border-[#45D9D2]/50 shadow-lg shadow-[#45D9D2]/10"
                      : "bg-[#10214B]/60 text-slate-300 border-[#1E3A70] hover:border-[#45D9D2]/30 hover:bg-[#162B5E]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${active ? "bg-[#45D9D2]/20 border-[#45D9D2]/40 text-[#45D9D2]" : "bg-[#162B5E] border-[#1E3A70] text-slate-400"}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${active ? "text-[#45D9D2]" : "text-slate-600"}`} />
                </Link>
              );
            })}

            <div className="pt-6 mt-4 border-t border-[#1E3A70] space-y-3">
              <a
                href={LIT_HOME}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-[#1E3A70] text-slate-300 font-mono font-bold text-xs tracking-widest uppercase hover:border-[#45D9D2]/40 hover:text-[#45D9D2]"
              >
                LOGIC INTELLIGENCE TECHNOLOGIES
              </a>
              <a
                href={LIT_REQUEST}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-[#45D9D2]/30 text-[#45D9D2] font-mono font-bold text-xs tracking-widest uppercase"
              >
                REQUEST ACCESS
              </a>
              <div className="flex items-center justify-center gap-3 pt-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="block py-2 md:py-0 hover:text-[#45D9D2] transition-colors">
                  PRIVACY POLICY
                </Link>
                <span>·</span>
                <Link href="/terms" onClick={() => setMobileMenuOpen(false)} className="block py-2 md:py-0 hover:text-[#45D9D2] transition-colors">
                  TERMS OF SERVICE
                </Link>
              </div>

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-[#45D9D2] to-[#0894DE] text-[#0D1B3E] font-mono font-bold text-xs tracking-widest uppercase shadow-lg shadow-[#45D9D2]/20 whitespace-nowrap"
              >
                <Lock className="w-4 h-4 shrink-0" />
                <span>OPERATOR SIGN IN</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      <footer className="relative w-full border-t border-[#1E3A70] bg-[#0D1B3E] pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12 text-slate-400 font-sans overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#45D9D2]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center w-full max-w-3xl mx-auto space-y-4">
            <Link href="/" className="inline-flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full border border-[#45D9D2]/40 flex items-center justify-center shadow-lg shadow-[#45D9D2]/10 group-hover:border-[#45D9D2] group-hover:shadow-[#45D9D2]/20 transition-all bg-[#0D1B3E] shrink-0 p-0.5">
                <img src="/logo.png" alt="VoiceShield Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-[0.15em] text-white group-hover:text-[#45D9D2] transition-colors uppercase">
                VOICESHIELD
              </span>
            </Link>

            <p className="text-[13px] sm:text-sm text-slate-300 leading-relaxed font-medium">
              VoiceShield — an AI voice security product by Logic Intelligence Technologies.
              Low-latency voice risk signals and structured evidence for enterprise workflows.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] font-bold uppercase tracking-widest">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#10214B] border border-[#45D9D2]/20 text-[#45D9D2] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#45D9D2] animate-pulse" />
                LOW-LATENCY PATH
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#10214B] border border-[#1E3A70] text-slate-300">
                DPDP-AWARE DESIGN
              </span>
              <a
                href={LIT_REQUEST}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#45D9D2]/10 border border-[#45D9D2]/30 text-[#45D9D2] hover:bg-[#45D9D2]/20"
              >
                REQUEST ACCESS
              </a>
            </div>
          </div>

          <div className="w-full max-w-6xl mx-auto h-[1px] bg-[#1E3A70]" />

          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-center gap-12 lg:gap-32 pt-6">
            <div className="flex flex-col min-w-[200px]">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest border-l-[3px] border-[#45D9D2] pl-4 py-1 mb-4 leading-none">
                CORE MODULES
              </h3>
              <ul className="space-y-2 font-mono text-xs text-slate-400/90 font-medium tracking-wide">
                {["/", "/demo", "/dashboard", "/architecture"].map((href, i) => {
                  const labels = ["OVERVIEW", "LIVE DEMO", "SOC DASHBOARD", "ARCHITECTURE"];
                  return (
                    <li key={href}>
                      <Link href={href} className="group flex items-center px-3 py-2.5 -mx-3 rounded-lg hover:bg-[#10214B] border border-transparent hover:border-[#1E3A70] transition-all duration-300">
                        <span className="text-slate-600/80 w-5 group-hover:text-[#45D9D2] transition-colors text-sm font-bold">+</span>
                        <span className="group-hover:text-[#45D9D2] group-hover:translate-x-1 transition-transform duration-300">{labels[i]}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col min-w-[200px]">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest border-l-[3px] border-[#45D9D2] pl-4 py-1 mb-4 leading-none">
                DOCUMENTATION
              </h3>
              <ul className="space-y-2 font-mono text-xs text-slate-400/90 font-medium tracking-wide">
                <li>
                  <Link href="/docs" className="group flex items-center px-3 py-2.5 -mx-3 rounded-lg hover:bg-[#10214B] border border-transparent hover:border-[#1E3A70] transition-all duration-300">
                    <span className="text-slate-600/80 w-5 group-hover:text-[#45D9D2] text-sm font-bold">+</span>
                    <span className="group-hover:text-[#45D9D2] group-hover:translate-x-1 transition-transform duration-300">DEVELOPER API</span>
                  </Link>
                </li>
                <li>
                  <Link href="/brief" className="group flex items-center px-3 py-2.5 -mx-3 rounded-lg hover:bg-[#10214B] border border-transparent hover:border-[#1E3A70] transition-all duration-300">
                    <span className="text-slate-600/80 w-5 group-hover:text-[#45D9D2] text-sm font-bold">+</span>
                    <span className="group-hover:text-[#45D9D2] group-hover:translate-x-1 transition-transform duration-300">PRODUCT BRIEF</span>
                  </Link>
                </li>
                <li>
                  <Link href="/sandbox" className="group flex items-center px-3 py-2.5 -mx-3 rounded-lg hover:bg-[#10214B] border border-transparent hover:border-[#1E3A70] transition-all duration-300">
                    <span className="text-slate-600/80 w-5 group-hover:text-[#45D9D2] text-sm font-bold">+</span>
                    <span className="group-hover:text-[#45D9D2] group-hover:translate-x-1 transition-transform duration-300">FORENSIC LAB</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col min-w-[200px]">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest border-l-[3px] border-[#45D9D2] pl-4 py-1 mb-4 leading-none">
                COMPANY
              </h3>
              <ul className="space-y-2 font-mono text-xs text-slate-400/90 font-medium tracking-wide">
                <li>
                  <a href={LIT_HOME} className="group flex items-center px-3 py-2.5 -mx-3 rounded-lg hover:bg-[#10214B] border border-transparent hover:border-[#1E3A70] transition-all duration-300">
                    <span className="text-slate-600/80 w-5 group-hover:text-[#45D9D2] text-sm font-bold">+</span>
                    <span className="group-hover:text-[#45D9D2] group-hover:translate-x-1 transition-transform duration-300">LIT HOME</span>
                  </a>
                </li>
                <li>
                  <a href={`${LIT_HOME}/voice-shield`} className="group flex items-center px-3 py-2.5 -mx-3 rounded-lg hover:bg-[#10214B] border border-transparent hover:border-[#1E3A70] transition-all duration-300">
                    <span className="text-slate-600/80 w-5 group-hover:text-[#45D9D2] text-sm font-bold">+</span>
                    <span className="group-hover:text-[#45D9D2] group-hover:translate-x-1 transition-transform duration-300">PRODUCT OVERVIEW</span>
                  </a>
                </li>
                <li>
                  <a href={LIT_REQUEST} className="group flex items-center px-3 py-2.5 -mx-3 rounded-lg hover:bg-[#10214B] border border-transparent hover:border-[#1E3A70] transition-all duration-300">
                    <span className="text-slate-600/80 w-5 group-hover:text-[#45D9D2] text-sm font-bold">+</span>
                    <span className="group-hover:text-[#45D9D2] group-hover:translate-x-1 transition-transform duration-300">REQUEST ACCESS</span>
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="group flex items-center px-3 py-2.5 -mx-3 rounded-lg hover:bg-[#10214B] border border-transparent hover:border-[#1E3A70] transition-all duration-300">
                    <span className="text-slate-600/80 w-5 group-hover:text-[#45D9D2] text-sm font-bold">+</span>
                    <span className="group-hover:text-[#45D9D2] group-hover:translate-x-1 transition-transform duration-300">PRIVACY</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="group flex items-center px-3 py-2.5 -mx-3 rounded-lg hover:bg-[#10214B] border border-transparent hover:border-[#1E3A70] transition-all duration-300">
                    <span className="text-slate-600/80 w-5 group-hover:text-[#45D9D2] text-sm font-bold">+</span>
                    <span className="group-hover:text-[#45D9D2] group-hover:translate-x-1 transition-transform duration-300">TERMS</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full max-w-6xl mx-auto pt-8 border-t border-[#1E3A70] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            <span>VoiceShield — a Logic Intelligence Technologies product</span>
            <span>© {new Date().getFullYear()} LIT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
