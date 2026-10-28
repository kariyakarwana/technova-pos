import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";

import { AuthLayout } from "@/components/auth/AuthLayout";

import { GoogleButton } from "@/components/auth/google-button";

import { LoginForm } from "@/components/auth/login-form";
import { MicrosoftButton } from "@/components/auth/microsoft-button";

export const metadata: Metadata = {
  title: "Sign in | TechNova POS",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    if (user.mustChangePassword) redirect("/change-temporary-password");
    redirect(
      user.roles.includes("SUPPLIER") ? "/supplier-dashboard" : "/dashboard",
    );
  }

  return (
    <AuthLayout footerNotice="Access is limited to authorised TechNova employees and supplier contacts.">
      <LoginForm />

      <div className="my-3 sm:my-3.5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Or
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="space-y-2">
        <GoogleButton />
        <MicrosoftButton />
      </div>
    </AuthLayout>
  );
}
