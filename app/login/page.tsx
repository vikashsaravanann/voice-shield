"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Radio,
  Cpu,
  Fingerprint,
  Award,
  KeyRound,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

type AuthMode = "in" | "up" | "reset";
type Message = { type: "error" | "success"; text: string } | null;

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
      <path fill="#4285F4" d="M21.35 12.23c0-.7-.06-1.38-.18-2.03H12v3.84h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.2Z" />
      <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.75 9.75 0 0 0 12 21.75Z" />
      <path fill="#FBBC05" d="M6.53 13.84a5.86 5.86 0 0 1 0-3.68V7.63H3.28a9.75 9.75 0 0 0 0 8.74l3.25-2.53Z" />
      <path fill="#EA4335" d="M12 6.13c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 3.17 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.72 5.38l3.25 2.53C7.3 7.85 9.46 6.13 12 6.13Z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-current">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<AuthMode>("in");
  const [message, setMessage] = useState<Message>(null);
  const [busy, setBusy] = useState<"email" | "google" | "github" | "demo" | null>(null);
  const [callbackError, setCallbackError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const isReset = mode === "reset";
  const isSignUp = mode === "up";
  const appOrigin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (!error) return;

    const code = params.get("error_code");
    const description = params.get("error_description");
    const normalized = `${code ?? ""} ${description ?? ""}`.toLowerCase();

    if (normalized.includes("provider") && normalized.includes("disabled")) {
      setCallbackError("This sign-in provider is disabled in Supabase. Enable Google or GitHub under Authentication → Providers.");
    } else if (normalized.includes("redirect") || normalized.includes("url")) {
      setCallbackError("The OAuth redirect URL is not registered. Add this exact URL to Supabase Auth URL Configuration: https://voiceshield.logicintelligencetechnologies.in/auth/callback");
    } else if (error === "access_denied") {
      setCallbackError("Sign-in was cancelled. Choose an account and approve access to continue.");
    } else if (description) {
      setCallbackError(description.replace(/\+/g, " "));
    } else {
      setCallbackError("We could not complete sign-in. Please try again.");
    }
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("email");
    setMessage(null);

    try {
      const result = isReset
        ? await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${appOrigin}/auth/callback?next=/dashboard`,
          })
        : isSignUp
          ? await supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: `${appOrigin}/auth/callback` },
            })
          : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        setMessage({ type: "error", text: result.error.message });
      } else if (isReset) {
        setMessage({ type: "success", text: "Security reset link dispatched. Please check your inbox." });
      } else if (isSignUp && !("session" in result.data && result.data.session)) {
        setMessage({ type: "success", text: "Clearance requested. Please check your email to confirm registration." });
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to connect to the authentication service.",
      });
    } finally {
      setBusy(null);
    }
  }

  async function signInWithProvider(provider: "google" | "github") {
    setBusy(provider);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${appOrigin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      setMessage({ type: "error", text: error.message });
      setBusy(null);
    }
  }

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-[#F7F9FC] text-[#121826] flex flex-col justify-center p-3 sm:p-6 font-sans selection:bg-blue-500 selection:text-white relative">
      
      {/* ── Top Navigation Bar with Generous Breathing Space ── */}
      <header className="relative z-10 max-w-7xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 pb-6 sm:pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold tracking-widest whitespace-nowrap text-[#475569] hover:text-[#1565C0] hover:border-slate-300 uppercase transition-all duration-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO OVERVIEW</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] font-mono text-[#1565C0] font-bold tracking-wider uppercase whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>PORTAL: TLS-ENCRYPTED SESSION</span>
          </div>
        </div>
      </header>

      {/* ── Main Two-Column Layout with Wide Gaps & Strong Hierarchy ── */}
      <main id="main" className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-2">
        
        {/* Left Column: Security Narrative & Identity */}
        <div className="hidden lg:block lg:col-span-6 space-y-4">
          
          {/* Brand Header */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1565C0] shadow-sm group-hover:border-blue-400 transition-all duration-300">
                <Shield className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black tracking-wider text-[#0B2545] uppercase group-hover:text-[#1565C0] transition-colors">
                    VOICESHIELD
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest bg-blue-50 text-[#1565C0] border border-blue-200 uppercase">
                    VoiceShield
                  </span>
                </div>
                <div className="text-[10px] font-mono tracking-widest text-[#64748B] uppercase">
                  LOGIC INTELLIGENCE TECHNOLOGIES
                </div>
              </div>
            </Link>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B2545] tracking-tight leading-[1.15] uppercase">
              OPERATOR CLEARANCE &amp; SOC THREAT PORTAL
            </h1>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal max-w-xl">
              Defense-grade gateway for telecom carriers, banking fraud investigators, and law enforcement analysts monitoring synthetic audio impersonation in live call streams.
            </p>
          </div>

          {/* Security Architecture Highlights with Generous Gaps */}
          <div className="space-y-4 pt-2">
            
            <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-colors">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[#1565C0] shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xs font-mono font-bold text-[#0B2545] uppercase tracking-wider">
                  LOW-LATENCY MITIGATION · 300 MS TARGET
                </h2>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Extracts 250ms sliding window audio tensors to detect vocoder phase anomalies before caller fund transfer authorization.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-colors">
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100 text-[#0D9488] shrink-0">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xs font-mono font-bold text-[#0B2545] uppercase tracking-wider">
                  DPDP ACT 2023 ZERO-RETENTION
                </h2>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Audio tensors live exclusively in volatile RAM ring buffers. Zero raw waveforms written to NVMe/SSD storage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-colors">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[#1565C0] shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xs font-mono font-bold text-[#0B2545] uppercase tracking-wider">
                  8 KHZ TELEPHONY RESILIENT
                </h2>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Tested against narrowband G.711 / AMR compression codecs with multilingual active challenge verification gates.
                </p>
              </div>
            </div>

          </div>

          {/* Statutory Credentials Footer */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-[11px] font-mono text-[#64748B] uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-[#1565C0]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>AES-256-GCM</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#0D9488]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>TLS 1.3 WSS</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#065F46]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ZERO RAW-AUDIO RETENTION</span>
            </span>
          </div>

        </div>

        {/* Right Column: High-Grade Authentication Card */}
        <div className="lg:col-span-6 w-full max-w-lg mx-auto">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl space-y-4 relative">
            
            {/* Primary OAuth Sign In Options (Open to Any Gmail / GitHub) */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#0B2545]">
                  <span>OPEN OPERATOR ACCESS</span>
                  <span className="text-[10px] text-[#1565C0]">NO DOMAIN RESTRICTIONS</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Full-width Google Login Button */}
                <button
                  type="button"
                  onClick={() => signInWithProvider("google")}
                  disabled={busy !== null}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-sm active:scale-95 disabled:opacity-50 text-[#0B2545] group"
                >
                  <GoogleIcon />
                  <span className="group-hover:text-[#1565C0] transition-colors">
                    CONTINUE WITH GOOGLE (ANY GMAIL)
                  </span>
                </button>

                {/* Full-width GitHub Login Button */}
                <button
                  type="button"
                  onClick={() => signInWithProvider("github")}
                  disabled={busy !== null}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-sm active:scale-95 disabled:opacity-50 text-[#0B2545] group"
                >
                  <GithubIcon />
                  <span className="group-hover:text-[#1565C0] transition-colors">
                    CONTINUE WITH GITHUB
                  </span>
                </button>
              </div>

              {/* Clearance Guarantee Banner */}
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-[11px] font-mono text-[#1565C0] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1565C0] shrink-0 mt-0.5" />
                <span>
                  All authenticated Google &amp; GitHub accounts receive instantaneous clearance to the SOC Dashboard, Live Voice Streamer, Forensic FIR Reports, and Telephony Controls.
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] font-mono uppercase tracking-widest text-[#64748B]">
                <span className="bg-white px-3">OR USE EMAIL CREDENTIALS</span>
              </div>
            </div>

            {/* Form Mode Tabs with Clear Visual State */}
            <div className="space-y-3">
              <div role="group" aria-label="Authentication mode" className="flex rounded-xl bg-[#F7F9FC] p-1.5 border border-slate-200 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => { setMode("in"); setMessage(null); }}
                  aria-pressed={mode === "in"}
                  className={`flex-1 py-2 rounded-lg font-bold tracking-wider uppercase transition-all duration-200 ${
                    mode === "in"
                      ? "bg-white text-[#1565C0] border border-slate-200 shadow-sm"
                      : "text-[#64748B] hover:text-[#0B2545]"
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("up"); setMessage(null); }}
                  aria-pressed={mode === "up"}
                  className={`flex-1 py-2 rounded-lg font-bold tracking-wider uppercase transition-all duration-200 ${
                    mode === "up"
                      ? "bg-white text-[#1565C0] border border-slate-200 shadow-sm"
                      : "text-[#64748B] hover:text-[#0B2545]"
                  }`}
                >
                  REGISTER
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("reset"); setMessage(null); }}
                  aria-pressed={mode === "reset"}
                  className={`flex-1 py-2 rounded-lg font-bold tracking-wider uppercase transition-all duration-200 ${
                    mode === "reset"
                      ? "bg-white text-[#1565C0] border border-slate-200 shadow-sm"
                      : "text-[#64748B] hover:text-[#0B2545]"
                  }`}
                >
                  RESET
                </button>
              </div>
            </div>

            {/* Error or Success Alert */}
            {message && (
              <div
                role={message.type === "error" ? "alert" : "status"}
                className={`p-4 rounded-xl text-xs font-mono flex items-start gap-3 border ${
                  message.type === "error"
                    ? "bg-[#FEE2E2] border-rose-200 text-[#991B1B]"
                    : "bg-[#E7F7EF] border-emerald-200 text-[#065F46]"
                }`}
              >
                {message.type === "error" ? (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#991B1B]" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#065F46]" />
                )}
                <span className="leading-relaxed">{message.text}</span>
              </div>
            )}

            {callbackError && !message && (
              <div role="alert" className="p-4 rounded-xl text-xs font-mono bg-[#FEE2E2] border border-rose-200 text-[#991B1B] flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-[#991B1B] shrink-0" />
                <span>{callbackError}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-[11px] font-mono tracking-widest text-[#475569] uppercase font-bold">
                  Operator Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    id="login-email"
                    autoComplete="email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F7F9FC] border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-sm text-[#0B2545] placeholder-slate-400 focus:outline-none focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] transition-all"
                    placeholder="operator@voiceshield.in"
                  />
                </div>
              </div>

              {!isReset && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <label htmlFor="login-password" className="font-bold text-[#475569] uppercase tracking-wider">PASSWORD</label>
                    <button
                      type="button"
                      onClick={() => setMode("reset")}
                      className="text-[#64748B] hover:text-[#1565C0] uppercase tracking-wider text-[10px] transition-colors"
                    >
                      FORGOT PASSWORD?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="login-password"
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 bg-[#F7F9FC] text-[#0B2545] placeholder:text-slate-400 font-mono text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1565C0] focus:border-[#1565C0] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={busy !== null}
                className="
                  w-full py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#1565C0]
                  text-white font-mono font-black text-xs tracking-widest uppercase transition-all
                  shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 mt-2
                "
              >
                {busy === "email" ? (
                  <>
                    <Loader2 className="w-4 h-4 motion-safe:animate-spin" aria-hidden="true" />
                    <span>AUTHENTICATING OPERATOR...</span>
                  </>
                ) : (
                  <span>
                    {isReset ? "DISPATCH RESET LINK" : isSignUp ? "REQUEST OPERATOR CLEARANCE" : "AUTHENTICATE SESSION"}
                  </span>
                )}
              </button>
            </form>

            {/* Legal & Policy Direct Links with Clear Spacing */}
            <div className="pt-4 border-t border-slate-100 text-center space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#64748B]">
                <Link href="/privacy" className="hover:text-[#1565C0] uppercase transition-colors underline-offset-4 hover:underline">
                  PRIVACY POLICY
                </Link>
                <span className="text-slate-300">·</span>
                <Link href="/terms" className="hover:text-[#1565C0] uppercase transition-colors underline-offset-4 hover:underline">
                  TERMS OF SERVICE
                </Link>
                <span className="text-slate-300">·</span>
                <Link href="/docs" className="hover:text-[#1565C0] uppercase transition-colors underline-offset-4 hover:underline">
                  SECURITY DOCS
                </Link>
              </div>
              <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-widest">
                DESIGNED FOR DPDP ACT 2023 ALIGNMENT
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* ── Footer Bar with Generous Spacing ── */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto text-center pt-2 pb-2 border-t border-slate-200 text-[10px] font-mono text-[#64748B] uppercase tracking-widest space-y-1">
        <div>VOICESHIELD · LOGIC INTELLIGENCE TECHNOLOGIES · TLS ENCRYPTED IN TRANSIT</div>
        <div className="text-[#64748B]">ZERO RAW AUDIO DISK RETENTION BY DESIGN</div>
      </footer>

    </div>
  );
}
