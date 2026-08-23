import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | TechNova POS",
  description:
    "Set a new password for your TechNova POS account using your secure reset link.",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

/** Reset-password page — reads the token from the URL and passes it to the form. */
export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token = "" } = await searchParams;

  return (
    <AuthLayout>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}
