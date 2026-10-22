"use client";

import { useActionState, useState } from "react";

import Link from "next/link";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { AuthButton } from "@/components/auth/auth-button";

import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { loginAction } from "@/lib/auth/actions";

import { initialAuthActionState } from "@/lib/auth/form-state";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialAuthActionState,
  );

  const [showPassword, setShowPassword] = useState(false);

  const emailError = state.fieldErrors?.email?.[0];

  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <div>
      <header className="mb-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#0e9f90]">
          Welcome back
        </p>

        <h1 className="mt-2 text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Enter your credentials to access TechNova POS.
        </p>
      </header>

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-4" noValidate>
        <div className="space-y-1">
          <Label
            htmlFor="login-email"
            className="text-xs font-medium text-slate-700"
          >
            Email address
            <span aria-hidden="true" className="ml-0.5 text-red-500">
              *
            </span>
          </Label>

          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400"
            />

            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              disabled={isPending}
              placeholder="you@company.com"
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? "login-email-error" : undefined}
              className="h-9 rounded-lg border-slate-200 bg-white pl-8 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:border-[#0e9f90] focus-visible:ring-[#0e9f90]/20"
            />
          </div>

          {emailError ? (
            <p
              id="login-email-error"
              role="alert"
              className="text-xs text-red-600"
            >
              {emailError}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="login-password"
            className="text-xs font-medium text-slate-700"
          >
            Password
            <span aria-hidden="true" className="ml-0.5 text-red-500">
              *
            </span>
          </Label>

          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400"
            />

            <Input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isPending}
              placeholder="Enter your password"
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={
                passwordError ? "login-password-error" : undefined
              }
              className="h-9 rounded-lg border-slate-200 bg-white pl-8 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:border-[#0e9f90] focus-visible:ring-[#0e9f90]/20"
            />

            <button
              type="button"
              disabled={isPending}
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-r-lg text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0e9f90] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="size-3.5" />
              ) : (
                <Eye aria-hidden="true" className="size-3.5" />
              )}
            </button>
          </div>

          {passwordError ? (
            <p
              id="login-password-error"
              role="alert"
              className="text-xs text-red-600"
            >
              {passwordError}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="login-remember"
              name="remember"
              disabled={isPending}
              className="border-slate-300 data-[state=checked]:border-[#0e9f90] data-[state=checked]:bg-[#0e9f90]"
            />

            <Label
              htmlFor="login-remember"
              className="cursor-pointer text-xs font-normal text-slate-600"
            >
              Remember me
            </Label>
          </div>

          <Link
            href="/forgot-password"
            className="rounded-sm text-xs font-semibold text-[#0e9f90] transition-colors hover:text-[#0c877a] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e9f90]/40"
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton
          isLoading={isPending}
          loadingText="Signing in..."
          className="mt-1 font-semibold"
        >
          Sign in
        </AuthButton>
      </form>
    </div>
  );
}
