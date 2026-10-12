"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, ShieldCheck, CheckCircle2, AlertTriangle, Loader2, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    environment: "Twilio Voice Media Streams",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.organization.trim()) {
      setError("Please complete your name, corporate email, and organization.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }
      setSubmittedTicket({ id: data.ticketId, message: data.message });
    } catch (err: any) {
      setError(err.message || "Failed to send consultation request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct Engagement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight">
              Schedule a Technical Consultation
            </h1>
            <p className="text-base text-[#52677C] leading-relaxed">
              Discuss your telephony volume, network architecture, and regulatory mandates with our security engineering staff.
            </p>

            <div className="pt-6 space-y-4 text-sm text-[#0B2545]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F7F9FC] border border-[#CBD5E1] flex items-center justify-center text-[#1565C0]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#52677C]">Official Inquiries</p>
                  <p className="font-bold">contact@logicintelligencetechnologies.in</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F7F9FC] border border-[#CBD5E1] flex items-center justify-center text-[#1565C0]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#52677C]">Headquarters</p>
                  <p className="font-bold">Logic Intelligence Technologies, India</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#E7F3FF] border border-[#BBDEFB] text-xs text-[#1565C0] space-y-1">
              <p className="font-bold">Enterprise Pilot Availability</p>
              <p className="text-[#1565C0]/90">
                Direct integration reviews are conducted under standard non-disclosure agreements with isolated proof-of-concept carrier sandboxes.
              </p>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-[#F7F9FC] p-8 sm:p-10 rounded-3xl border border-[#DFE7EF] shadow-sm">
            {submittedTicket ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E7F7EF] text-[#065F46] flex items-center justify-center mx-auto border border-[#A7F3D0]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-[#0B2545]">Consultation Request Received</h2>
                <p className="text-sm text-[#52677C] max-w-md mx-auto">
                  {submittedTicket.message}
                </p>
                <div className="inline-block p-3 rounded-xl bg-white border border-[#DFE7EF] font-mono text-xs text-[#0B2545] font-bold">
                  Reference: {submittedTicket.id}
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setForm({ name: "", email: "", organization: "", environment: "Twilio Voice Media Streams", message: "" });
                    }}
                    className="text-xs font-bold text-[#1565C0] hover:underline"
                  >
                    Submit another technical inquiry
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#0B2545] mb-2">Enterprise Inquiry Form</h2>
                <p className="text-xs text-[#52677C] mb-6">All information is treated in accordance with our strict enterprise privacy commitments.</p>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-[#FCEAF3] border border-[#F8BBD0] text-xs text-[#991B1B] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">
                        Full Name <span className="text-[#991B1B]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Alex Taylor"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0B2545] focus:ring-2 focus:ring-[#1565C0] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">
                        Corporate Email <span className="text-[#991B1B]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0B2545] focus:ring-2 focus:ring-[#1565C0] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">
                      Organization / Financial Institution <span className="text-[#991B1B]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                      placeholder="Apex National Bank"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0B2545] focus:ring-2 focus:ring-[#1565C0] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">
                      Telephony Environment
                    </label>
                    <select
                      value={form.environment}
                      onChange={(e) => setForm({ ...form, environment: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0B2545] focus:ring-2 focus:ring-[#1565C0] outline-none"
                    >
                      <option>Twilio Voice Media Streams</option>
                      <option>Carrier SIP Trunking (SBC / SIPREC)</option>
                      <option>FreeSWITCH / Asterisk PBX</option>
                      <option>Custom WebRTC / Mobile App</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">
                      Project Scope / Security Inquiries
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your contact center scale, concurrent call volume, and deployment requirements..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-sm text-[#0B2545] focus:ring-2 focus:ring-[#1565C0] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Consultation Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Consultation Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
