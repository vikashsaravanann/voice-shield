"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If inside private /app workspace, the workspace layout handles chrome
  if (pathname.startsWith("/app")) {
    return <>{children}</>;
  }

  // Standalone auth pages render focused chrome without standard marketing nav
  const isDedicatedAuth = [
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/onboarding",
  ].includes(pathname);

  if (isDedicatedAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Public marketing & legal pages
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
