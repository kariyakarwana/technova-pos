import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { TwoStepVerificationForm } from "@/components/auth/two-step-verification-form";

export const metadata: Metadata = {
  title: "2-Step Verification | TechNova POS",
  description:
    "Enter the one-time passcode sent to your email to complete two-step verification for your TechNova POS account.",
};

export default function TwoStepVerificationPage() {
  return (
    <AuthLayout>
      <TwoStepVerificationForm />
    </AuthLayout>
  );
}
