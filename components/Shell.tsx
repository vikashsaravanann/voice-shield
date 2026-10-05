"use client";

import React, { useState, useEffect } from "react";
import { BackendHealth } from "@/components/BackendHealth";
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
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  if (pathname === "/login") return <>{children}</>;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="relative z-10 min-h-screen w-full flex flex-col text-slate-100 selection:bg-brand-400 selection:text-slate-950 font-sans overflow-x-hidden">
      <a href="#main-content" className="skip-link">Skip to content</a>

      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="VoiceShield home">
            <span className="w-9 h-9 rounded-full border border-brand-400/50 overflow-hidden bg-slate-950 shrink-0 group-hover:border-brand-300 transition-colors">
              <img src="/logo.png" alt="VoiceShield logo" className="w-full h-full object-cover rounded-full" />
            </span>
            <span className="text-[15px] sm:text-base font-bold tracking-[0.14em] text-white uppercase">VOICESHIELD</span>
            <span className="hidden min-[400px]:inline-block px-1.5 py-0.5 rounded border border-slate-700 text-[10px] font-semibold tracking-widest text-slate-300 uppercase">
              LIT
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden min-[1280px]:flex min-w-0 items-center gap-0.5">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex items-center px-2.5 py-2 rounded-md text-xs font-semibold tracking-[0.05em] uppercase whitespace-nowrap transition-colors ${
                    active ? "text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {item.label}
                  {active && <span aria-hidden className="absolute inset-x-2.5 -bottom-[13px] h-[2px] rounded bg-brand-400" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden 2xl:block">
              <BackendHealth compact />
            </div>
            <Link href="/login" className="btn btn-primary btn-sm" aria-label="Sign in">
              <Lock aria-hidden className="w-3.5 h-3.5" />
              <span aria-hidden className="hidden min-[400px]:inline">SIGN IN</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="min-[1280px]:hidden btn btn-ghost btn-icon btn-sm"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? <X aria-hidden className="w-5 h-5" /> : <Menu aria-hidden className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="min-[1280px]:hidden fixed inset-x-0 top-14 sm:top-16 bottom-0 z-40 bg-slate-950/98 backdrop-blur-2xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] overflow-y-auto overscroll-contain animate-fadeIn"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-2 max-w-md mx-auto pt-2">
            <div className="px-1 py-2 text-[11px] font-semibold tracking-widest text-slate-500 uppercase">Navigation</div>
            {NAV.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between min-h-[48px] px-3.5 rounded-xl border text-sm font-semibold tracking-wide uppercase transition-colors ${
                    active
                      ? "bg-slate-900 text-white border-brand-400/50"
                      : "bg-slate-900/50 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon aria-hidden className={`w-4 h-4 ${active ? "text-brand-400" : "text-slate-500"}`} />
                    {item.label}
                  </span>
                  <ChevronRight aria-hidden className="w-4 h-4 text-slate-600" />
                </Link>
              );
            })}

            <div className="pt-5 mt-3 border-t border-slate-800 space-y-3">
              <div><BackendHealth compact /></div>
              <a href={LIT_HOME} className="btn btn-ghost w-full">LOGIC INTELLIGENCE TECHNOLOGIES</a>
              <a href={LIT_REQUEST} className="btn btn-secondary w-full">REQUEST ACCESS</a>
              <div className="flex items-center justify-center gap-3 pt-1 text-xs text-slate-400 uppercase tracking-wider">
                <Link href="/privacy" className="py-2 hover:text-brand-300">PRIVACY POLICY</Link>
                <span aria-hidden>·</span>
                <Link href="/terms" className="py-2 hover:text-brand-300">TERMS OF SERVICE</Link>
              </div>
              <Link href="/login" className="btn btn-primary w-full">
                <Lock aria-hidden className="w-4 h-4" />
                OPERATOR SIGN IN
              </Link>
            </div>
          </nav>
        </div>
      )}

      <main id="main-content" className="flex-1 w-full overflow-x-hidden">{children}</main>

      <footer className="w-full border-t border-slate-800 bg-slate-950/80 pt-14 pb-10 px-4 sm:px-6 lg:px-12 text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-3" aria-label="VoiceShield home">
                <span className="w-10 h-10 rounded-full border border-brand-400/40 overflow-hidden bg-slate-950 shrink-0">
                  <img src="/logo.png" alt="VoiceShield logo" className="w-full h-full object-cover rounded-full" />
                </span>
                <span className="text-xl font-bold tracking-[0.14em] text-white uppercase">VOICESHIELD</span>
              </Link>
              <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
                VoiceShield — an AI security product by Logic Intelligence Technologies. Low-latency voice risk signals and structured evidence for
                enterprise workflows.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-widest">
                <span className="status status-normal">LOW-LATENCY PATH</span>
                <span className="status status-normal">DPDP-AWARE DESIGN</span>
                <a href={LIT_REQUEST} className="status status-processing hover:brightness-125">REQUEST ACCESS</a>
              </div>
            </div>

            <FooterCol title="CORE MODULES">
              <FLink href="/">OVERVIEW</FLink>
              <FLink href="/demo">LIVE DEMO</FLink>
              <FLink href="/dashboard">SOC DASHBOARD</FLink>
              <FLink href="/architecture">ARCHITECTURE</FLink>
            </FooterCol>
            <FooterCol title="DOCUMENTATION">
              <FLink href="/docs">DEVELOPER API</FLink>
              <FLink href="/brief">PRODUCT BRIEF</FLink>
              <FLink href="/sandbox">FORENSIC LAB</FLink>
            </FooterCol>
            <FooterCol title="COMPANY">
              <FLink href="/about">ABOUT</FLink>
              <FLink href={LIT_HOME} external>LIT HOME</FLink>
              <FLink href={`${LIT_HOME}/voice-shield`} external>PRODUCT OVERVIEW</FLink>
              <FLink href={LIT_REQUEST} external>REQUEST ACCESS</FLink>
              <FLink href="/privacy">PRIVACY</FLink>
              <FLink href="/terms">TERMS</FLink>
            </FooterCol>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 uppercase tracking-wider">
            <span>VoiceShield — a Logic Intelligence Technologies product</span>
            <span>© {new Date().getFullYear()} LIT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-white uppercase tracking-[0.16em] mb-3">{title}</h3>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function FLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  const cls = "flex items-center min-h-[40px] text-[13px] font-medium tracking-wide text-slate-400 hover:text-brand-300 transition-colors";
  return (
    <li>
      {external ? (
        <a href={href} className={cls}>{children}</a>
      ) : (
        <Link href={href} className={cls}>{children}</Link>
      )}
    </li>
  );
}
