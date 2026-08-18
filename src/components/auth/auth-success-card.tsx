import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Full-success state card shown after a password reset is confirmed. */
export function AuthSuccessCard() {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0e9f90] text-white shadow-sm">
        <Check size={24} strokeWidth={2.5} aria-hidden="true" />
      </span>

      <h1 className="text-2xl font-bold text-slate-900">Success</h1>
      <p className="mt-2 mb-6 text-sm text-slate-500">
        Your new password has been successfully saved
      </p>

      <Button
        asChild
        className="h-11 w-full rounded-lg bg-[#0e9f90] text-sm font-medium tracking-wide text-white shadow-sm transition-colors hover:bg-[#0c877a] active:bg-[#0a7368]"
      >
        <Link href="/login">Back to Sign In</Link>
      </Button>
    </div>
  );
}
