"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }
      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "Recovery request failed.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-[#DFE7EF] p-8 space-y-6">
      <div>
        <div className="w-12 h-12 rounded-xl bg-[#E7F3FF] text-[#1565C0] flex items-center justify-center mb-4">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Password Recovery</h1>
        <p className="text-sm text-[#52677C] mt-1">
          Enter your operator email and we will send instructions to reset your password.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[#FCEAF3] border border-[#F8BBD0] text-[#991B1B] rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#E7F7EF] border border-[#A7F3D0] text-[#065F46] text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>If an account exists for {email}, a recovery link has been dispatched.</span>
          </div>
          <Link
            href="/login"
            className="w-full block py-2.5 text-center text-sm font-semibold text-[#0B2545] bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1.5">
              Operator Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@enterprise.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0B2545] focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#0B2545] hover:bg-[#1565C0] text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Recovery Email</span>}
          </button>

          <div className="text-center pt-2">
            <Link href="/login" className="text-xs text-[#1565C0] hover:underline font-medium">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
