"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  ArrowUpRight,
  Filter,
  Info,
  Check,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatDistanceToNow } from "date-fns";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
  read: boolean;
  linkHref?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "CRITICAL">("ALL");

  useEffect(() => {
    let active = true;
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: dbSessions } = await supabase
          .from("sessions")
          .select("*")
          .order("started_at", { ascending: false })
          .limit(20);

        if (!active) return;

        if (dbSessions && dbSessions.length > 0) {
          const items: NotificationItem[] = dbSessions
            .filter((s) => Number(s.risk_summary?.max_risk ?? 0) >= 0.35 || s.status === "flagged")
            .map((s) => {
              const maxRisk = Number(s.risk_summary?.max_risk ?? 0.85);
              const isCrit = maxRisk >= 0.75;
              return {
                id: `notif-${s.id.slice(0, 8)}`,
                title: isCrit
                  ? `High-Risk Synthetic Stream Quarantined (${Math.round(maxRisk * 100)}%)`
                  : `Phonetic Challenge Injected (${Math.round(maxRisk * 100)}%)`,
                message: `Telephony stream #${s.id.slice(0, 8)} exceeded scrutiny threshold. Kalman policy decision: ${s.risk_summary?.decision ?? "BLOCKED"}.`,
                severity: isCrit ? "critical" : "warning",
                timestamp: s.started_at ? formatDistanceToNow(new Date(s.started_at), { addSuffix: true }) : "Recent",
                read: false,
                linkHref: `/app/sessions?session=${s.id}`,
              };
            });

          setNotifications(items);
        } else {
          setNotifications([]);
        }
      } catch {
        if (active) setNotifications([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchNotifications();
    return () => {
      active = false;
    };
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleClear = () => {
    setNotifications([]);
  };

  const filteredItems = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.read;
    if (filter === "CRITICAL") return n.severity === "critical";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              TENANT INBOX
            </span>
            <span className="text-xs text-[#52677C]">
              {unreadCount} Unread Alert{unreadCount === 1 ? "" : "s"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Notification Feed &amp; System Alerts
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Real-time feed of synthetic voice risk alerts, challenge failures, and carrier trunk status notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <>
              <button
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F7F9FC] text-[#52677C] border border-[#DFE7EF] text-xs font-semibold rounded-lg transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FCEAF3] text-[#991B1B] border border-[#F8BBD0] text-xs font-semibold rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Feed</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#F7F9FC] p-1 rounded-xl border border-[#DFE7EF] w-fit">
        {[
          { label: "All Alerts", value: "ALL" },
          { label: "Unread", value: "UNREAD" },
          { label: "Critical Only", value: "CRITICAL" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as any)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filter === f.value
                ? "bg-white text-[#0B2545] shadow-xs border border-[#DFE7EF]"
                : "text-[#52677C] hover:text-[#0B2545]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#52677C]">
            Loading notification feed...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#52677C] space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#E7F7EF] text-[#065F46] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="font-bold text-[#0B2545]">Feed Clean — No Active Notifications</p>
            <p className="text-[11px] text-[#52677C]">
              All threat alerts have been acknowledged or there have been zero synthetic voice events during this cycle.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  item.read ? "bg-white hover:bg-[#F8FAFC]" : "bg-[#F7F9FC] hover:bg-[#F1F5F9]"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      item.severity === "critical"
                        ? "bg-[#FCEAF3] text-[#991B1B]"
                        : "bg-[#FFF4D9] text-[#8D6E00]"
                    }`}
                  >
                    {item.severity === "critical" ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs text-[#0B2545]">{item.title}</p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#1565C0]" />
                      )}
                    </div>
                    <p className="text-xs text-[#52677C] mt-0.5">{item.message}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-1">{item.timestamp}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.linkHref && (
                    <Link
                      href={item.linkHref}
                      className="text-xs font-semibold text-[#1565C0] hover:underline flex items-center gap-1"
                    >
                      <span>Investigate</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  <button
                    onClick={() => handleToggleRead(item.id)}
                    className="p-1 rounded text-[#94A3B8] hover:text-[#0B2545]"
                    title={item.read ? "Mark unread" : "Mark read"}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
