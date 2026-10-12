"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vs_workspace_api_keys");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setKeys(parsed);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

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

    setKeys((prev) => {
      const updated = [newKey, ...prev];
      try {
        localStorage.setItem("vs_workspace_api_keys", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    setCreatedSecret(rawSecret);
    setKeyName("");
  };

  const handleRevokeKey = (id: string, name: string) => {
    if (!window.confirm(`Revoke API key "${name}"? Ingestion traffic using this key will be rejected immediately.`)) return;

    setKeys((prev) => {
      const updated = prev.map((k) => (k.id === id ? { ...k, status: "REVOKED" as const } : k));
      try {
        localStorage.setItem("vs_workspace_api_keys", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    setToastMessage(`API key "${name}" revoked.`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              INGESTION TOKENS
            </span>
            <span className="text-xs text-[#52677C]">
              Bearer Tokens for Audio Streaming
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            API Keys &amp; Ingestion Credentials
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Manage authentication credentials for carrier media forks, SIP bridges, and REST endpoints.
          </p>
        </div>

        <button
          onClick={() => {
            setCreatedSecret(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Ingestion Key</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-[#E7F7EF] border border-[#A7F3D0] text-xs text-[#065F46] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Keys Table Card */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F7F9FC]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B2545]">
            <Key className="w-4 h-4 text-[#1565C0]" />
            <span>Active Ingestion Credentials ({keys.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-bold border-b border-[#DFE7EF]">
              <tr>
                <th className="py-3 px-4">Key Description</th>
                <th className="py-3 px-4">Masked Token Prefix</th>
                <th className="py-3 px-4">Authorization Scope</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-[#F7F9FC] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0B2545]">{k.name}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#52677C]">{k.prefix}</td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-[#0B2545]">
                    <span className="px-2 py-0.5 rounded bg-[#F7F9FC] border border-[#DFE7EF]">
                      {k.scope}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#52677C]">{k.lastUsed}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      k.status === "ACTIVE"
                        ? "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
                        : "bg-[#FCEAF3] text-[#991B1B] border-[#F8BBD0]"
                    }`}>
                      {k.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {k.status === "ACTIVE" && (
                      <button
                        onClick={() => handleRevokeKey(k.id, k.name)}
                        className="text-xs font-bold text-[#991B1B] hover:underline"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2545]/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] w-full max-w-md p-6 space-y-4 animate-riseIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-sm text-[#0B2545]">
                {createdSecret ? "Ingestion Key Generated" : "Create New Ingestion Key"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#52677C] hover:text-[#0B2545]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdSecret ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#FFF4D9] border border-[#FFE082] text-[#8D6E00] space-y-1">
                  <p className="font-bold">Copy Your Secret Key Now</p>
                  <p>For your security, this raw secret will not be displayed again.</p>
                </div>

                <div className="p-3 bg-[#F7F9FC] border border-[#CBD5E1] rounded-xl flex items-center justify-between font-mono break-all text-[11px] text-[#0B2545]">
                  <span>{createdSecret}</span>
                  <button
                    onClick={() => copyToClipboard(createdSecret)}
                    className="ml-2 p-1.5 rounded-lg border border-[#CBD5E1] hover:bg-white text-[#1565C0]"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && <span className="text-[10px] text-[#10B981] font-bold block">Copied to clipboard!</span>}

                <button
                  onClick={() => setModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#0B2545] text-white font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleGenerateKey} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#0B2545] uppercase mb-1">Key Description / Ingestion Node</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Production Twilio Trunk Gateway"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-xl text-xs text-[#0B2545] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0B2545] uppercase mb-1">Authorization Scope</label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-xl text-xs text-[#0B2545] outline-none"
                  >
                    <option value="carrier:audio:write">carrier:audio:write (Streaming Audio Stream Ingestion)</option>
                    <option value="forensic:audit:read">forensic:audit:read (Read-Only Forensic Hash Retrieval)</option>
                    <option value="admin:full">admin:full (Tenant Administration)</option>
                  </select>
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
                    Generate Secret
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
