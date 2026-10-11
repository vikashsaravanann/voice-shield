import { AlertSettings } from "@/components/AlertSettings";

export default function WorkspaceAlertsPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Alert Center &amp; Policies</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Configure notification thresholds, Twilio SMS recipients, and webhook destinations for synthetic alerts.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm max-w-2xl">
        <AlertSettings />
      </div>
    </div>
  );
}
