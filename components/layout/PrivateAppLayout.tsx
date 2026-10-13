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
  const [unreadCount, setUnreadCount] = useState<number>(0);
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

  // Check genuine backend telemetry health from /api/health
  useEffect(() => {
    let active = true;
    const checkTelemetry = async () => {
      try {
        const res = await fetch("/api/health", { method: "GET" });
        if (active) {
          if (res.ok) {
            const data = await res.json();
            setTelemetryState("online");
            if (typeof data.unreadNotifications === "number") {
              setUnreadCount(data.unreadNotifications);
            }
          } else {
            setTelemetryState("local");
          }
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

  const SUPER_ADMINS = [
    "createwithvikash@gmail.com",
    "admin@logicintelligencetechnologies.in",
    "hello@logicintelligencetechnologies.in",
    "vikash@logicintelligencetechnologies.in",
    "platform_owner@healthcare.lit",
  ];
  const isSuperAdmin = !!userEmail && SUPER_ADMINS.includes(userEmail.toLowerCase());

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col font-sans text-[#121826]">
      {/* Mobile Topbar */}
      <div className="lg:hidden bg-white text-[#0B2545] px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-[#E2E8F0] shadow-xs">
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B2545] to-[#1565C0] flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#45D9D2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[#0B2545]">VoiceShield SOC</span>
            <span className="text-[9px] font-semibold text-[#52677C] tracking-wide uppercase">Enterprise</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg text-[#52677C] hover:text-[#0B2545] hover:bg-[#F1ECFF] transition-colors"
            aria-label="Quick Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-[#52677C] hover:text-[#0B2545] hover:bg-[#F1ECFF] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-[#0B2545]/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Healthcare-Style White Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-[#0B2545] flex flex-col border-r border-[#E2E8F0] shadow-xs transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          aria-label="Application Sidebar Navigation"
        >
          {/* Sidebar Brand Header */}
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between shrink-0 bg-white">
            <Link href="/app" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B2545] to-[#1565C0] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#45D9D2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-[#0B2545] tracking-tight">VoiceShield</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-[#E7F3FF] text-[#1565C0] px-1.5 py-0.5 rounded border border-[#BBDEFB]">
                    SOC
                  </span>
                </div>
                <span className="text-[10px] text-[#52677C] font-semibold tracking-wider uppercase truncate">
                  Security Operations
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-[#52677C] hover:text-[#0B2545] hover:bg-[#F1ECFF]"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Shortcut Button */}
          <div className="px-3 pt-3 pb-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#52677C] bg-[#F7F9FC] hover:bg-[#F1ECFF] hover:text-[#0B2545] rounded-xl border border-[#DFE7EF] transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#52677C] group-hover:text-[#1565C0] transition-colors" />
                <span className="font-medium">Jump to module...</span>
              </div>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#52677C] border border-[#CBD5E1] shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Scrollable Navigation Sections */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5 custom-scrollbar">
            {SECTIONS.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#52677C]">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        active
                          ? "bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] shadow-2xs font-bold"
                          : "text-[#52677C] hover:text-[#0B2545] hover:bg-[#F1ECFF] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            active ? "text-[#1565C0]" : "text-[#52677C] group-hover:text-[#0B2545]"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border whitespace-nowrap ${
                            item.badge === "Realtime"
                              ? "bg-[#FFF4D9] text-[#8D6E00] border-[#FFE082] animate-pulse"
                              : "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer with Authenticated Identity & Sign Out */}
          <div className="p-3 border-t border-[#E2E8F0] bg-[#F7F9FC] shrink-0 space-y-2">
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#52677C]">
                <span
                  className={`w-2 h-2 rounded-full ${
                    telemetryState === "online"
                      ? "bg-[#10B981] animate-pulse"
                      : telemetryState === "connecting"
                      ? "bg-[#F59E0B]"
                      : "bg-[#64748B]"
                  }`}
                />
                <span className="capitalize">
                  {telemetryState === "online"
                    ? "Live Engine"
                    : telemetryState === "connecting"
                    ? "Connecting..."
                    : "Local Mode"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#52677C] font-semibold">v2.4.0</span>
            </div>

            <div className="bg-white rounded-xl p-2.5 border border-[#DFE7EF] shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-[#E7F3FF] text-[#1565C0] flex items-center justify-center text-[10px] font-bold shrink-0">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-bold text-[#0B2545] truncate max-w-[130px]" title={userEmail || "Authenticated Operator"}>
                    {userEmail || "SOC Operator"}
                  </span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] shrink-0">
                  {isSuperAdmin ? "SUPER ADMIN" : "ANALYST"}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] font-bold text-[#991B1B] hover:bg-[#FCEAF3] rounded-lg transition-colors border border-transparent hover:border-[#F8BBD0]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Workspace</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area (Offset by Sidebar on Desktop) */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          {/* Top Header Bar on Desktop */}
          <header className="hidden lg:flex items-center justify-between h-14 px-6 bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-2xs">
            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-xs text-[#52677C]">
              <Link href="/app" className="hover:text-[#0B2545] font-semibold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-[#1565C0]" />
                <span>SOC Workspace</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
              <span className="font-bold text-[#0B2545] capitalize">
                {pageTitle}
              </span>
            </div>

            {/* Topbar Actions */}
            <div className="flex items-center gap-3">
              {/* Telemetry Indicator */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F7F9FC] border border-[#DFE7EF]">
                <span
                  className={`w-2 h-2 rounded-full ${
                    telemetryState === "online"
                      ? "bg-[#10B981] animate-pulse"
                      : "bg-[#F59E0B]"
                  }`}
                />
                <span className="text-[#0B2545] text-[11px]">
                  {telemetryState === "online" ? "Telemetry Active" : "Local Fallback"}
                </span>
              </div>

              {/* Quick Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-[#52677C] bg-[#F7F9FC] hover:bg-[#F1ECFF] hover:text-[#0B2545] border border-[#DFE7EF] transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-[#52677C]" />
                <span>Search</span>
                <kbd className="text-[10px] font-mono px-1 rounded bg-white text-[#52677C] border border-[#CBD5E1]">
                  ⌘K
                </kbd>
              </button>

              {/* Notification Feed Link */}
              <Link
                href="/app/notifications"
                className="relative p-2 rounded-xl text-[#52677C] hover:text-[#0B2545] hover:bg-[#F1ECFF] transition-colors border border-transparent hover:border-[#E2E8F0]"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* Public Portal Exit Link */}
              <Link
                href="/"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#1565C0] bg-[#E7F3FF] hover:bg-[#BBDEFB] border border-[#BBDEFB] transition-colors"
              >
                <span>Public Portal</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </header>

          {/* Main Workspace Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Quick Search Dialog (Cmd+K) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#0B2545]/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] w-full max-w-xl overflow-hidden animate-riseIn">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3">
              <Search className="w-5 h-5 text-[#1565C0] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a destination, keyword, or SOC tool..."
                className="w-full bg-transparent text-sm text-[#0B2545] font-semibold placeholder:text-[#94A3B8] outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-md text-[#52677C] hover:text-[#0B2545] hover:bg-[#F1ECFF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {searchQuery.trim() === "" ? (
                <div className="p-4 text-center text-xs text-[#52677C]">
                  <Command className="w-6 h-6 text-[#CBD5E1] mx-auto mb-2" />
                  <p className="font-semibold text-[#0B2545]">Quick Module Navigation</p>
                  <p className="mt-1">Search through all 21 SOC modules, forensic workflows, and platform policies.</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#52677C]">
                  No destinations found matching "{searchQuery}".
                </div>
              ) : (
                searchResults.map((res) => (
                  <Link
                    key={res.href}
                    href={res.href}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1ECFF] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <res.icon className="w-4 h-4 text-[#1565C0] shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#0B2545] group-hover:text-[#1565C0]">
                          {res.label}
                        </p>
                        <p className="text-[10px] text-[#52677C]">{res.section}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#52677C] bg-[#F7F9FC] px-2 py-0.5 rounded border border-[#DFE7EF]">
                      {res.href}
                    </span>
                  </Link>
                ))
              )}
            </div>

            <div className="p-2.5 border-t border-[#E2E8F0] bg-[#F7F9FC] flex items-center justify-between text-[11px] text-[#52677C]">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#CBD5E1] font-mono">Esc</kbd> to close</span>
              <span>21 SOC Destinations Accessible</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
