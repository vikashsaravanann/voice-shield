"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

interface AuthCardProps {
  initialMode?: "login" | "signup";
  title?: string;
  subtitle?: string;
}

function AuthCardInner({
  initialMode = "login",
  title,
  subtitle,
}: AuthCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawReturnTo = searchParams.get("returnTo") || "/app";
  // Prevent open redirect: returnTo must start with / and not //
  const returnTo = rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//")
    ? rawReturnTo
    : "/app";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();

      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message || "Invalid email or password.");
          setLoading(false);
          return;
        }
        router.push(returnTo);
        router.refresh();
      } else {
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(
              returnTo
            )}`,
          },
        });
        if (signUpError) {
          setError(signUpError.message || "Account creation failed. Please try again.");
          setLoading(false);
          return;
        }
        if (data?.session) {
          router.push(returnTo);
          router.refresh();
        } else {
          setMessage("Account created! Please check your email for verification link.");
          setLoading(false);
        }
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please verify credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#DFE7EF] p-6 sm:p-8 relative">
      {/* Card Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
            <Lock className="w-3 h-3 text-[#1565C0]" />
            <span>Operator Access</span>
          </span>
          <span className="text-xs font-medium text-[#52677C]">
            {mode === "login" ? "Verified Session" : "New Registration"}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B2545] tracking-tight">
          {title || (mode === "login" ? "Sign in to VoiceShield" : "Create Security Seat")}
        </h2>
        <p className="text-xs sm:text-sm text-[#52677C] mt-1">
          {subtitle ||
            (mode === "login"
              ? "Access real-time voice telemetry, forensics, and detection logs."
              : "Set up your enterprise operator credential to begin monitoring.")}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg mb-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
            setMessage(null);
          }}
          className={`py-2 rounded-md transition-all ${
            mode === "login"
              ? "bg-white text-[#0B2545] shadow-sm font-bold"
              : "text-[#52677C] hover:text-[#0B2545]"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
            setMessage(null);
          }}
          className={`py-2 rounded-md transition-all ${
            mode === "signup"
              ? "bg-white text-[#0B2545] shadow-sm font-bold"
              : "text-[#52677C] hover:text-[#0B2545]"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div
          role="alert"
          className="mb-4 p-3 bg-[#FCEAF3] border border-[#F8BBD0] text-[#991B1B] rounded-lg text-xs flex items-start gap-2.5 animate-in fade-in-50"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div
          role="status"
          className="mb-4 p-3 bg-[#E7F7EF] border border-[#A7F3D0] text-[#065F46] rounded-lg text-xs flex items-start gap-2.5 animate-in fade-in-50"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="auth-email"
            className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1.5"
          >
            Operator Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@enterprise.com"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0B2545] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-[#1565C0] transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="auth-password"
              className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider"
            >
              Password
            </label>
            {mode === "login" && (
              <Link
                href="/forgot-password"
                className="text-xs text-[#1565C0] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0B2545] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:border-[#1565C0] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0B2545] hover:bg-[#1565C0] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : mode === "login" ? (
            <>
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Register Workspace Seat</span>
              <ShieldCheck className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-center text-xs text-[#52677C]">
        <p>
          Protected by VoiceShield tenant isolation & cryptographic auth.
        </p>
        <p className="mt-1 text-[11px]">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-[#1565C0] hover:underline">
            Terms
          </Link>{" "}
          &amp;{" "}
          <Link href="/privacy" className="text-[#1565C0] hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export function AuthCard(props: AuthCardProps) {
  return (
    <React.Suspense fallback={<div className="w-full max-w-md bg-white rounded-2xl p-8 border border-[#DFE7EF] h-96 animate-pulse" />}>
      <AuthCardInner {...props} />
    </React.Suspense>
  );
}
