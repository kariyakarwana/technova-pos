"use client";

import React from "react";

interface ForgotPasswordButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

/**
 * ForgotPasswordButton — outlined teal pill used to trigger the
 * forgot-password / reset-password flow.
 *
 * Usage:
 * ```tsx
 * <ForgotPasswordButton onClick={handleForgotPassword}>
 *   Forgot Password?
 * </ForgotPasswordButton>
 * ```
 */
export default function ForgotPasswordButton({
  children = "Forgot Password?",
  className = "",
  ...props
}: ForgotPasswordButtonProps) {
  return (
    <button
      type="button"
      className={[
        // Shape & size
        "inline-flex items-center justify-center gap-2",
        "h-10 px-5 rounded-xl",
        // Colour — outlined, white fill
        "border-[1.5px] border-[var(--brand-green)]",
        "bg-white text-[var(--brand-green)]",
        // Typography
        "text-sm font-semibold",
        // Shadow
        "shadow-sm",
        // Transitions
        "transition-all duration-150 ease-in-out",
        // Hover — green-transparent tint
        "hover:bg-[var(--brand-green-transparent)]",
        // Active — snap-back scale
        "active:scale-[0.98]",
        // Disabled
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        // Focus ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
