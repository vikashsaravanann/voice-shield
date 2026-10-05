import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { VoiceShieldAssistant } from "@/components/VoiceShieldAssistant";

export const metadata: Metadata = {
  metadataBase: new URL("https://voiceshield.logicintelligencetechnologies.in"),
  title: "VoiceShield — Sub-400ms Voice Risk Intelligence & Telephony Compliance",
  description:
    "VoiceShield — Sub-400ms Voice Risk Intelligence & Telephony Compliance. Real-time acoustic risk scoring, zero-retention raw audio processing, and telephony compliance by Logic Intelligence Technologies.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "VoiceShield",
    title: "VoiceShield — Sub-400ms Voice Risk Intelligence & Telephony Compliance",
    description:
      "VoiceShield — Sub-400ms Voice Risk Intelligence & Telephony Compliance. Sub-400ms acoustic risk scoring and telephony compliance by Logic Intelligence Technologies.",
    images: [{ url: "/assets/og-banner.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceShield — Sub-400ms Voice Risk Intelligence & Telephony Compliance",
    description:
      "VoiceShield — Sub-400ms Voice Risk Intelligence & Telephony Compliance by Logic Intelligence Technologies.",
    images: ["/assets/og-banner.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-[#0D1B3E] text-slate-100 antialiased font-sans">
        <Shell>{children}</Shell>
        <VoiceShieldAssistant />
      </body>
    </html>
  );
}
