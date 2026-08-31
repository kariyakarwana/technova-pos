"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface UpdatePasswordButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Shows a spinner and disables interaction while true. */
  isLoading?: boolean;
  children?: React.ReactNode;
}

/**
 * UpdatePasswordButton — filled teal pill used to submit password changes.
 *
 * Usage:
 * ```tsx
 * <UpdatePasswordButton isLoading={isPending}>Update Password</UpdatePasswordButton>
 * ```
 */
export default function UpdatePasswordButton({
  isLoading = false,
  disabled,
  children = "Update Password",
  className = "",
  ...props
}: UpdatePasswordButtonProps) {
  const isDisabled = isLoading || disabled;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={[
        // Shape & size
        "inline-flex items-center justify-center gap-2",
        "h-10 px-5 rounded-xl",
        // Colour — filled brand-green
        "bg-[var(--brand-green)] text-white",
        // Typography
        "text-sm font-semibold",
        // Shadow
        "shadow-sm",
        // Transitions
        "transition-all duration-150 ease-in-out",
        // Hover — slight opacity lift
        "hover:opacity-90 hover:shadow-md",
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
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
          <span>Updating…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
