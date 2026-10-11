import type { Metadata } from "next";
import { User, Lock, KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Operator Profile & Credentials | VoiceShield",
  description: "Individual analyst security settings and authentication factors.",
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Operator Profile</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Manage your operator credentials, multi-factor authentication, and notification preferences.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm max-w-xl space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">Email Address</label>
          <input type="email" readOnly value="analyst@enterprise.com" className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-sm text-[#0B2545]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">Designation</label>
          <input type="text" readOnly value="Lead Voice Security Analyst" className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-sm text-[#0B2545]" />
        </div>
      </div>
    </div>
  );
}
