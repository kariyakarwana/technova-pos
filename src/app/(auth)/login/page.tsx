import type {
  Metadata,
} from "next";

import {
  redirect,
} from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";

import {
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

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    if (user.mustChangePassword) redirect("/change-temporary-password");
    redirect(user.roles.includes("SUPPLIER") ? "/supplier-dashboard" : "/dashboard");
  }

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
        Access is limited to authorised TechNova employees and supplier contacts.
      </p>
    </AuthLayout>
  );
}
