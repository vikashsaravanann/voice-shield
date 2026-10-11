import type { Metadata } from "next";
import { Bell, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Notification Feed | VoiceShield SOC",
  description: "Real-time dispatch history of synthetic voice alerts and system notices.",
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Notification Feed</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          System alerts and high-confidence voice spoofing events dispatched to operators.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm space-y-3">
        <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#991B1B] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[#0B2545]">Inbound Call Flagged: Risk Score 0.94</p>
            <p className="text-xs text-[#52677C] mt-0.5">Caller +91 98201 XXXXX matched XTTS synthetic voice profile. Challenge prompt issued.</p>
            <p className="text-[10px] text-[#94A3B8] mt-1">15 mins ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
