"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type AuthButtonProps = ComponentProps<"button"> & {
  isLoading?: boolean;
  loadingText?: string;
};

/** Primary action button for auth screens (Sign In, Send Code, Verify OTP, Reset Password). */
export function AuthButton({
  isLoading = false,
  loadingText = "Please wait...",
  disabled,
  className,
  children,
  ...props
}: AuthButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled ?? isLoading}
      className={cn(
        "h-9 w-full rounded-lg bg-[#0e9f90] text-xs font-medium tracking-wide text-white lg:h-9",
        "shadow-sm transition-colors",
        "hover:bg-[#0c877a] active:bg-[#0a7368]",
        "disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={15} className="mr-2 animate-spin" aria-hidden="true" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
