"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Command,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  keywords?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: "Detection & Monitoring",
    items: [
      { href: "/app", label: "SOC Overview", icon: Activity, keywords: ["dashboard", "metrics", "stats", "overview"] },
      { href: "/app/detection", label: "Live Console", icon: Radio, badge: "Realtime", keywords: ["mic", "audio", "stream", "realtime", "spectrogram"] },
      { href: "/app/forensics", label: "Forensic Lab", icon: Layers, keywords: ["analysis", "sandbox", "spectrum", "evidence"] },
      { href: "/app/incidents", label: "Incident Cases", icon: AlertTriangle, keywords: ["cases", "triage", "alerts", "fraud"] },
      { href: "/app/sessions", label: "Call Sessions", icon: History, keywords: ["calls", "telephony", "history", "logs"] },
    ],
  },
  {
    title: "Verification & Telephony",
    items: [
      { href: "/app/voiceprints", label: "Voiceprint Vault", icon: Fingerprint, keywords: ["biometrics", "speakers", "enrollment", "signatures"] },
      { href: "/app/challenges", label: "Challenge Prompts", icon: MessageSquare, keywords: ["indic", "hindi", "tamil", "replay", "dynamic"] },
      { href: "/app/telephony", label: "Telephony & SIP", icon: PhoneCall, keywords: ["twilio", "sip", "trunk", "carrier", "freeswitch"] },
      { href: "/app/threat-map", label: "Threat Map", icon: Globe, keywords: ["geo", "map", "global", "origins", "regions"] },
      { href: "/app/analytics", label: "Telemetry & Drift", icon: BarChart3, keywords: ["drift", "latency", "accuracy", "charts", "trends"] },
      { href: "/app/reports", label: "Forensic Reports", icon: FileText, keywords: ["section 65b", "court", "certificate", "export", "pdf"] },
    ],
  },
  {
    title: "Platform & Governance",
    items: [
      { href: "/app/alerts", label: "Alert Policies", icon: Bell, keywords: ["rules", "thresholds", "sms", "email", "dispatch"] },
      { href: "/app/api-keys", label: "API Keys", icon: Key, keywords: ["tokens", "credentials", "ingestion", "bearer"] },
      { href: "/app/webhooks", label: "Outbound Webhooks", icon: Webhook, keywords: ["endpoints", "events", "siem", "dispatch"] },
      { href: "/app/models", label: "Acoustic Models", icon: Cpu, keywords: ["dsp", "kalman", "weights", "checksums", "manifest"] },
      { href: "/app/audit-log", label: "Audit Log", icon: ScrollText, keywords: ["compliance", "immutability", "trail", "operator events"] },
      { href: "/app/organization", label: "Organization", icon: Users, keywords: ["tenant", "company", "contacts", "billing"] },
      { href: "/app/users", label: "Operator Seats", icon: UserCheck, keywords: ["analysts", "rbac", "roles", "seats", "invites"] },
      { href: "/app/notifications", label: "Notification Feed", icon: ShieldAlert, keywords: ["inbox", "unread", "activity", "messages"] },
      { href: "/app/settings", label: "System Settings", icon: Settings, keywords: ["preferences", "retention", "dpdp", "privacy", "ephemeral"] },
      { href: "/app/profile", label: "My Profile", icon: User, keywords: ["account", "password", "mfa", "security"] },
    ],
  },
];

