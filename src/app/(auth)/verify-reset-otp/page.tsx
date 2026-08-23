import {
  redirect,
} from "next/navigation";

import {
  AuthLayout,
} from "@/components/auth/AuthLayout";

import {
  VerifyOtpForm,
} from "@/components/auth/verify-otp-form";

type VerifyResetOtpPageProps = {
  searchParams: Promise<{
    challenge?: string;
  }>;
};

export default async function VerifyResetOtpPage({
  searchParams,
}: VerifyResetOtpPageProps) {
  const {
    challenge,
  } = await searchParams;

  if (!challenge) {
    redirect("/forgot-password");
  }

  return (
    <AuthLayout>
      <VerifyOtpForm
        challengeToken={challenge}
      />
    </AuthLayout>
  );
}