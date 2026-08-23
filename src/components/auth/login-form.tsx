"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthButton } from "@/components/auth/auth-button";
import { loginAction } from "@/modules/auth/auth.actions";
import { initialAuthActionState } from "@/modules/auth/auth.types";

/** Login form wired to `loginAction` via `useActionState`. */
export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialAuthActionState,
  );

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Welcome Back
        </p>
        <h1 className="mt-2 text-[1.6rem] font-bold leading-tight tracking-tight text-slate-900">
          Sign in to your account
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Enter your credentials to access TechNova POS.
        </p>
      </div>

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-3" noValidate>
        <div className="space-y-1.5">
          <Label
            htmlFor="login-email"
            className="text-sm font-medium text-slate-700"
          >
            Email
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          </Label>

          <div className="relative">
            <Input
              id="login-email"
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

        <div className="space-y-1.5">
          <Label
            htmlFor="login-password"
            className="text-sm font-medium text-slate-700"
          >
            Password
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          </Label>

          <div className="relative">
            <Input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isPending}
              placeholder="Enter your password"
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="login-remember"
              name="remember"
              className="data-checked:border-emerald-600 data-checked:bg-emerald-600"
            />
            <Label
              htmlFor="login-remember"
              className="cursor-pointer text-sm font-normal text-slate-600"
            >
              Remember Me
            </Label>
          </div>

          <Link
            href="/forgot-password"
            className="rounded text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Forgot Password?
          </Link>
        </div>

        <AuthButton isLoading={isPending} loadingText="Signing in…">
          Sign In
        </AuthButton>
      </form>
    </div>
  );
}
