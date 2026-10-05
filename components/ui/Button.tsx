import React from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "icon" | "critical" | "confirm" | "cancel";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  icon: "btn-ghost btn-icon",
  critical: "btn-critical",
  confirm: "btn-confirm",
  cancel: "btn-cancel",
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  small?: boolean;
};

export function Button({ variant = "primary", loading = false, small = false, className = "", children, disabled, ...rest }: Props) {
  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`btn ${VARIANT_CLASS[variant]} ${small ? "btn-sm" : ""} ${className}`}
    >
      {loading ? <Loader2 aria-hidden className="h-4 w-4 motion-safe:animate-spin" /> : null}
      {children}
    </button>
  );
}
