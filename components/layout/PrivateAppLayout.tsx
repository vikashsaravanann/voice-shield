"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Activity,
  Radio,
  Layers,
  AlertTriangle,
  History,
  Fingerprint,
  MessageSquare,
  PhoneCall,
  Globe,
  BarChart3,
  FileText,
  Bell,
  Key,
  Webhook,
  Cpu,
  ScrollText,
  Users,
  UserCheck,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

interface NavSection {
  title: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const SECTIONS: NavSection[] = [
  {
    title: "Detection & Monitoring",
    items: [
      { href: "/app", label: "SOC Overview", icon: Activity },
      { href: "/app/detection", label: "Live Console", icon: Radio, badge: "Realtime" },
      { href: "/app/forensics", label: "Forensic Lab", icon: Layers },
      { href: "/app/incidents", label: "Incident Cases", icon: AlertTriangle },
      { href: "/app/sessions", label: "Call Sessions", icon: History },
    ],
  },
  {
    title: "Verification & Telephony",
    items: [
      { href: "/app/voiceprints", label: "Voiceprint Vault", icon: Fingerprint },
      { href: "/app/challenges", label: "Challenge Prompts", icon: MessageSquare },
      { href: "/app/telephony", label: "Telephony & SIP", icon: PhoneCall },
      { href: "/app/threat-map", label: "Threat Map", icon: Globe },
      { href: "/app/analytics", label: "Telemetry & Drift", icon: BarChart3 },
      { href: "/app/reports", label: "Forensic Reports", icon: FileText },
    ],
  },
  {
    title: "Platform & Governance",
    items: [
      { href: "/app/alerts", label: "Alert Policies", icon: Bell },
      { href: "/app/api-keys", label: "API Keys", icon: Key },
      { href: "/app/webhooks", label: "Outbound Webhooks", icon: Webhook },
      { href: "/app/models", label: "Acoustic Models", icon: Cpu },
      { href: "/app/audit-log", label: "Audit Log", icon: ScrollText },
      { href: "/app/organization", label: "Organization", icon: Users },
      { href: "/app/users", label: "Operator Seats", icon: UserCheck },
      { href: "/app/notifications", label: "Notification Feed", icon: ShieldAlert },
      { href: "/app/settings", label: "System Settings", icon: Settings },
      { href: "/app/profile", label: "My Profile", icon: User },
    ],
  },
];

export function PrivateAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>("operator@enterprise.com");

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        }
      } catch (e) {
        // Fallback
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore
    }
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  };

  const sidebarClass = sidebarOpen
    ? "fixed inset-y-0 left-0 z-50 w-72 bg-[#0B2545] text-white flex flex-col border-r border-[#18354F] transition-transform duration-200 translate-x-0"
    : "fixed inset-y-0 left-0 z-50 w-72 bg-[#0B2545] text-white flex flex-col border-r border-[#18354F] transition-transform duration-200 translate-x-0 max-lg:-translate-x-full";

  const pageTitle = pathname
    .replace("/app/", "")
    .replace("/app", "Overview")
    .replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <div className="lg:hidden bg-[#0B2545] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-[#18354F]">
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1565C0] flex items-center justify-center text-white">
            <ShieldCheck className="w-4 h-4 text-[#45D9D2]" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">VoiceShield SOC</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-white hover:bg-[#18354F]"
          aria-label="Toggle Navigation Menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex">
        <aside className={sidebarClass}>
          <div className="p-5 border-b border-[#18354F] flex items-center justify-between">
            <Link href="/app" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#1565C0] flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-[#45D9D2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-white tracking-tight">VoiceShield</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-[#18354F] text-[#45D9D2] px-1.5 py-0.2 rounded border border-[#20496E]">
                    SOC
                  </span>
                </div>
                <span className="text-[11px] text-[#94A3B8] font-medium block">Enterprise Shield v2.4</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[#CBD5E1] hover:text-white"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-5 py-3 border-b border-[#18354F] bg-[#071B33]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94A3B8] font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                Pipeline Active
              </span>
              <Link href="/" className="text-[11px] text-[#45D9D2] hover:underline flex items-center gap-1">
                <span>Public Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-sm">
            {SECTIONS.map((section) => (
              <div key={section.title} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  {section.title}
                </p>
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  const itemClass = active
                    ? "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold bg-[#1565C0] text-white shadow-sm transition-colors"
                    : "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#CBD5E1] hover:bg-[#18354F] hover:text-white transition-colors";

                  return (
                    <Link key={item.href} href={item.href} className={itemClass}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={active ? "w-4 h-4 shrink-0 text-[#45D9D2]" : "w-4 h-4 shrink-0 text-[#94A3B8]"} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E7F3FF]/20 text-[#45D9D2] border border-[#45D9D2]/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-[#18354F] bg-[#071B33]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#1565C0] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : "O"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{userEmail}</p>
                  <p className="text-[10px] text-[#94A3B8] truncate">Security Analyst</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-semibold text-[#CBD5E1] hover:text-white hover:bg-[#18354F] border border-[#20496E] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-[#E2614B]" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            aria-hidden="true"
          />
        )}

        <main className="flex-1 lg:ml-72 flex flex-col min-w-0">
          <header className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-[#52677C]">
              <Link href="/app" className="hover:text-[#0B2545]">VoiceShield SOC</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span className="text-[#0B2545] font-semibold capitalize">
                {pageTitle}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-medium bg-[#E7F7EF] text-[#065F46] rounded-full border border-[#A7F3D0]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>Detection Engine v2.4 Live</span>
              </div>
              <Link
                href="/app/notifications"
                className="p-1.5 rounded-lg text-[#52677C] hover:text-[#0B2545] hover:bg-[#F7F9FC] relative"
                title="Alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E2614B] rounded-full" />
              </Link>
              <Link
                href="/app/settings"
                className="p-1.5 rounded-lg text-[#52677C] hover:text-[#0B2545] hover:bg-[#F7F9FC]"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </header>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
