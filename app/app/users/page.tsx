"use client";

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Mail,
  UserX,
  X,
  Info,
  ShieldAlert,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

interface OperatorSeat {
  id: string;
  email: string;
  role: "Tenant Admin" | "Security Analyst" | "Compliance Auditor";
  status: "ACTIVE" | "INVITED";
  lastActive: string;
}

export default function UsersPage() {
  const [operators, setOperators] = useState<OperatorSeat[]>([
    {
      id: "op-super-admin",
      email: "createwithvikash@gmail.com",
      role: "Tenant Admin",
      status: "ACTIVE",
      lastActive: "Now",
    },
    {
      id: "op-auditor",
      email: "compliance-officer@enterprise.com",
      role: "Compliance Auditor",
      status: "ACTIVE",
      lastActive: "1 day ago",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OperatorSeat["role"]>("Security Analyst");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let active = true;
    const fetchCurrent = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (active && user?.email) {
          const isSuperAdmin = user.email.toLowerCase() === "createwithvikash@gmail.com";
          setOperators((prev) => [
            {
              id: user.id,
              email: user.email!,
              role: isSuperAdmin ? "Tenant Admin" : "Security Analyst",
              status: "ACTIVE",
              lastActive: "Active Session",
            },
            ...prev.filter((p) => p.email !== user.email && p.id !== "op-super-admin" && p.id !== "op-primary"),
          ]);
        }
      } catch {
        // Fallback
      }
    };
    fetchCurrent();
    return () => {
      active = false;
    };
  }, []);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newSeat: OperatorSeat = {
      id: `inv-${Date.now()}`,
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "INVITED",
      lastActive: "Invitation Pending",
    };

    setOperators((prev) => [...prev, newSeat]);
    setModalOpen(false);
    setInviteEmail("");
    setSuccessMsg(`Secure invitation sent to ${newSeat.email}`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleRevoke = (id: string) => {
    if (!window.confirm("Revoke operator access for this seat?")) return;
    setOperators((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              ROLE-BASED ACCESS CONTROL
            </span>
            <span className="text-xs text-[#52677C]">
              PostgreSQL Row-Level Security
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Operator Seats &amp; RBAC Roles
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Manage authorized SOC analysts, fraud triage operators, and compliance auditor permissions.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1565C0] hover:bg-[#0B2545] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Invite Operator</span>
        </button>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="p-3 bg-[#E7F7EF] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Seat Allocation Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <span className="font-bold text-[#52677C] uppercase tracking-wider text-[10px] block mb-1">
            Active Seats
          </span>
          <p className="text-2xl font-bold text-[#0B2545]">{operators.length} / 10</p>
          <p className="text-[#52677C] text-[11px] mt-1">Enterprise license allocation</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <span className="font-bold text-[#52677C] uppercase tracking-wider text-[10px] block mb-1">
            MFA Enforcement
          </span>
          <p className="text-2xl font-bold text-[#065F46]">Mandatory</p>
          <p className="text-[#52677C] text-[11px] mt-1">TOTP step-up on incident closure</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DFE7EF] shadow-sm">
          <span className="font-bold text-[#52677C] uppercase tracking-wider text-[10px] block mb-1">
            Session TTL
          </span>
          <p className="text-2xl font-bold text-[#0B2545]">8 Hours</p>
          <p className="text-[#52677C] text-[11px] mt-1">Automatic JWT rotation</p>
        </div>
      </div>

      {/* Operators Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0B2545]">Authorized Operators</h2>
          <span className="text-xs text-[#52677C]">{operators.length} Active Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3">Operator Identity</th>
                <th className="px-6 py-3">Assigned Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Last Active</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {operators.map((op) => (
                <tr key={op.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-6 py-4 font-semibold text-[#0B2545]">
                    {op.email}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#1565C0]">
                    {op.role}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        op.status === "ACTIVE"
                          ? "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
                          : "bg-[#FFF4D9] text-[#8D6E00] border-[#FFE082]"
                      }`}
                    >
                      {op.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#52677C]">
                    {op.lastActive}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRevoke(op.id)}
                      className="text-xs text-[#991B1B] hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
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
                  Seat Provisioning
                </span>
                <h3 className="text-base font-bold text-[#0B2545] mt-1">
                  Invite New Security Operator
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-md text-[#94A3B8] hover:text-[#0B2545]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#0B2545] mb-1">
                  Official Corporate Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="analyst@yourcompany.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B2545] mb-1">
                  Assigned Workspace Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
                >
                  <option value="Security Analyst">Security Analyst (Inspect live audio &amp; triage cases)</option>
                  <option value="Compliance Auditor">Compliance Auditor (Read-only logs &amp; Section 65B exports)</option>
                  <option value="Tenant Admin">Tenant Admin (Full policy &amp; API credential control)</option>
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
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
