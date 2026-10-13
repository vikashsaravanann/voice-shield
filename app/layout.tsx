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
  title: "VoiceShield | Anti-Spoofing & Acoustic Telemetry SOC",
  description:
    "Detect the clone. Protect the conversation. VoiceShield by Logic Intelligence Technologies — real-time synthetic voice and clone detection.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "VoiceShield",
    title: "VoiceShield | Anti-Spoofing & Acoustic Telemetry SOC",
    description:
      "Detect the clone. Protect the conversation. A Logic Intelligence Technologies security product.",
    images: [{ url: "/banner.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceShield | Anti-Spoofing & Acoustic Telemetry SOC",
    description:
      "Detect the clone. Protect the conversation. A Logic Intelligence Technologies security product.",
    images: ["/banner.png"],
  },
  verification: {
    other: {
      "naver-site-verification": "87bb7556d3074f2fdc46420853dc7856",
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
