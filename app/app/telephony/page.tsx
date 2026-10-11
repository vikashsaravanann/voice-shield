import { TwilioPhonePanel } from "@/components/TwilioPhonePanel";

export default function WorkspaceTelephonyPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0B2545] tracking-tight">Telephony &amp; SIP Media Intercept</h1>
        <p className="text-xs sm:text-sm text-[#52677C]">
          Carrier trunk routing, Twilio Voice Media Stream configurations, and live call bridging controls.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#DFE7EF] shadow-sm max-w-xl">
        <TwilioPhonePanel />
      </div>
    </div>
  );
}
