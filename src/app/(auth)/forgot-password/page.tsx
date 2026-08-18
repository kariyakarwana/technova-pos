import type {
  Metadata,
} from "next";

import {
  AuthLayout,
} from "@/components/auth/AuthLayout";

import {
  ForgotPasswordForm,
} from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title:
    "Forgot password | TechNova POS",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}