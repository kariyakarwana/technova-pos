import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/login-form";
import { GoogleButton } from "@/components/auth/google-button";

export const metadata: Metadata = {
  title: "Sign in | TechNova POS",
  description:
    "Sign in to your TechNova POS employee account to manage sales, inventory, and business insights.",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.id && !session.invalid) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout>
      <LoginForm />

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Or
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <GoogleButton />

      <p className="mt-5 text-center text-xs text-slate-400">
        Access is limited to authorised TechNova employees.
      </p>
    </AuthLayout>
  );
}
