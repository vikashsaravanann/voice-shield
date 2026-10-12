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
  RefreshCw,
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

  const getReadIds = (): Set<string> => {
    try {
      const stored = localStorage.getItem("vs_read_notifications");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  };

  const saveReadIds = (ids: Set<string>) => {
    try {
      localStorage.setItem("vs_read_notifications", JSON.stringify(Array.from(ids)));
    } catch {
      // Ignore
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: dbSessions } = await supabase
        .from("sessions")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(25);

      const readIds = getReadIds();

      if (dbSessions && dbSessions.length > 0) {
        const items: NotificationItem[] = dbSessions
          .filter((s) => Number(s.risk_summary?.max_risk ?? 0) >= 0.35 || s.status === "flagged")
          .map((s) => {
            const maxRisk = Number(s.risk_summary?.max_risk ?? 0.85);
            const isCrit = maxRisk >= 0.75;
            const notifId = `notif-${s.id.slice(0, 8)}`;
            return {
              id: notifId,
              title: isCrit
                ? `High-Risk Synthetic Stream Quarantined (${Math.round(maxRisk * 100)}%)`
                : `Phonetic Challenge Injected (${Math.round(maxRisk * 100)}%)`,
              message: `Telephony stream #${s.id.slice(0, 8)} exceeded scrutiny threshold. Kalman policy decision: ${s.risk_summary?.decision ?? "BLOCKED"}.`,
              severity: isCrit ? "critical" : "warning",
              timestamp: s.started_at ? formatDistanceToNow(new Date(s.started_at), { addSuffix: true }) : "Recent",
              read: readIds.has(notifId),
              linkHref: `/app/sessions?session=${s.id}`,
            };
          });

        setNotifications(items);
      } else {
        setNotifications([]);
      }
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id: string) => {
    const readIds = getReadIds();
    readIds.add(id);
    saveReadIds(readIds);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    const readIds = getReadIds();
    notifications.forEach((n) => readIds.add(n.id));
    saveReadIds(readIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    const readIds = getReadIds();
    notifications.forEach((n) => readIds.add(n.id));
    saveReadIds(readIds);
    setNotifications([]);
  };

  const filtered = notifications.filter((n) => {
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
              TENANT ALERT FEED
            </span>
            <span className="text-xs text-[#52677C]">
              Real-time Ingestion Anomalies
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Security Notification Feed
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Review automated quarantine actions, challenge triggers, and operational alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-xs font-semibold text-[#0B2545] border border-[#DFE7EF] hover:bg-[#F7F9FC] transition-colors shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
          <button
            onClick={fetchNotifications}
            className="p-2 rounded-xl bg-white border border-[#DFE7EF] text-[#52677C] hover:text-[#0B2545] hover:bg-[#F7F9FC]"
            title="Refresh feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "ALL"
              ? "bg-[#0B2545] text-white"
              : "bg-white text-[#52677C] border border-[#DFE7EF] hover:bg-[#F7F9FC]"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "UNREAD"
              ? "bg-[#0B2545] text-white"
              : "bg-white text-[#52677C] border border-[#DFE7EF] hover:bg-[#F7F9FC]"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("CRITICAL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "CRITICAL"
              ? "bg-[#0B2545] text-white"
              : "bg-white text-[#52677C] border border-[#DFE7EF] hover:bg-[#F7F9FC]"
          }`}
        >
          Critical Only
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#52677C] bg-white rounded-2xl border border-[#DFE7EF]">
            Querying active alerts...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#52677C] bg-white rounded-2xl border border-[#DFE7EF]">
            <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
            <p className="font-bold text-[#0B2545]">All Alerts Cleared</p>
            <p className="mt-1">No notifications matching the selected filter.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                n.read
                  ? "bg-white border-[#DFE7EF]"
                  : "bg-[#F7F9FC] border-[#BBDEFB] shadow-2xs"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  n.severity === "critical"
                    ? "bg-[#FCEAF3] text-[#991B1B]"
                    : "bg-[#FFF4D9] text-[#8D6E00]"
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0B2545]">{n.title}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#1565C0]" />
                    )}
                  </div>
                  <p className="text-xs text-[#52677C] mt-1">{n.message}</p>
                  <span className="text-[10px] font-mono text-[#52677C] block mt-1">{n.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {n.linkHref && (
                  <Link
                    href={n.linkHref}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#1565C0] bg-[#E7F3FF] hover:bg-[#BBDEFB] transition-colors"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-1.5 rounded-lg border border-[#DFE7EF] text-[#52677C] hover:text-[#0B2545] hover:bg-[#F7F9FC]"
                    title="Mark as read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
