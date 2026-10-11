import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center" aria-labelledby="nf-title">
      <div className="w-16 h-16 rounded-2xl bg-[#E7F3FF] border border-[#BBDEFB] flex items-center justify-center mx-auto mb-4 text-[#1565C0]">
        <SearchX aria-hidden className="h-8 w-8" />
      </div>
      <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#1565C0]">404 ERROR</p>
      <h1 id="nf-title" className="mt-2 text-3xl font-bold tracking-tight text-[#0B2545]">Page not found</h1>
      <p className="mt-3 text-sm text-[#52677C] leading-relaxed max-w-md mx-auto">
        The requested address does not match any VoiceShield page or endpoint. Please check the URL or use the navigation above.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">Back to Overview</Link>
        <Link href="/docs" className="btn btn-ghost">Documentation</Link>
      </div>
    </section>
  );
}
