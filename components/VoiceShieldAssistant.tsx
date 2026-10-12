"use client";

import { FormEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, Send, X, Shield, Sparkles, Terminal } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const welcome: Message = {
  role: "assistant",
  content:
    "Welcome to VoiceShield Assistant. I provide technical and architectural guidance on real-time voice spoofing detection, AASIST models, forensic reporting, and enterprise telephony integration.\n\nHow can I help you today?",
};

const QUICK_PROMPTS = [
  "How does AASIST detection work?",
  "Real-time architecture & latency",
  "DPDP Act 2023 compliance",
  "Telephony & SIP integration",
];

export function VoiceShieldAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitQuery(content: string) {
    if (!content || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      });
      const result = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !result.answer) {
        throw new Error(result.error || "The VoiceShield assistant is temporarily unavailable.");
      }
      setMessages((current) => [...current, { role: "assistant", content: result.answer! }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Connection failed.");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    await submitQuery(input.trim());
  }

  // Do not obscure authentication / recovery / verification forms
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/verify-email";
  if (isAuthRoute) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <section className="relative mb-4 flex h-[min(650px,calc(100vh-120px))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[2rem] border border-brand-500/30 bg-[#071019]/95 shadow-2xl shadow-brand-950/60 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-brand-400/10" />
          <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full border border-cyan-400/10" />
          <header className="relative flex items-center justify-between border-b border-brand-500/20 bg-brand-950/35 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-brand-400/70 bg-[#06111a] p-1 shadow-[0_0_22px_rgba(16,185,129,0.25)]">
                <span className="absolute inset-1 rounded-full border border-cyan-300/30" />
                <img src="/logo.png" alt="VoiceShield Logo" className="w-full h-full object-cover" />
                <div className="absolute -right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-[#071019] bg-brand-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-wide text-white">VOICESHIELD ASSISTANT</h2>
                <div className="flex items-center gap-2 mt-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-300">
                  <Shield size={10} /> Acoustic Defense
                  <span className="text-slate-600">•</span>
                  <Terminal size={10} /> Architecture
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-brand-400 hover:bg-brand-500/10 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 custom-scrollbar">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-sm bg-gradient-to-r from-brand-600 to-teal-600 text-white shadow-lg shadow-brand-600/20"
                      : "rounded-bl-sm border border-slate-700/50 bg-slate-800/80 text-slate-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="pt-2">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-brand-400" /> Suggested topics:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      disabled={loading}
                      onClick={() => submitQuery(prompt)}
                      className="rounded-lg border border-slate-700/70 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-300 hover:border-brand-400/50 hover:bg-brand-500/10 hover:text-white transition disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-brand-500/20 bg-brand-500/5 px-4 py-3 text-xs font-mono text-brand-400">
                  <Loader2 size={14} className="animate-spin" /> Analyzing security architecture...
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
                <X size={14} className="text-rose-400" /> {error}
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-brand-500/20 bg-slate-900/50 p-4">
            <div className="flex items-end gap-2 rounded-xl border border-slate-700 bg-slate-950 p-2 focus-within:border-brand-400/60 focus-within:ring-1 focus-within:ring-brand-400/30 transition-all">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={loading}
                rows={2}
                maxLength={4000}
                placeholder="Ask about VoiceShield architecture, detection, or compliance..."
                className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-white outline-none placeholder:text-slate-500 font-sans"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="rounded-lg bg-gradient-to-r from-brand-500 to-teal-500 p-2.5 text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 shadow-lg shadow-brand-500/20"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between px-1">
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500">VoiceShield Security</p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Zero-LLM Hot Path</p>
            </div>
          </form>
        </section>
      )}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open VoiceShield AI assistant"
          className="group relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-brand-400/80 bg-[#06111a] p-1.5 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-200 hover:scale-105 hover:border-brand-300 hover:shadow-[0_0_38px_rgba(16,185,129,0.48)] active:scale-95 overflow-hidden"
        >
          <span className="absolute inset-1 rounded-full border border-cyan-300/35 transition-transform duration-300 group-hover:scale-105" />
          <span className="absolute inset-2 rounded-full border border-brand-400/20" />
          <span className="absolute inset-0 rounded-full bg-brand-400/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <img src="/logo.png" alt="" className="relative z-10 h-full w-full rounded-full object-cover" />
          <div className="absolute right-0.5 top-0.5 z-20 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#06111a] bg-brand-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]">
            <span className="absolute inline-flex h-full w-full rounded-full bg-brand-300 opacity-60" />
          </div>
        </button>
      )}
    </div>
  );
}
