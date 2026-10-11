import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Enterprise Sales & Support | VoiceShield",
  description: "Connect with the VoiceShield technical team for enterprise proof-of-concept, telephony integration, or compliance inquiries.",
};

export default function ContactPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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
          </div>

          <div className="lg:col-span-7 bg-[#F7F9FC] p-8 sm:p-10 rounded-3xl border border-[#DFE7EF]">
            <h2 className="text-xl font-bold text-[#0B2545] mb-2">Enterprise Inquiry Form</h2>
            <p className="text-xs text-[#52677C] mb-6">All information is treated in accordance with our strict enterprise privacy commitments.</p>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">Full Name</label>
                  <input type="text" placeholder="Alex Taylor" className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B2545]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">Corporate Email</label>
                  <input type="email" placeholder="alex@company.com" className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B2545]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">Organization</label>
                <input type="text" placeholder="Apex National Bank" className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B2545]" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">Telephony Environment</label>
                <select className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B2545]">
                  <option>Twilio Voice Media Streams</option>
                  <option>Carrier SIP Trunking</option>
                  <option>FreeSWITCH / Asterisk PBX</option>
                  <option>Custom WebRTC / Mobile App</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">Project Scope / Message</label>
                <textarea rows={4} placeholder="Describe your contact center scale and security requirements..." className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-sm text-[#0B2545]" />
              </div>

              <button type="button" className="w-full py-3 bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm">
                Submit Consultation Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
