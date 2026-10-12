import React from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  badge?: string;
  className?: string;
}

/**
 * Healthcare-style SectionHeading component with crisp typography hierarchy.
 * Eyebrow: uppercase tracking with semantic accent.
 * Title: 32-44px Poppins bold/semibold text in deep navy.
 * Description: 16-18px readable paragraph with 1.6 line height.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  badge,
  className = "",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`max-w-3xl mb-12 lg:mb-16 ${
        isCenter ? "mx-auto text-center" : "text-left"
      } ${className}`}
    >
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2 mb-3 ${
            isCenter ? "justify-center" : "justify-start"
          }`}
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#1565C0] bg-[#E7F3FF] px-2.5 py-0.5 rounded-full border border-[#CBD5E1]/60">
            {eyebrow}
          </span>
          {badge && (
            <span className="text-[11px] font-mono font-medium text-[#78350F] bg-[#FFF4D9] px-2 py-0.5 rounded-full border border-[#FDE68A]">
              {badge}
            </span>
          )}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2545] tracking-tight leading-[1.15] mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-[#52677C] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
