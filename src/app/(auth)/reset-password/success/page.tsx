import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthSuccessCard } from "@/components/auth/auth-success-card";

export const metadata: Metadata = {
  title: "Password Reset Successful | TechNova POS",
  description:
    "Your TechNova POS password has been successfully reset. Sign in with your new credentials.",
};

export default function ResetPasswordSuccessPage() {
  return (
    <AuthLayout>
      <AuthSuccessCard />
    </AuthLayout>
  );
}
