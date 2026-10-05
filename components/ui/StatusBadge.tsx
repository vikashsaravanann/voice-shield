import React from "react";
import {
  CheckCircle2,
  CircleDot,
  AlertTriangle,
  ShieldAlert,
  OctagonAlert,
  Loader2,
  WifiOff,
  HelpCircle,
} from "lucide-react";

export type Severity =
  | "safe"
  | "normal"
  | "warning"
  | "high"
  | "critical"
  | "processing"
  | "offline"
  | "unknown";

const ICONS: Record<Severity, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  safe: CheckCircle2,
  normal: CircleDot,
  warning: AlertTriangle,
  high: ShieldAlert,
  critical: OctagonAlert,
  processing: Loader2,
  offline: WifiOff,
  unknown: HelpCircle,
};

const DEFAULT_LABEL: Record<Severity, string> = {
  safe: "Safe",
  normal: "Normal",
  warning: "Warning",
  high: "High risk",
  critical: "Critical",
  processing: "Processing",
  offline: "Offline",
  unknown: "Unknown",
};

/** Colour + icon + text. Severity is never conveyed by colour alone. */
export function StatusBadge({
  severity,
  children,
  className = "",
}: {
  severity: Severity;
  children?: React.ReactNode;
  className?: string;
}) {
  const Icon = ICONS[severity];
  return (
    <span className={`status status-${severity} ${className}`}>
      <Icon
        aria-hidden
        className={`h-3.5 w-3.5 shrink-0 ${severity === "processing" ? "motion-safe:animate-spin" : ""}`}
      />
      <span>{children ?? DEFAULT_LABEL[severity]}</span>
    </span>
  );
}
