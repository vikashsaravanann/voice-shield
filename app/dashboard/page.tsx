import { redirect } from "next/navigation";

export const revalidate = 0;

/**
 * Legacy Dashboard Endpoint
 * Preserved for deep link compatibility; canonically redirects to /app SOC Overview.
 */
export default function DashboardLegacyPage() {
  redirect("/app");
}
