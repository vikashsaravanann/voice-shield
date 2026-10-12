"use client";

import React, { useState, useEffect } from "react";
import {
  Webhook,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Send,
  Trash2,
  RefreshCw,
  X,
  Info,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  maskedSecret: string;
  status: "ACTIVE" | "PAUSED";
  lastDelivery: string;
  successRate: string;
}

const INITIAL_ENDPOINTS: WebhookEndpoint[] = [
  {
    id: "wh-endpoint-01",
    url: "https://siem.enterprise-sec.internal/api/v1/voiceshield/events",
    events: ["incident.quarantined", "session.flagged"],
    maskedSecret: "whsec_••••••••••••••••bb12",
    status: "ACTIVE",
    lastDelivery: "10 mins ago (HTTP 200)",
    successRate: "99.8%",
  },
];

export default function WebhooksPage() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>(INITIAL_ENDPOINTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [urlInput, setUrlInput] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "incident.quarantined",
    "session.flagged",
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vs_registered_webhooks");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEndpoints(parsed);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.startsWith("https://")) {
      alert("Webhook endpoints must use encrypted HTTPS protocol.");
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const newEndpoint: WebhookEndpoint = {
      id: `wh-endpoint-${Date.now()}`,
      url: urlInput.trim(),
      events: selectedEvents,
      maskedSecret: `whsec_••••••••••••••••${randomSuffix}`,
      status: "ACTIVE",
      lastDelivery: "Never",
      successRate: "100%",
    };

    setEndpoints((prev) => {
      const updated = [newEndpoint, ...prev];
      try {
        localStorage.setItem("vs_registered_webhooks", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    setModalOpen(false);
    setUrlInput("");
    setFeedback(`Webhook endpoint registered for ${newEndpoint.url}`);
    setTimeout(() => setFeedback(""), 4000);
  };

  const handleTestPing = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setFeedback("Test ping payload signed with HMAC-SHA256 and dispatched (HTTP 200 OK simulated).");
      setTimeout(() => setFeedback(""), 4000);
    }, 900);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Remove this webhook subscription?")) return;
    setEndpoints((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      try {
        localStorage.setItem("vs_registered_webhooks", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    setFeedback("Webhook endpoint removed.");
    setTimeout(() => setFeedback(""), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              SIEM &amp; SOAR DISPATCH
            </span>
            <span className="text-xs text-[#52677C]">
              HMAC-SHA256 Signed Outbound Events
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Outbound Security Webhooks
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Forward quarantine events, Kalman filter alerts, and telephony anomalies to enterprise SOC infrastructure.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Webhook Endpoint</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-[#E7F7EF] border border-[#A7F3D0] text-xs text-[#065F46] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="font-semibold">{feedback}</span>
          </div>
        </div>
      )}

      {/* Endpoints Table Card */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F7F9FC]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B2545]">
            <Webhook className="w-4 h-4 text-[#1565C0]" />
            <span>Configured Dispatch Endpoints ({endpoints.length})</span>
          </div>
          <span className="text-[10px] font-mono text-[#52677C]">
            HMAC X-VoiceShield-Signature
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-bold border-b border-[#DFE7EF]">
              <tr>
                <th className="py-3 px-4">Endpoint URL</th>
                <th className="py-3 px-4">Subscribed Events</th>
                <th className="py-3 px-4">Signing Secret</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {endpoints.map((ep) => (
                <tr key={ep.id} className="hover:bg-[#F7F9FC] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0B2545] block font-mono">{ep.url}</span>
                    <span className="text-[10px] text-[#52677C]">Delivery success: {ep.successRate}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {ep.events.map((ev) => (
                        <span key={ev} className="px-1.5 py-0.5 rounded bg-[#F7F9FC] text-[#0B2545] border border-[#DFE7EF] font-mono text-[10px]">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#52677C]">{ep.maskedSecret}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E7F7EF] text-[#065F46] border border-[#A7F3D0]">
                      {ep.status}
                    </span>
                    <span className="block text-[10px] text-[#52677C] mt-0.5">{ep.lastDelivery}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTestPing(ep.id)}
                        disabled={testingId === ep.id}
                        className="px-2.5 py-1 rounded-lg border border-[#DFE7EF] text-[#0B2545] hover:bg-[#F7F9FC] font-semibold text-[11px] flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>{testingId === ep.id ? "Pinging..." : "Test"}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(ep.id)}
                        className="p-1 rounded-lg text-[#991B1B] hover:bg-[#FCEAF3]"
                        title="Delete endpoint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2545]/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] w-full max-w-lg p-6 space-y-4 animate-riseIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-sm text-[#0B2545]">Register Webhook Endpoint</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#52677C] hover:text-[#0B2545]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#0B2545] uppercase mb-1">Payload URL (HTTPS required)</label>
                <input
                  type="url"
                  required
                  placeholder="https://siem.yourcompany.com/webhook"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-xl text-xs text-[#0B2545] font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B2545] uppercase mb-1">Event Triggers</label>
                <div className="space-y-2 p-3 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF]">
                  {["incident.quarantined", "session.flagged", "voiceprint.compromise_flag", "telephony.trunk_anomaly"].map((ev) => (
                    <label key={ev} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(ev)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedEvents([...selectedEvents, ev]);
                          else setSelectedEvents(selectedEvents.filter((x) => x !== ev));
                        }}
                        className="rounded text-[#1565C0] focus:ring-[#1565C0]"
                      />
                      <span className="font-mono text-xs text-[#0B2545]">{ev}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DFE7EF] font-bold text-[#52677C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-bold transition-colors shadow-sm"
                >
                  Register Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
