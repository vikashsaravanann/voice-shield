import ForensicSandboxPage from "@/app/sandbox/page";

export default function WorkspaceForensicsPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">
          Deep Forensic Laboratory
        </h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Multi-band spectrogram slicing, voiceprint biometric verification, and Section 65B legal certificate export.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#DFE7EF] shadow-sm">
        <ForensicSandboxPage />
      </div>
    </div>
  );
}
