import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import EmailVerificationClient from "@/components/auth/EmailVerificationClient";

export const metadata: Metadata = { title: "Verify email | TechNova POS" };
export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string; email?: string }> }) {
  const { token = "", email = "" } = await searchParams;
  return <AuthLayout><EmailVerificationClient token={token} email={email} /></AuthLayout>;
}
