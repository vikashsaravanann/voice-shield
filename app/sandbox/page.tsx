import { redirect } from "next/navigation";

export const revalidate = 0;

/**
 * Legacy Forensic Sandbox Endpoint
 * Preserved for deep link compatibility; canonically redirects to /app/forensics Lab.
 */
export default function SandboxLegacyPage() {
  redirect("/app/forensics");
}
