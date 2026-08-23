"use client";

import {
  useActionState,
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthButton } from "@/components/auth/auth-button";
import { forgotPasswordAction } from "@/modules/auth/auth.actions";
import type {
  AuthActionState,
  ForgotPasswordActionData,
} from "@/modules/auth/auth.types";

/** Forgot-password form wired to `forgotPasswordAction` via `useActionState`. */
export function ForgotPasswordForm() {

  const router = useRouter();

  const initialForgotPasswordState:
  AuthActionState<
    ForgotPasswordActionData
  > = {
    status: "idle",
};

  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    forgotPasswordAction,
    initialForgotPasswordState,
  );
  

  useEffect(() => {
    if (
      state.status === "success" &&
      state.data?.challengeToken
    ) {
      router.push(
        `/verify-reset-otp?challenge=${encodeURIComponent(
          state.data.challengeToken,
        )}`,
      );
    }
  }, [router, state]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Forgot password?</h1>
      <p className="mt-2 mb-6 text-sm text-slate-500">
        If you forgot your password, well, then we&apos;ll email you
        instructions to reset your password.
      </p>

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label
            htmlFor="forgot-email"
            className="text-sm font-medium text-slate-700"
          >
            Email Address
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          </Label>

          <div className="relative">
            <Input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              placeholder="you@company.com"
              aria-invalid={
                state.fieldErrors?.email !== undefined ? true : undefined
              }
              className="h-10 rounded-lg border-slate-200 bg-white pr-10 pl-3.5 text-sm placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/25"
            />
            <Mail
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
            />
          </div>

          {state.fieldErrors?.email?.map((message) => (
            <p key={message} className="text-xs text-red-600">
              {message}
            </p>
          ))}
        </div>

        <AuthButton isLoading={isPending} loadingText="Sending...">
          Submit
        </AuthButton>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Return to{" "}
        <Link
          href="/login"
          className="font-semibold text-slate-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e9f90] rounded"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
