import React, { type ReactNode } from "react";

export type PastelTone =
  | "purple"
  | "gold"
  | "sandal"
  | "pink"
  | "sky"
  | "green"
  | "white"
  | "cloud";

interface PastelFeatureCardProps {
  tone?: PastelTone;
  icon?: React.ComponentType<{ className?: string }>;
  eyebrow?: string;
  title: string;
  description: string;
  badge?: string;
  badgeTone?: "green" | "gold" | "blue" | "purple";
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const TONE_CLASSES: Record<PastelTone, { bg: string; border: string; iconBg: string; iconColor: string }> = {
  purple: {
    bg: "bg-[#F1ECFF]",
    border: "border-[#DDD6FE]",
    iconBg: "bg-white",
    iconColor: "text-[#5B21B6]",
  },
  gold: {
    bg: "bg-[#FFF4D9]",
    border: "border-[#FDE68A]",
    iconBg: "bg-white",
    iconColor: "text-[#92400E]",
  },
  sandal: {
    bg: "bg-[#F5E8D8]",
    border: "border-[#E7D6C5]",
    iconBg: "bg-white",
    iconColor: "text-[#78350F]",
  },
  pink: {
    bg: "bg-[#FCEAF3]",
    border: "border-[#FBCFE8]",
    iconBg: "bg-white",
    iconColor: "text-[#9D174D]",
  },
  sky: {
    bg: "bg-[#E7F3FF]",
    border: "border-[#BAE6FD]",
    iconBg: "bg-white",
    iconColor: "text-[#075985]",
  },
  green: {
    bg: "bg-[#E7F7EF]",
    border: "border-[#A7F3D0]",
    iconBg: "bg-white",
    iconColor: "text-[#065F46]",
  },
  white: {
    bg: "bg-white",
    border: "border-[#DFE7EF]",
    iconBg: "bg-[#F7F9FC]",
    iconColor: "text-[#1565C0]",
  },
  cloud: {
    bg: "bg-[#F7F9FC]",
    border: "border-[#DFE7EF]",
    iconBg: "bg-white",
    iconColor: "text-[#0B2545]",
  },
};

const BADGE_CLASSES: Record<string, string> = {
  green: "bg-[#E7F7EF] text-[#065F46] border-[#A7F3D0]",
  gold: "bg-[#FFF4D9] text-[#92400E] border-[#FDE68A]",
  blue: "bg-[#E7F3FF] text-[#075985] border-[#BAE6FD]",
  purple: "bg-[#F1ECFF] text-[#5B21B6] border-[#DDD6FE]",
};

/**
 * Healthcare-style PastelFeatureCard component.
 * Solid opaque 1px bordered card with 20px rounded corners.
 * Uses high-contrast WCAG-compliant ink text over subtle pastel surfaces.
 */
export function PastelFeatureCard({
  tone = "white",
  icon: Icon,
  eyebrow,
  title,
  description,
  badge,
  badgeTone = "green",
  footer,
  children,
  className = "",
}: PastelFeatureCardProps) {
  const styles = TONE_CLASSES[tone];
  const badgeStyle = BADGE_CLASSES[badgeTone] || BADGE_CLASSES.green;

  return (
    <article
      className={`relative rounded-[20px] p-6 sm:p-7 border ${styles.bg} ${styles.border} shadow-[0_2px_8px_rgba(11,37,69,0.04)] hover:shadow-[0_8px_24px_rgba(11,37,69,0.08)] transition-all duration-200 flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-5">
          {Icon ? (
            <div
              className={`w-11 h-11 rounded-xl ${styles.iconBg} ${styles.iconColor} border border-[#DFE7EF]/80 flex items-center justify-center shadow-xs`}
            >
              <Icon className="w-5 h-5" />
            </div>
          ) : <div />}
          {badge && (
            <span
              className={`text-xs font-mono font-medium px-2.5 py-0.5 rounded-full border ${badgeStyle}`}
            >
              {badge}
            </span>
          )}
        </div>

        {eyebrow && (
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#52677C] mb-1.5">
            {eyebrow}
          </p>
        )}

        <h3 className="text-xl font-semibold text-[#0B2545] tracking-tight mb-2.5">
          {title}
        </h3>

        <p className="text-sm text-[#52677C] leading-relaxed mb-4">
          {description}
        </p>

        {children}
      </div>

      {footer && <div className="mt-4 pt-4 border-t border-[#DFE7EF]/60">{footer}</div>}
    </article>
  );
}
