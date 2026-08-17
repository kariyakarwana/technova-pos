import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";

export const metadata: Metadata = {
  title: "Verify OTP | TechNova POS",
  description:
    "Enter the one-time passcode sent to your email to verify your TechNova POS account.",
};

export default function VerifyOtpPage() {
  return (
    <AuthLayout>
      <VerifyOtpForm />
    </AuthLayout>
  );
}
