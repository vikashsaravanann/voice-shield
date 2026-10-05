"use client";

import { useEffect } from "react";
import Link from "next/link";
import { OctagonAlert } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Only the opaque digest is surfaced; never the stack or message.
    void error.digest;
  }, [error]);

  return (
    <section className="mx-auto max-w-xl px-4 py-24" aria-labelledby="err-title">
      <div className="alert alert-critical" role="alert">
        <OctagonAlert aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[var(--danger)]" />
        <div>
          <h1 id="err-title" className="text-lg font-semibold text-white">Something went wrong</h1>
          <p className="mt-1 text-sm text-slate-300">
            This page could not be displayed. No session data was changed. Try again, or return to the overview.
          </p>
          {error.digest ? <p className="mt-2 font-mono text-xs text-slate-400">Reference: {error.digest}</p> : null}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={reset}>Try again</button>
        <Link href="/" className="btn btn-ghost">Back to overview</Link>
      </div>
    </section>
  );
}
