"use client";

import {
  useActionState,
  useState,
} from "react";

import Link from "next/link";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import {
  AuthButton,
} from "@/components/auth/auth-button";

import {
  Checkbox,
} from "@/components/ui/checkbox";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  loginAction,
} from "@/lib/auth/actions";

import {
  initialAuthActionState,
} from "@/lib/auth/form-state";

export function LoginForm() {
  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    loginAction,
    initialAuthActionState,
  );

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const emailError =
    state.fieldErrors?.email?.[0];

  const passwordError =
    state.fieldErrors?.password?.[0];

  return (
    <div>
      <header className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0e9f90]">
          Welcome back
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.7rem]">
          Sign in to your account
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter your credentials to
          access TechNova POS.
        </p>
      </header>

      {state.status === "error" &&
      state.message ? (
        <div
          role="alert"
          aria-live="polite"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      ) : null}

      <form
        action={formAction}
        className="space-y-4"
        noValidate
      >
        <div className="space-y-1.5">
          <Label
            htmlFor="login-email"
            className="text-sm font-medium text-slate-700"
          >
            Email address

            <span
              aria-hidden="true"
              className="ml-0.5 text-red-500"
            >
              *
            </span>
          </Label>

          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
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
              aria-invalid={
                emailError
                  ? true
                  : undefined
              }
              aria-describedby={
                emailError
                  ? "login-email-error"
                  : undefined
              }
              className="h-11 rounded-lg border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#0e9f90] focus-visible:ring-[#0e9f90]/20"
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

        <div className="space-y-1.5">
          <Label
            htmlFor="login-password"
            className="text-sm font-medium text-slate-700"
          >
            Password

            <span
              aria-hidden="true"
              className="ml-0.5 text-red-500"
            >
              *
            </span>
          </Label>

          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            />

            <Input
              id="login-password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              required
              disabled={isPending}
              placeholder="Enter your password"
              aria-invalid={
                passwordError
                  ? true
                  : undefined
              }
              aria-describedby={
                passwordError
                  ? "login-password-error"
                  : undefined
              }
              className="h-11 rounded-lg border-slate-200 bg-white pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-[#0e9f90] focus-visible:ring-[#0e9f90]/20"
            />

            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              aria-pressed={
                showPassword
              }
              className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-r-lg text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0e9f90] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff
                  aria-hidden="true"
                  className="size-4"
                />
              ) : (
                <Eye
                  aria-hidden="true"
                  className="size-4"
                />
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
              className="cursor-pointer text-sm font-normal text-slate-600"
            >
              Remember me
            </Label>
          </div>

          <Link
            href="/forgot-password"
            className="rounded-sm text-sm font-semibold text-[#0e9f90] transition-colors hover:text-[#0c877a] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e9f90]/40"
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton
          isLoading={isPending}
          loadingText="Signing in..."
          className="mt-1"
        >
          Sign in
        </AuthButton>
      </form>
    </div>
  );
}
