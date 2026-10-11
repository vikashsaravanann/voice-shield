import type { Metadata } from "next";
import { UserCheck, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Operator Seats & RBAC | VoiceShield SOC",
  description: "Manage security analyst logins, roles, and authorization boundaries.",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Operator Seats &amp; Roles</h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Authorized analysts permitted to view live audio telemetry and adjudicate fraud cases.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#DFE7EF] p-6 shadow-sm">
        <p className="text-xs text-[#52677C] mb-4">Role-Based Access Control (RBAC) enforced via Supabase Auth and PostgreSQL Row-Level Security.</p>
        <div className="p-4 bg-[#F7F9FC] rounded-xl border border-[#DFE7EF] flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#0B2545]">Active Operator Session</p>
            <p className="text-xs text-[#52677C]">Role: Lead Security Analyst • Permissions: Full Read &amp; Adjudicate</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F7EF] text-[#065F46] border border-[#A7F3D0]">
            ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}
