import {
  redirect,
} from "next/navigation";

import type {
  Metadata,
} from "next";

import {
  AuthLayout,
} from "@/components/auth/AuthLayout";

import {
  ResetPasswordForm,
} from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title:
    "Reset password | TechNova POS",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const {
    token,
  } = await searchParams;

  if (!token) {
    redirect("/forgot-password");
  }

  return (
    <AuthLayout>
      <ResetPasswordForm
        token={token}
      />
    </AuthLayout>
  );
}