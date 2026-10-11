import type { Metadata } from "next";
import { FileText, FileCheck2, Download, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Forensic Evidence & Sec 65B Reports | VoiceShield",
  description: "Tamper-evident legal certificates aligned with Section 65B Indian Evidence Act.",
};

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Forensic Reports &amp; Section 65B</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Cryptographically signed evidence packages admissible under Section 65B of the Indian Evidence Act.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm space-y-4">
        <div className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-xl border border-[#DFE7EF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E7F7EF] text-[#065F46] flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0B2545]">Section 65B Automated Evidentiary Template</p>
              <p className="text-xs text-[#52677C]">Includes machine hash, operator signature block, and uncorrupted system warranty.</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#0B2545] hover:bg-[#1565C0] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Generate Sample</span>
          </button>
        </div>
      </div>
    </div>
  );
}
