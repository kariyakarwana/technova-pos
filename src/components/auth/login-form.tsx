"use client";

import {
  useActionState,
} from "react";

import {
  loginAction,
} from "@/modules/auth/auth.actions";

import {
  initialAuthActionState,
} from "@/modules/auth/auth.types";

import {
  googleSignInAction,
} from "@/modules/auth/auth.actions";

export function LoginForm() {
  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    loginAction,
    initialAuthActionState,
  );

  return (
    <form
      action={formAction}
      className="space-y-5"
    >
      {state.message ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      ) : null}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-slate-700"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          placeholder="admin@example.com"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />

        {state.fieldErrors?.email?.map(
          (message) => (
            <p
              key={message}
              className="text-sm text-red-600"
            >
              {message}
            </p>
          ),
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-slate-700"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
          placeholder="Enter your password"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />

        {state.fieldErrors?.password?.map(
          (message) => (
            <p
              key={message}
              className="text-sm text-red-600"
            >
              {message}
            </p>
          ),
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        {isPending
          ? "Signing in..."
          : "Sign in"}
      </button>
    </form>
  );
}

export function GoogleLoginButton() {
  return (
    <form
      action={googleSignInAction}
      className="mt-4"
    >
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <GoogleIcon />
        Continue with Google
      </button>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.63-2.42l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.87A6 6 0 0 1 6.08 12c0-.65.11-1.28.31-1.87V7.51H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.49l3.35-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 6c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.51l3.35 2.62C7.18 7.76 9.39 6 12 6Z"
      />
    </svg>
  );
}