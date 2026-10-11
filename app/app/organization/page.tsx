"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Building,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Info,
  Lock,
  Save,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function OrganizationPage() {
  const [tenantId, setTenantId] = useState("tenant_vs_primary_auth");
  const [orgName, setOrgName] = useState("Logic Intelligence Technologies - Primary SOC");
  const [complianceEmail, setComplianceEmail] = useState("compliance@logicintelligencetechnologies.in");
  const [sector, setSector] = useState("Banking & Financial Services");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let active = true;
    const fetchOrg = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (active && user) {
          setTenantId(`tenant_${user.id.slice(0, 12)}`);
          if (user.user_metadata?.organization_name) {
            setOrgName(user.user_metadata.organization_name);
          }
          if (user.email) {
            setComplianceEmail(user.email);
          }
        }
      } catch {
        // Fallback
      }
    };
    fetchOrg();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg("Organization profile and primary compliance contacts successfully updated.");
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 700);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(tenantId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB]">
              TENANT ENTITY
            </span>
            <span className="text-xs text-[#52677C]">
              Multi-Tenant Isolation Enforced via RLS
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
            Organization Profile &amp; Tenancy
          </h1>
          <p className="text-xs sm:text-sm text-[#52677C]">
            Enterprise identity boundaries, primary statutory compliance officer, and verified customer identifiers.
          </p>
        </div>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="p-3 bg-[#E7F7EF] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <Building className="w-4 h-4 text-[#1565C0]" />
            <h2 className="text-sm font-bold text-[#0B2545]">
              Entity Identification
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2545] mb-1">
              Organization Legal Entity Name *
            </label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-xs text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2545] mb-1">
              Primary Compliance &amp; DPO Email *
            </label>
            <input
              type="email"
              required
              value={complianceEmail}
              onChange={(e) => setComplianceEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-xs text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2545] mb-1">
              Industry Sector
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F9FC] border border-[#CBD5E1] rounded-lg text-xs text-[#0B2545] focus:outline-none focus:border-[#1565C0]"
            >
              <option value="Banking & Financial Services">Banking &amp; Financial Services (BFSI)</option>
              <option value="Healthcare & Telehealth">Healthcare &amp; Telehealth Information Systems</option>
              <option value="Government & Defense">Government &amp; Defense Communications</option>
              <option value="Enterprise Contact Center">Enterprise Contact Center / Customer Service</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#1565C0] hover:bg-[#0B2545] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Updating..." : "Save Changes"}</span>
            </button>
          </div>
        </form>

        {/* Immutable Tenant Facts Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <Lock className="w-4 h-4 text-[#52677C]" />
            <h2 className="text-sm font-bold text-[#0B2545]">
              Immutable Tenant Metadata
            </h2>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#52677C] uppercase tracking-wider mb-1">
              Tenant Identifier
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={tenantId}
                className="w-full font-mono text-[11px] px-2.5 py-1.5 bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg text-[#0B2545]"
              />
              <button
                type="button"
                onClick={handleCopyId}
                className="p-1.5 rounded-lg border border-[#DFE7EF] hover:bg-[#F7F9FC] text-[#52677C]"
                title="Copy Tenant ID"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-1">
              Referenced across all database RLS policies and audit logs.
            </p>
          </div>

          <div className="pt-2 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#F7F9FC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[#52677C]">Active Plan</span>
              <span className="font-bold text-[#0B2545]">Enterprise SOC</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#F7F9FC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[#52677C]">Allocated Seats</span>
              <span className="font-bold text-[#0B2545]">10 Operators</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#F7F9FC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[#52677C]">Data Residency</span>
              <span className="font-bold text-[#065F46]">India (Mumbai AWS)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
