import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center" aria-labelledby="nf-title">
      <SearchX aria-hidden className="mx-auto h-10 w-10 text-slate-500" />
      <p className="mt-4 font-mono text-sm text-slate-400">404</p>
      <h1 id="nf-title" className="mt-1 text-2xl font-semibold text-white">Page not found</h1>
      <p className="mt-2 text-sm text-slate-400">The address does not match any VoiceShield page.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">Back to overview</Link>
        <Link href="/docs" className="btn btn-ghost">Documentation</Link>
      </div>
    </section>
  );
}
