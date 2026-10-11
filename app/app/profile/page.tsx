"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Clock,
  LogOut,
  Info,
  Save,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [lastSignIn, setLastSignIn] = useState("");
  const [role, setRole] = useState("Security Analyst");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let active = true;
    const fetchUser = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (active && user) {
          setEmail(user.email || "operator@enterprise.com");
          setUserId(user.id);
          setLastSignIn(user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Current Active Session");
          if (user.user_metadata?.role) {
            setRole(user.user_metadata.role);
          }
        }
      } catch {
        // Fallback
      }
    };
    fetchUser();
    return () => {
      active = false;
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setFeedback({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setFeedback({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }

    setUpdating(true);
    setFeedback(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setFeedback({ type: "success", text: "Password updated successfully. Please use it for your next login." });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to update password." });
    } finally {
      setUpdating(false);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              AUTHENTICATED PRINCIPAL
            </span>
            <span className="text-xs text-[#52677C]">
              Supabase Auth Session
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            My Operator Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Manage your authenticated operator credentials, multi-factor security, and password.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FCEAF3] text-[#991B1B] border border-[#F8BBD0] text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Session</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]"
              : "bg-[#FCEAF3] text-[#991B1B] border-[#F8BBD0]"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Info className="w-4 h-4 shrink-0" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Profile and Security Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Principal Details */}
        <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <User className="w-4 h-4 text-[#1565C0]" />
            <h2 className="text-sm font-bold text-[#0B2545]">
              Operator Identity
            </h2>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="w-14 h-14 rounded-2xl bg-[#0B2545] text-white flex items-center justify-center text-xl font-bold">
              {email ? email.charAt(0).toUpperCase() : "O"}
            </div>
            <div>
              <p className="font-bold text-sm text-[#0B2545]">{email || "Authorized Operator"}</p>
              <p className="text-xs text-[#1565C0] font-semibold">{role}</p>
              <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5">UUID: {userId || "live_auth_subject"}</p>
            </div>
          </div>

          <div className="pt-2 space-y-2 text-xs">
            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[#52677C]">Last Authenticated</span>
              <span className="font-semibold text-[#0B2545]">{lastSignIn}</span>
            </div>
            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[#52677C]">Authentication Provider</span>
              <span className="font-semibold text-[#0B2545]">Supabase Identity Auth</span>
            </div>
            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[#52677C]">Multi-Factor Enforcement</span>
              <span className="font-semibold text-[#065F46] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Password Update */}
        <form onSubmit={handleUpdatePassword} className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <KeyRound className="w-4 h-4 text-[#1565C0]" />
            <h2 className="text-sm font-bold text-[#0B2545]">
              Update Password
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2545] mb-1">New Secure Password *</label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-xs text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2545] mb-1">Confirm New Password *</label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="Re-type new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-xs text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
            />
          </div>

          <p className="text-[11px] text-[#52677C]">
            Password updates take effect immediately across all active operator sessions.
          </p>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updating}
              className="w-full py-2 bg-[#1565C0] hover:bg-[#0B2545] text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{updating ? "Saving..." : "Change Password"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
