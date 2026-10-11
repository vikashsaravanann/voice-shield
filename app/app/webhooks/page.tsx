"use client";

import React, { useState } from "react";
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
  signingSecret: string;
  status: "ACTIVE" | "PAUSED";
  lastDelivery: string;
  successRate: string;
}

const INITIAL_ENDPOINTS: WebhookEndpoint[] = [
  {
    id: "wh-endpoint-01",
    url: "https://siem.enterprise-sec.internal/api/v1/voiceshield/events",
    events: ["incident.quarantined", "session.flagged"],
    signingSecret: "whsec_79a2f1c84b9012e88a03bb12c3d4",
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.startsWith("https://")) {
      alert("Webhook endpoints must use encrypted HTTPS protocol.");
      return;
    }

    const newEndpoint: WebhookEndpoint = {
      id: `wh-endpoint-${Date.now()}`,
      url: urlInput.trim(),
      events: selectedEvents,
      signingSecret: `whsec_${crypto.randomUUID().replace(/-/g, "")}`,
      status: "ACTIVE",
      lastDelivery: "Never",
      successRate: "100%",
    };

    setEndpoints((prev) => [newEndpoint, ...prev]);
    setModalOpen(false);
    setUrlInput("");
    setFeedback(`Webhook endpoint registered for ${newEndpoint.url}`);
    setTimeout(() => setFeedback(""), 4000);
  };

  const handleTestPing = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setFeedback("Test ping payload successfully signed and dispatched (HTTP 200 OK simulated).");
      setTimeout(() => setFeedback(""), 4000);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Remove this webhook subscription endpoint?")) return;
    setEndpoints((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleEvent = (ev: string) => {
    setSelectedEvents((prev) =>
      prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              EVENT NOTIFICATIONS
            </span>
            <span className="text-xs text-[#52677C]">
              HMAC-SHA256 Signed Payloads
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Outbound Webhook Management
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Forward real-time voice fraud alerts, incident quarantines, and forensic reports directly to your SIEM, SOAR, or incident desk.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1565C0] hover:bg-[#0B2545] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Endpoint</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3 bg-[#E7F7EF] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Advisory Note */}
      <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] text-xs text-[#52677C] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#1565C0] shrink-0 mt-0.5" />
        <p>
          <strong>Security Standard:</strong> Outbound webhook requests include the header <code>X-VoiceShield-Signature</code> containing an HMAC-SHA256 hex digest of the JSON body computed with your signing secret. Dispatches timeout after 5 seconds with exponential retry backoff.
        </p>
      </div>

      {/* Endpoints Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0B2545]">Subscribed Endpoints</h2>
          <span className="text-xs text-[#52677C]">{endpoints.length} Registered</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3">Destination URL</th>
                <th className="px-6 py-3">Event Subscriptions</th>
                <th className="px-6 py-3">Signing Secret</th>
                <th className="px-6 py-3">Last Delivery</th>
                <th className="px-6 py-3">Health</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {endpoints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-xs text-[#52677C]">
                    No outbound webhook destinations registered for this tenant. Click <strong>Register Endpoint</strong> above to connect your external SIEM.
                  </td>
                </tr>
              ) : (
                endpoints.map((ep) => (
                  <tr key={ep.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-[#0B2545] max-w-xs truncate" title={ep.url}>
                      {ep.url}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {ep.events.map((ev) => (
                          <span key={ev} className="px-1.5 py-0.5 rounded text-[10px] bg-[#E7F3FF] text-[#1565C0] font-mono border border-[#BBDEFB]">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#52677C]">
                      {ep.signingSecret.slice(0, 12)}••••••••
                    </td>
                    <td className="px-6 py-4 text-[#52677C]">
                      {ep.lastDelivery}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F7EF] text-[#065F46] border border-[#A7F3D0]">
                        {ep.successRate}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTestPing(ep.id)}
                          disabled={testingId === ep.id}
                          className="text-xs text-[#1565C0] hover:underline font-semibold"
                        >
                          {testingId === ep.id ? "Pinging..." : "Test Ping"}
                        </button>
                        <button
                          onClick={() => handleDelete(ep.id)}
                          className="text-xs text-[#991B1B] hover:underline font-semibold ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DFE7EF] space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1565C0] bg-[#E7F3FF] px-2 py-0.5 rounded border border-[#BBDEFB]">
                  Endpoint Registration
                </span>
                <h3 className="text-base font-bold text-[#0B2545] mt-1">
                  Register Outbound Webhook
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-md text-[#94A3B8] hover:text-[#0B2545]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#0B2545] mb-1">
                  HTTPS Endpoint URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://siem.yourcompany.com/webhook"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B2545] mb-1">
                  Trigger Event Subscriptions
                </label>
                <div className="space-y-2 pt-1">
                  {[
                    { id: "incident.quarantined", label: "incident.quarantined (Synthetic Attack Blocked)" },
                    { id: "session.flagged", label: "session.flagged (Amber Threshold Breached)" },
                    { id: "challenge.failed", label: "challenge.failed (Dynamic ASR Verification Failed)" },
                    { id: "audit.security", label: "audit.security (High-Privilege Operator Actions)" },
                  ].map((ev) => (
                    <label key={ev.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(ev.id)}
                        onChange={() => toggleEvent(ev.id)}
                        className="rounded border-[#CBD5E1] text-[#1565C0]"
                      />
                      <span className="text-[#0B2545] font-medium">{ev.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#DFE7EF] text-[#52677C] hover:bg-[#F7F9FC] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1565C0] hover:bg-[#0B2545] text-white font-semibold rounded-lg transition-colors"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
