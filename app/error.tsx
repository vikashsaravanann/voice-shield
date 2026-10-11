"use client";

import { useEffect } from "react";
import Link from "next/link";
import { OctagonAlert } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    void error.digest;
  }, [error]);

  return (
    <section className="mx-auto max-w-xl px-4 py-24" aria-labelledby="err-title">
      <div className="alert alert-critical" role="alert">
        <OctagonAlert aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-[#991B1B]" />
        <div>
          <h1 id="err-title" className="text-lg font-bold text-[#991B1B]">Something went wrong</h1>
          <p className="mt-1 text-sm text-[#475569]">
            This page could not be displayed. No session data was changed. Try again, or return to the overview.
          </p>
          {error.digest ? <p className="mt-2 font-mono text-xs text-[#64748B]">Reference: {error.digest}</p> : null}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={reset}>Try again</button>
        <Link href="/" className="btn btn-ghost">Back to overview</Link>
      </div>
    </section>
  );
}
