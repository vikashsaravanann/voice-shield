import type { Metadata } from "next";
import { PrivateAppLayout } from "@/components/layout/PrivateAppLayout";

export const metadata: Metadata = {
  title: "VoiceShield | Security Workspace & SOC",
  description: "Enterprise voice fraud mitigation and telemetry workspace.",
};

export default function WorkspaceRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateAppLayout>{children}</PrivateAppLayout>;
}
