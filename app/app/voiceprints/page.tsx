import { VoiceprintVault } from "@/components/VoiceprintVault";

export default function WorkspaceVoiceprintsPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Voiceprint Biometric Vault</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Authorized acoustic enrollment profiles for multi-factor speaker verification and clone differentiation.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm">
        <VoiceprintVault />
      </div>
    </div>
  );
}
