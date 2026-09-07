"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resendVerificationAction, verifyEmailAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/form-state";
import { AuthButton } from "./auth-button";

export default function EmailVerificationClient({ token, email }: { token: string; email: string }) {
  const [verifyState, verifyAction, verifying] = useActionState(verifyEmailAction, initialAuthActionState);
  const [resendState, resendAction, resending] = useActionState(resendVerificationAction, initialAuthActionState);
  return <div><h1 className="text-2xl font-bold">Verify your email</h1><p className="mt-2 text-sm text-slate-500">Confirm your account using the secure link sent to your email address.</p>{verifyState.message && <p className={`mt-5 rounded-xl p-3 text-sm ${verifyState.status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>{verifyState.message}</p>}{token && verifyState.status !== "success" && <form action={verifyAction} className="mt-6"><input type="hidden" name="token" value={token} /><AuthButton isLoading={verifying} loadingText="Verifying…">Verify email</AuthButton></form>}{!token && <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">The verification token is missing. Request a new verification email below.</p>}<form action={resendAction} className="mt-6 space-y-3"><label className="block text-xs font-semibold">Email address<input required type="email" name="email" defaultValue={email} className="mt-1 h-11 w-full rounded-xl border px-3" /></label><AuthButton isLoading={resending} loadingText="Sending…">Resend verification email</AuthButton></form>{resendState.message && <p className="mt-3 text-sm text-slate-600">{resendState.message}</p>}<Link href="/login" className="mt-5 block text-center text-sm font-semibold text-[#0E9384]">Back to login</Link></div>;
}
