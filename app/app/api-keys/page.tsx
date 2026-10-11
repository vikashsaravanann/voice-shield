"use client";

import React, { useState } from "react";
import {
  Key,
  Copy,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
  ShieldAlert,
  X,
  AlertTriangle,
  Info,
  Lock,
} from "lucide-react";

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  scope: string;
  status: "ACTIVE" | "REVOKED";
}

const INITIAL_KEYS: ApiKeyItem[] = [
  {
    id: "key-vs-primary",
    name: "Primary Carrier Ingestion Trunk",
    prefix: "vs_live_••••••••••••••••8a03",
    created: "2026-10-01",
    lastUsed: "2 mins ago",
    scope: "carrier:audio:write",
    status: "ACTIVE",
  },
  {
    id: "key-vs-staging",
    name: "Staging Test SIP Bridge",
    prefix: "vs_test_••••••••••••••••3f19",
    created: "2026-09-15",
    lastUsed: "4 days ago",
    scope: "carrier:audio:write",
    status: "ACTIVE",
  },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>(INITIAL_KEYS);
  const [modalOpen, setModalOpen] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [scope, setScope] = useState("carrier:audio:write");
  const [toastMessage, setToastMessage] = useState("");

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    // Generate random secret for one-time display
    const rawSecret = `vs_live_${crypto.randomUUID().replace(/-/g, "")}`;
    const suffix = rawSecret.slice(-4);

    const newKey: ApiKeyItem = {
      id: `key-vs-${Date.now()}`,
      name: keyName.trim(),
      prefix: `vs_live_••••••••••••••••${suffix}`,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      scope,
      status: "ACTIVE",
    };

    setKeys((prev) => [newKey, ...prev]);
    setCreatedSecret(rawSecret);
    setKeyName("");
  };

  const handleCopySecret = () => {
    if (!createdSecret) return;
    navigator.clipboard.writeText(createdSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRevokeKey = (id: string) => {
    if (!window.confirm("Are you sure you want to revoke this API credential? Ingestion streams using it will be rejected immediately.")) return;
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "REVOKED" } : k))
    );
    setToastMessage("API key revoked. Carrier streams using this token will fail authentication.");
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              AUTHENTICATION TOKENS
            </span>
            <span className="text-xs text-[#52677C]">
              Bearer Tokens &bull; WebSocket Handshake Keys
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Ingestion API Credentials
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Scoped tokens permitting carrier FreeSWITCH and Asterisk telephony servers to stream audio directly into VoiceShield.
          </p>
        </div>

        <button
          onClick={() => {
            setCreatedSecret(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1565C0] hover:bg-[#0B2545] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate New Key</span>
        </button>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 bg-[#E7F7EF] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Security Advisory */}
      <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] text-xs text-[#52677C] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#1565C0] shrink-0 mt-0.5" />
        <p>
          <strong>Secret Masking Standards:</strong> Full API secrets are shown exactly once upon creation and cannot be retrieved again. Existing keys in the database are stored as one-way salted hashes.
        </p>
      </div>

      {/* API Keys Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0B2545]">Active Telephony Ingestion Tokens</h2>
          <span className="text-xs text-[#52677C]">{keys.filter((k) => k.status === "ACTIVE").length} Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3">Label</th>
                <th className="px-6 py-3">Token Mask</th>
                <th className="px-6 py-3">Assigned Scope</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Last Telemetry</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Revoke</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-6 py-4 font-bold text-[#0B2545]">
                    {k.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[#52677C]">
                    {k.prefix}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[#1565C0]">
                    {k.scope}
                  </td>
                  <td className="px-6 py-4 text-[#52677C]">
                    {k.created}
                  </td>
                  <td className="px-6 py-4 text-[#52677C]">
                    {k.lastUsed}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        k.status === "ACTIVE"
                          ? "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
                          : "bg-[#FCEAF3] text-[#991B1B] border-[#F8BBD0]"
                      }`}
                    >
                      {k.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {k.status === "ACTIVE" && (
                      <button
                        onClick={() => handleRevokeKey(k.id)}
                        className="text-xs text-[#991B1B] hover:underline font-semibold"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Key Modal */}
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
                  Credential Issuance
                </span>
                <h3 className="text-base font-bold text-[#0B2545] mt-1">
                  Generate Ingestion API Key
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-md text-[#94A3B8] hover:text-[#0B2545]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdSecret ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-[#E7F7EF] rounded-xl border border-[#A7F3D0] text-[#065F46] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    <strong>API Key Created:</strong> Copy your key now. For your security, it will not be displayed again.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-[#0B2545] mb-1">Raw API Secret</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdSecret}
                      className="w-full font-mono text-xs px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-[#0B2545]"
                    />
                    <button
                      onClick={handleCopySecret}
                      className="px-3.5 py-2 bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shrink-0"
                    >
                      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#45D9D2]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-[#1565C0] text-white rounded-lg text-xs font-semibold hover:bg-[#0B2545]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateKey} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#0B2545] mb-1">Key Description / Purpose *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FreeSWITCH Primary Telephony SIP Trunk"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0B2545] mb-1">Access Scope</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
                  >
                    <option value="carrier:audio:write">carrier:audio:write (Standard Realtime Ingestion)</option>
                    <option value="carrier:audio:full">carrier:audio:full (Ingestion + Replay Challenges)</option>
                    <option value="telemetry:read">telemetry:read (Read-Only Metrics &amp; Events)</option>
                  </select>
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
                    Create Key
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
