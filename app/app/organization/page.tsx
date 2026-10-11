import type { Metadata } from "next";
import { Users, Building2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Organization & Multi-Tenant Management | VoiceShield",
  description: "Enterprise workspace tenant settings and organization identity.",
};

export default function OrganizationPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Organization Profile</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Tenant boundaries, organizational identifiers, and primary enterprise compliance contacts.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm max-w-2xl space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">Organization Name</label>
          <input type="text" readOnly value="Enterprise Security Operations Desk" className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-sm text-[#0B2545]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#0B2545] uppercase tracking-wider mb-1">Tenant ID</label>
          <input type="text" readOnly value="org_vs_enterprise_primary" className="w-full font-mono text-xs px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-[#0B2545]" />
        </div>
      </div>
    </div>
  );
}
