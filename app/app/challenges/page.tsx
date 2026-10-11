import { ChallengeResponse } from "@/components/ChallengeResponse";

export default function WorkspaceChallengesPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Verification Challenges</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Dynamic phonetic challenge generation in Indic languages and English for active anti-replay verification.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm">
        <ChallengeResponse />
      </div>
    </div>
  );
}
