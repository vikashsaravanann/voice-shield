import type { Metadata } from "next";
import Link from "next/link";
import { PhoneCall, Building2, Landmark, ShieldAlert, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Use Cases | VoiceShield",
  description: "Enterprise applications of VoiceShield across banking, contact centers, law enforcement, and executive defense.",
};

const CASES = [
  {
    icon: Landmark,
    title: "Financial Services & Wire Authorizations",
    scenario: "Attackers clone high-net-worth client voices to authorize urgent offshore fund transfers.",
    solution: "VoiceShield intercepts the incoming call via SIP media stream, flags robotic prosodic artifacts in 85ms, and notifies the compliance officer."
  },
  {
    icon: PhoneCall,
    title: "Contact Center Inbound Verification",
    scenario: "Fraud rings deploy automated TTS bots to compromise customer service representatives and bypass voice PINs.",
    solution: "In-line DSP evaluation identifies synthetic glottal waveforms and issues an automated dynamic challenge phrase in the caller's regional language."
  },
  {
    icon: Building2,
    title: "Executive & VIP Defense",
    scenario: "Adversaries generate synthetic WhatsApp voice notes impersonating CEOs to manipulate junior employees into revealing credentials.",
    solution: "Employees upload audio files to the VoiceShield Forensic Lab for rapid multi-model verification and Section 65B certificate generation."
  },
  {
    icon: ShieldAlert,
    title: "Cybercrime & Forensic Law Enforcement",
    scenario: "Police and investigative agencies require evidence that digital extortion calls used generative synthetic models.",
    solution: "VoiceShield generates cryptographic chain-of-custody reports with spectrogram heatmaps and model confidence intervals for court presentation."
  }
];

export default function UseCasesPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>Mission Deployments</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Where VoiceShield Defends the Wire
          </h1>
          <p className="text-base text-[#52677C] leading-relaxed">
            Practical scenarios showing how enterprise security teams deploy VoiceShield to safeguard vulnerable communications channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CASES.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="p-8 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF] hover:border-[#1565C0] hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#1565C0] mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0B2545] mb-3">{c.title}</h3>
                  <div className="space-y-3 text-sm text-[#52677C] mb-6">
                    <p><strong className="text-[#0B2545]">Threat Vector:</strong> {c.scenario}</p>
                    <p><strong className="text-[#0B2545]">VoiceShield Defense:</strong> {c.solution}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href="/demo" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#1565C0] text-white font-semibold text-sm transition-colors">
            <span>Test a Simulated Incident</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
