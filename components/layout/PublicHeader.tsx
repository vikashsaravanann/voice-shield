"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Lock,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/architecture", label: "Architecture" },
  { href: "/docs", label: "Docs" },
  { href: "/demo", label: "Live Demo", badge: "Simulated" },
  { href: "/pricing", label: "Pricing" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const headerBgClass = scrolled
    ? "sticky top-0 z-50 transition-all duration-200 border-b bg-white/95 backdrop-blur-md border-[#E2E8F0] shadow-sm"
    : "sticky top-0 z-50 transition-all duration-200 border-b bg-white border-[#E2E8F0]";

  return (
    <header className={headerBgClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565C0] rounded-lg p-1 -ml-1"
            aria-label="VoiceShield Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B2545] to-[#1565C0] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6 text-[#45D9D2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl text-[#0B2545] tracking-tight">
                  VoiceShield
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#E7F3FF] text-[#1565C0] rounded border border-[#BBDEFB]">
                  AI SOC
                </span>
              </div>
              <span className="text-[11px] text-[#52677C] font-medium tracking-wide">
                Logic Intelligence Technologies
              </span>
            </div>
          </Link>

          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const linkClass = active
                ? "px-3 py-2 text-sm font-semibold text-[#1565C0] bg-[#E7F3FF]/70 rounded-md transition-colors relative flex items-center gap-1.5"
                : "px-3 py-2 text-sm font-medium text-[#52677C] hover:text-[#0B2545] hover:bg-[#F7F9FC] rounded-md transition-colors relative flex items-center gap-1.5";

              return (
                <Link key={item.href} href={item.href} className={linkClass}>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[#FFF4D9] text-[#8D6E00] px-1.5 py-0.5 rounded border border-[#FFE082]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/status"
              className="hidden md:flex items-center gap-2 px-2.5 py-1 text-xs font-medium text-[#065F46] bg-[#E7F7EF] rounded-full border border-[#A7F3D0] hover:bg-[#D4EDDA] transition-colors"
              title="System Operations & Telephony Liveness"
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Live v2.4</span>
            </Link>

            <Link
              href="/login"
              className="px-3.5 py-2 text-sm font-semibold text-[#0B2545] hover:text-[#1565C0] rounded-lg transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#1565C0] rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              <Lock className="w-3.5 h-3.5 text-[#45D9D2]" />
              <span>Launch Workspace</span>
            </Link>
          </div>

          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/app"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0B2545] rounded-md shadow-sm"
            >
              Workspace
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#52677C] hover:text-[#0B2545] hover:bg-[#F7F9FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565C0]"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="py-2 flex items-center justify-between border-b border-[#F1F5F9] mb-2">
            <Link
              href="/status"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#065F46] bg-[#E7F7EF] px-2.5 py-1 rounded-full border border-[#A7F3D0]"
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>Detection Pipeline: Operational</span>
            </Link>
          </div>

          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const mobileClass = active
              ? "flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold bg-[#E7F3FF] text-[#1565C0]"
              : "flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-[#121826] hover:bg-[#F7F9FC]";

            return (
              <Link key={item.href} href={item.href} className={mobileClass}>
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFF4D9] text-[#8D6E00] px-2 py-0.5 rounded border border-[#FFE082]">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-2 border-t border-[#F1F5F9] grid grid-cols-2 gap-2">
            <Link
              href="/login"
              className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-[#0B2545] bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-center"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-[#0B2545] rounded-lg text-center shadow-sm"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
