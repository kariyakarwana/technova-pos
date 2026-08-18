"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthButton } from "@/components/auth/auth-button";
import { resetPasswordAction } from "@/modules/auth/auth.actions";
import { initialAuthActionState } from "@/modules/auth/auth.types";
import {
  AuthSuccessCard,
} from "@/components/auth/auth-success-card";

type ResetPasswordFormProps = {
  token: string;
};

/** Reset-password form wired to `resetPasswordAction` via `useActionState`. */
export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialAuthActionState,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (state.status === "success") {
    return <AuthSuccessCard />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Reset password?</h1>
      <p className="mt-2 mb-6 text-sm text-slate-500">
        Enter New Password &amp; Confirm Password to get inside
      </p>

      {state.status === "error" && state.message && !state.fieldErrors ? (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-4" noValidate>
        <input type="hidden" name="token" value={token} readOnly />

        <div className="space-y-1.5">
          <Label
            htmlFor="reset-password"
            className="text-sm font-medium text-slate-700"
          >
            New Password
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          </Label>

          <div className="relative">
            <Input
              id="reset-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              disabled={isPending}
              aria-invalid={
                state.fieldErrors?.password !== undefined ? true : undefined
              }
              className="h-10 rounded-lg border-slate-200 bg-white pr-10 pl-3.5 text-sm placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/25"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isPending}
              className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center px-3 text-slate-400 transition hover:text-slate-600 focus-visible:outline-none disabled:pointer-events-none"
            >
              {showPassword ? (
                <EyeOff size={15} aria-hidden="true" />
              ) : (
                <Eye size={15} aria-hidden="true" />
              )}
            </button>
          </div>

          {state.fieldErrors?.password?.map((message) => (
            <p key={message} className="text-xs text-red-600">
              {message}
            </p>
          ))}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="reset-confirm-password"
            className="text-sm font-medium text-slate-700"
          >
            Confirm Password
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          </Label>

          <div className="relative">
            <Input
              id="reset-confirm-password"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              required
              disabled={isPending}
              aria-invalid={
                state.fieldErrors?.confirmPassword !== undefined
                  ? true
                  : undefined
              }
              className="h-10 rounded-lg border-slate-200 bg-white pr-10 pl-3.5 text-sm placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/25"
            />
            <button
              type="button"
              aria-label={showConfirm ? "Hide password" : "Show password"}
              onClick={() => setShowConfirm((prev) => !prev)}
              disabled={isPending}
              className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center px-3 text-slate-400 transition hover:text-slate-600 focus-visible:outline-none disabled:pointer-events-none"
            >
              {showConfirm ? (
                <EyeOff size={15} aria-hidden="true" />
              ) : (
                <Eye size={15} aria-hidden="true" />
              )}
            </button>
          </div>

          {state.fieldErrors?.confirmPassword?.map((message) => (
            <p key={message} className="text-xs text-red-600">
              {message}
            </p>
          ))}
        </div>

        <AuthButton isLoading={isPending} loadingText="Saving...">
          Change Password
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
