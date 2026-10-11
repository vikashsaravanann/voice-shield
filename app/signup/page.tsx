import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Create Operator Account | VoiceShield",
  description: "Register a secure enterprise security operator seat on VoiceShield.",
};

export default function SignupPage() {
  return (
    <div className="w-full flex items-center justify-center py-12 px-4 sm:px-6">
      <AuthCard
        initialMode="signup"
        title="Register Security Seat"
        subtitle="Establish an isolated enterprise workspace credential for real-time voice monitoring."
      />
    </div>
  );
}
