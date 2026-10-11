import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Eye, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Accessibility Statement | VoiceShield",
  description: "WCAG 2.1 AA compliance statement, high-contrast palette, and screen reader compatibility.",
};

export default function AccessibilityPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F7EF] text-[#065F46] border border-[#A7F3D0] mb-4">
            <Eye className="w-3.5 h-3.5" />
            <span>Inclusive Design</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2545] tracking-tight mb-4">
            Accessibility Statement (WCAG 2.1 AA)
          </h1>
          <p className="text-xs text-[#52677C]">Audited: October 11, 2026 • Conformance Target: Level AA</p>
        </div>

        <section className="space-y-4 text-sm text-[#52677C] leading-relaxed">
          <h2 className="text-lg font-bold text-[#0B2545]">1. Our Accessibility Commitment</h2>
          <p>
            Logic Intelligence Technologies is committed to ensuring digital accessibility for people with disabilities across the VoiceShield platform. We continuously apply the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
          </p>

          <h2 className="text-lg font-bold text-[#0B2545]">2. Technical Accessibility Measures</h2>
          <div className="p-4 rounded-xl bg-[#F7F9FC] border border-[#DFE7EF] space-y-2">
            <p><strong className="text-[#0B2545]">Color Contrast:</strong> High-contrast foreground (#0B2545 Navy) on light background (#FFFFFF, #F7F9FC Cloud) ensures minimum 4.5:1 text contrast and 3:1 graphical object contrast.</p>
            <p><strong className="text-[#0B2545]">Keyboard Navigation:</strong> All interactive controls, sliders, modal dialogs, and navigation menus support Tab, Enter, Space, and Escape key operations.</p>
            <p><strong className="text-[#0B2545]">Screen Readers:</strong> Standard HTML5 semantic landmarks (header, nav, main, aside, footer), ARIA roles, and live region announcements (aria-live) communicate real-time risk scores without visual dependence.</p>
            <p><strong className="text-[#0B2545]">Reduced Motion:</strong> Respects the system <code>prefers-reduced-motion</code> media query by disabling ambient spectrogram scan animations.</p>
          </div>

          <h2 className="text-lg font-bold text-[#0B2545]">3. Feedback &amp; Contact</h2>
          <p>
            If you encounter an accessibility barrier on our website or workspace, please notify our accessibility coordinator at <strong className="text-[#0B2545]">accessibility@logicintelligencetechnologies.in</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
