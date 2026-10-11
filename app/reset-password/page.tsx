"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, KeyRound, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
      router.push("/app");
    } catch (err: any) {
      setError(err?.message || "Failed to update password.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-[#DFE7EF] p-8 space-y-6">
      <div>
        <div className="w-12 h-12 rounded-xl bg-[#E7F3FF] text-[#1565C0] flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Set New Password</h1>
        <p className="text-sm text-[#52677C] mt-1">
          Choose a strong password to protect your security operator credentials.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[#FCEAF3] border border-[#F8BBD0] text-[#991B1B] rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1.5">
            New Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0B2545] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1.5">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-type password"
            className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0B2545] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#0B2545] hover:bg-[#1565C0] text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update &amp; Enter Workspace</span>}
        </button>
      </form>
    </div>
  );
}
