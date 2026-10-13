import type { Metadata } from "next";
import { Poppins, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { VoiceShieldAssistant } from "@/components/VoiceShieldAssistant";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://voiceshield.logicintelligencetechnologies.in"),
  title: "VoiceShield | AI Voice Security",
  description:
    "Real-time AI voice spoofing detection and telephony security platform.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "VoiceShield",
    title: "VoiceShield | AI Voice Security",
    description:
      "Real-time AI voice spoofing detection and telephony security platform.",
    images: [{ url: "/banner.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceShield | AI Voice Security",
    description:
      "Real-time AI voice spoofing detection and telephony security platform.",
    images: ["/banner.png"],
  },
  verification: {
    other: {
      "naver-site-verification": "92bf61f6a191f894da91a80f22b8a577",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${lora.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#F7F9FC] text-[#121826] font-sans antialiased">
        <div aria-hidden="true" className="vs-ambient" />
        <Shell>{children}</Shell>
        <VoiceShieldAssistant />
      </body>
    </html>
  );
}