export function PrivateAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [telemetryState, setTelemetryState] = useState<"connecting" | "online" | "local">("connecting");
  const [unreadCount, setUnreadCount] = useState<number>(3);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close sidebar and search on navigation
  useEffect(() => {
    setSidebarOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Fetch real authenticated user identity from Supabase
  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (mounted && user?.email) {
          setUserEmail(user.email);
        }
      } catch {
        // Fallback to neutral default
      }
    };
    fetchUser();
    return () => {
      mounted = false;
    };
  }, []);

  // Check backend telemetry connectivity status
  useEffect(() => {
    let active = true;
    const checkTelemetry = async () => {
      try {
        const res = await fetch("/api/alert-settings", { method: "GET" });
        if (active) {
          setTelemetryState(res.ok ? "online" : "local");
        }
      } catch {
        if (active) {
          setTelemetryState("local");
        }
      }
    };
    checkTelemetry();
    return () => {
      active = false;
    };
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens quick search; Escape closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        if (searchOpen) setSearchOpen(false);
        if (sidebarOpen) setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, sidebarOpen]);

  // Focus search input when search modal opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const handleSignOut = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  };

  const pageTitle = pathname
    .replace("/app/", "")
    .replace("/app", "Overview")
    .replace(/-/g, " ");

  // Quick search filtered list
  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const allItems: (NavItem & { section: string })[] = [];
    for (const sec of SECTIONS) {
      for (const item of sec.items) {
        allItems.push({ ...item, section: sec.title });
      }
    }
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  }, [searchQuery]);

  const sidebarClass = sidebarOpen
    ? "fixed inset-y-0 left-0 z-50 w-72 bg-[#0B2545] text-white flex flex-col border-r border-[#18354F] transition-transform duration-200 translate-x-0"
    : "fixed inset-y-0 left-0 z-50 w-72 bg-[#0B2545] text-white flex flex-col border-r border-[#18354F] transition-transform duration-200 translate-x-0 max-lg:-translate-x-full";

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col font-sans text-[#121826]">
      {/* Mobile Topbar */}
      <div className="lg:hidden bg-[#0B2545] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-[#18354F]">
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1565C0] flex items-center justify-center text-white">
            <ShieldCheck className="w-4 h-4 text-[#45D9D2]" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">VoiceShield SOC</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-white hover:bg-[#18354F]"
            aria-label="Quick Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-white hover:bg-[#18354F]"
            aria-label="Toggle Navigation Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Desktop & Mobile Drawer Sidebar */}
        <aside className={sidebarClass} aria-label="Application Sidebar Navigation">
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
                <span className="text-[11px] text-[#94A3B8] font-medium block">Enterprise Security Workspace</span>
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

          {/* Quick Search Shortcut Trigger */}
          <div className="p-3 border-b border-[#18354F]">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#071B33] text-[#94A3B8] hover:text-white border border-[#18354F] hover:border-[#20496E] transition-colors text-xs"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#45D9D2]" />
                <span>Search pages &amp; cases...</span>
              </span>
              <kbd className="text-[10px] bg-[#18354F] text-[#CBD5E1] px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </button>
          </div>

          {/* Verified Connection Status & Public Link */}
          <div className="px-5 py-2.5 border-b border-[#18354F] bg-[#071B33]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94A3B8] font-medium flex items-center gap-1.5">
                {telemetryState === "online" ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[#A7F3D0]">Telemetry Active</span>
                  </>
                ) : telemetryState === "connecting" ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                    <span className="text-[#FDE68A]">Verifying Node...</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                    <span className="text-[#CBD5E1]">Local Workspace Mode</span>
                  </>
                )}
              </span>
              <Link href="/" className="text-[11px] text-[#45D9D2] hover:underline flex items-center gap-1">
                <span>Public Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* 21 Routes Navigation Menu */}
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

          {/* Operator Profile & Sign Out Footer */}
          <div className="p-4 border-t border-[#18354F] bg-[#071B33]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#1565C0] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : "O"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {userEmail || "Authorized Operator"}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] truncate">SOC Analyst • Role Enforced</p>
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

        {/* Sidebar Overlay on Mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            aria-hidden="true"
          />
        )}

        {/* Main Work Area */}
        <main className="flex-1 lg:ml-72 flex flex-col min-w-0">
          {/* Header Bar */}
          <header className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-sm">
            {/* Breadcrumb Hierarchy */}
            <div className="flex items-center gap-2 text-xs font-medium text-[#52677C]">
              <Link href="/app" className="hover:text-[#0B2545] font-semibold">VoiceShield SOC</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span className="text-[#0B2545] font-bold capitalize">
                {pageTitle}
              </span>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              {/* Global Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F7F9FC] text-[#52677C] hover:text-[#0B2545] hover:bg-[#EDF2F7] border border-[#E2E8F0] text-xs transition-colors"
                title="Search routes & cases (⌘K)"
              >
                <Search className="w-3.5 h-3.5 text-[#52677C]" />
                <span>Search</span>
                <kbd className="text-[10px] bg-white border border-[#CBD5E1] text-[#52677C] px-1 py-0.2 rounded font-mono">⌘K</kbd>
              </button>

              {/* Engine Status Badge */}
              <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-medium bg-[#E7F7EF] text-[#065F46] rounded-full border border-[#A7F3D0]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>Engine Active</span>
              </div>

              {/* Notifications Inbox Icon */}
              <Link
                href="/app/notifications"
                className="p-1.5 rounded-lg text-[#52677C] hover:text-[#0B2545] hover:bg-[#F7F9FC] relative transition-colors"
                title="Notifications"
                aria-label="Notification feed"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#E2614B] rounded-full" />
                )}
              </Link>

              {/* Workspace Settings Icon */}
              <Link
                href="/app/settings"
                className="p-1.5 rounded-lg text-[#52677C] hover:text-[#0B2545] hover:bg-[#F7F9FC] transition-colors"
                title="System Settings"
                aria-label="Workspace settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </header>

          {/* Page Viewport */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Global Quick Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 pt-20 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-[#DFE7EF] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Global Quick Search"
          >
            <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3 bg-[#F7F9FC]">
              <Search className="w-5 h-5 text-[#52677C]" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Jump to route, tool, or policy (e.g. models, incidents, keys)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm text-[#0B2545] placeholder-[#94A3B8] focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-md text-[#94A3B8] hover:text-[#0B2545] hover:bg-[#E2E8F0]"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {searchQuery.trim() === "" ? (
                <div className="p-4 text-xs text-[#52677C] space-y-2">
                  <p className="font-semibold text-[#0B2545]">Suggested Quick Links:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/app/detection"
                      onClick={() => setSearchOpen(false)}
                      className="p-2 rounded-lg border border-[#E2E8F0] hover:bg-[#F7F9FC] flex items-center gap-2"
                    >
                      <Radio className="w-4 h-4 text-[#1565C0]" />
                      <span>Live Detection Console</span>
                    </Link>
                    <Link
                      href="/app/incidents"
                      onClick={() => setSearchOpen(false)}
                      className="p-2 rounded-lg border border-[#E2E8F0] hover:bg-[#F7F9FC] flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-[#E2614B]" />
                      <span>Incident Cases</span>
                    </Link>
                    <Link
                      href="/app/models"
                      onClick={() => setSearchOpen(false)}
                      className="p-2 rounded-lg border border-[#E2E8F0] hover:bg-[#F7F9FC] flex items-center gap-2"
                    >
                      <Cpu className="w-4 h-4 text-[#065F46]" />
                      <span>Acoustic Models</span>
                    </Link>
                    <Link
                      href="/app/reports"
                      onClick={() => setSearchOpen(false)}
                      className="p-2 rounded-lg border border-[#E2E8F0] hover:bg-[#F7F9FC] flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-[#8D6E00]" />
                      <span>Forensic Reports</span>
                    </Link>
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#52677C]">
                  No matching workspace destinations found for &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F7F9FC] text-xs transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-[#E7F3FF] flex items-center justify-center text-[#1565C0] group-hover:bg-[#1565C0] group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#0B2545]">{item.label}</p>
                            <p className="text-[10px] text-[#94A3B8]">{item.section} • {item.href}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1565C0]" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-2.5 bg-[#F7F9FC] border-t border-[#E2E8F0] text-[11px] text-[#94A3B8] flex items-center justify-between">
              <span>Press <kbd className="font-mono bg-white px-1 border rounded">ESC</kbd> to exit</span>
              <span>21 Authorized Private Destinations</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
