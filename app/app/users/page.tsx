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
  Loader2,
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
      lastActive: "Active Session",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OperatorSeat["role"]>("Security Analyst");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchCurrent = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (active && user?.email) {
          const isSuperAdmin = user.email.toLowerCase() === "createwithvikash@gmail.com";
          
          // Load stored invited operators if any
          let storedOperators: OperatorSeat[] = [];
          try {
            const raw = localStorage.getItem("vs_invited_operators");
            if (raw) storedOperators = JSON.parse(raw);
          } catch {
            // Ignore
          }

          const currentOperator: OperatorSeat = {
            id: user.id,
            email: user.email,
            role: isSuperAdmin ? "Tenant Admin" : "Security Analyst",
            status: "ACTIVE",
            lastActive: "Now",
          };

          const combined = [
            currentOperator,
            ...storedOperators.filter((o) => o.email !== user.email),
          ];

          // Ensure createwithvikash@gmail.com is present as Tenant Admin
          if (!combined.some((o) => o.email.toLowerCase() === "createwithvikash@gmail.com")) {
            combined.push({
              id: "op-super-admin",
              email: "createwithvikash@gmail.com",
              role: "Tenant Admin",
              status: "ACTIVE",
              lastActive: "Now",
            });
          }

          setOperators(combined);
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

    setLoading(true);
    const newSeat: OperatorSeat = {
      id: `op-${Date.now()}`,
      email: inviteEmail.trim().toLowerCase(),
      role: inviteRole,
      status: "INVITED",
      lastActive: "Pending Accept",
    };

    setOperators((prev) => {
      const updated = [newSeat, ...prev];
      try {
        localStorage.setItem("vs_invited_operators", JSON.stringify(updated.filter((o) => o.status === "INVITED")));
      } catch {
        // Ignore
      }
      return updated;
    });

    setModalOpen(false);
    setInviteEmail("");
    setSuccessMsg(`Operator seat invitation dispatched to ${newSeat.email} with ${newSeat.role} privileges.`);
    setLoading(false);
    setTimeout(() => setSuccessMsg(""), 4500);
  };

  const handleRevokeSeat = (id: string, email: string) => {
    if (email.toLowerCase() === "createwithvikash@gmail.com") {
      alert("Super Admin seat cannot be revoked.");
      return;
    }
    if (!window.confirm(`Revoke operator access for ${email}?`)) return;
    setOperators((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem("vs_invited_operators", JSON.stringify(filtered.filter((o) => o.status === "INVITED")));
      } catch {
        // Ignore
      }
      return filtered;
    });
    setSuccessMsg(`Operator seat for ${email} revoked.`);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              ROLE-BASED ACCESS CONTROL (RBAC)
            </span>
            <span className="text-xs text-[#52677C]">
              Tenant Scoped Seat Management
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Operator Seats &amp; Personnel
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Provision authorized analysts, manage multi-factor authentication requirements, and audit tenant operators.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Operator</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#E7F7EF] border border-[#A7F3D0] text-xs text-[#065F46] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        </div>
      )}

      {/* Operators Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7EF] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F7F9FC]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B2545]">
            <UserCheck className="w-4 h-4 text-[#1565C0]" />
            <span>Assigned Tenant Operators ({operators.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9FC] text-[#52677C] font-bold border-b border-[#DFE7EF]">
              <tr>
                <th className="py-3 px-4">Operator Email</th>
                <th className="py-3 px-4">Role Privileges</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {operators.map((op) => (
                <tr key={op.id} className="hover:bg-[#F7F9FC] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0B2545]">
                    {op.email}
                    {op.email.toLowerCase() === "createwithvikash@gmail.com" && (
                      <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
                        SUPER ADMIN
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs text-[#0B2545] font-semibold">{op.role}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      op.status === "ACTIVE"
                        ? "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
                        : "bg-[#FFF4D9] text-[#8D6E00] border-[#FFE082]"
                    }`}>
                      {op.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#52677C]">{op.lastActive}</td>
                  <td className="py-3.5 px-4 text-right">
                    {op.email.toLowerCase() !== "createwithvikash@gmail.com" && (
                      <button
                        onClick={() => handleRevokeSeat(op.id, op.email)}
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
              <h3 className="font-bold text-sm text-[#0B2545]">Invite Operator Seat</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#52677C] hover:text-[#0B2545]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#0B2545] uppercase mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="analyst@enterprise.com"
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-xl text-xs text-[#0B2545] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B2545] uppercase mb-1">Assigned Privilege Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as OperatorSeat["role"])}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-xl text-xs text-[#0B2545] outline-none"
                >
                  <option value="Security Analyst">Security Analyst (Triage &amp; Evidence Review)</option>
                  <option value="Compliance Auditor">Compliance Auditor (Read-Only Section 65B)</option>
                  <option value="Tenant Admin">Tenant Admin (Full Management)</option>
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
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-bold transition-colors shadow-sm"
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
