import React from "react";

/** Standard metric widget. Pass `value={null}` when the backend has no data: renders an explicit unavailable state. */
export function MetricCard({
  label,
  value,
  note,
  icon,
  unavailableText = "Unavailable",
  tone = "default",
}: {
  label: string;
  value: React.ReactNode | null;
  note?: React.ReactNode;
  icon?: React.ReactNode;
  unavailableText?: string;
  tone?: "default" | "critical" | "processing";
}) {
  const toneClass = tone === "critical" ? "text-[var(--danger)]" : tone === "processing" ? "text-[var(--processing)]" : "";
  return (
    <div className="widget">
      <div className="flex items-center justify-between gap-2">
        <p className="widget-label">{label}</p>
        {icon ? <span aria-hidden className="text-slate-500">{icon}</span> : null}
      </div>
      {value === null || value === undefined ? (
        <p className="widget-value !text-base !font-medium text-slate-400">{unavailableText}</p>
      ) : (
        <p className={`widget-value ${toneClass}`}>{value}</p>
      )}
      {note ? <p className="widget-note">{note}</p> : null}
    </div>
  );
}
