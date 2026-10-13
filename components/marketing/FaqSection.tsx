import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import { HOMEPAGE_FAQS } from "@/lib/structured-data";

/**
 * Visible homepage FAQ section. Renders the same Q&A used for the FAQPage
 * JSON-LD on the homepage, so the structured data mirrors on-page content.
 *
 * Added by the LIT Visibility Engine apply step (Phase 3).
 */
export function FaqSection() {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E7F3FF] text-[#1565C0] border border-[#BBDEFB] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2545] tracking-tight">
            How VoiceShield Works
          </h2>
        </div>

        <div className="space-y-4">
          {HOMEPAGE_FAQS.map((item) => (
            <div key={item.question} className="p-6 rounded-2xl bg-[#F7F9FC] border border-[#DFE7EF]">
              <h3 className="text-base font-bold text-[#0B2545] mb-2">{item.question}</h3>
              <p className="text-sm text-[#52677C] leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1565C0] hover:text-[#0B2545] transition-colors"
          >
            <span>See all frequently asked questions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
