import type {
  Metadata,
} from "next";

import {
<<<<<<< Updated upstream
  redirect,
} from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";

import {
=======
>>>>>>> Stashed changes
  AuthLayout,
} from "@/components/auth/AuthLayout";

import {
  GoogleButton,
} from "@/components/auth/google-button";

import {
  LoginForm,
} from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | TechNova POS",
};

<<<<<<< Updated upstream
export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

=======
export default function LoginPage() {
>>>>>>> Stashed changes
  return (
    <AuthLayout>
      <LoginForm />

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Or
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <GoogleButton />

      <p className="mt-5 text-center text-xs leading-5 text-slate-400">
        Access is limited to authorised
        TechNova employees.
      </p>
    </AuthLayout>
  );
}
