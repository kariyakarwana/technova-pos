"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { forgotPasswordSchema, loginSchema, passwordResetOtpSchema, resendVerificationSchema, resetPasswordSchema, verifyEmailSchema } from "./validation";
import type { AuthActionState, ForgotPasswordActionData, VerifyPasswordResetOtpActionData } from "./form-state";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const ACCESS_COOKIE = "technova_access";
const REFRESH_COOKIE = "technova_refresh";

function fields(error: z.ZodError): Record<string, string[]> { return z.flattenError(error).fieldErrors; }

async function request(path: string, body?: unknown, refreshToken?: string) {
  return fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(refreshToken ? { cookie: `${REFRESH_COOKIE}=${refreshToken}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
}

async function message(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    return Array.isArray(body.message) ? body.message.join(" ") : body.message ?? fallback;
  } catch { return fallback; }
}

export async function loginAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { status: "error", message: "Enter a valid email and password.", fieldErrors: fields(parsed.error) };
  const response = await request("/auth/login", parsed.data);
  if (!response.ok) return { status: "error", message: await message(response, "Email or password is incorrect, or the account is unavailable.") };
  const result = (await response.json()) as {
    accessToken: string;
    expiresIn: number;
    user: { roles: string[]; mustChangePassword?: boolean };
  };
  const store = await cookies();
  store.set(ACCESS_COOKIE, result.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: result.expiresIn });
  const refreshToken = response.headers.get("set-cookie")?.match(/technova_refresh=([^;]+)/)?.[1];
  if (refreshToken) store.set(REFRESH_COOKIE, refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60 });
  if (result.user.mustChangePassword) redirect("/change-temporary-password");
  redirect(result.user.roles.includes("SUPPLIER") ? "/supplier-dashboard" : "/dashboard");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  await request("/auth/logout", undefined, store.get(REFRESH_COOKIE)?.value).catch(() => undefined);
  store.delete(ACCESS_COOKIE); store.delete(REFRESH_COOKIE); redirect("/login");
}

export async function forgotPasswordAction(_state: AuthActionState<ForgotPasswordActionData>, formData: FormData): Promise<AuthActionState<ForgotPasswordActionData>> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { status: "error", message: "Enter a valid email address.", fieldErrors: fields(parsed.error) };
  const response = await request("/auth/forgot-password", parsed.data);
  if (!response.ok) return { status: "error", message: await message(response, "Unable to send the verification code.") };
  return { status: "success", message: "If an eligible account exists, a verification code has been sent.", data: (await response.json()) as ForgotPasswordActionData };
}

export async function verifyPasswordResetOtpAction(_state: AuthActionState<VerifyPasswordResetOtpActionData>, formData: FormData): Promise<AuthActionState<VerifyPasswordResetOtpActionData>> {
  const parsed = passwordResetOtpSchema.safeParse({ challengeToken: formData.get("challengeToken"), otp: formData.get("otp") });
  if (!parsed.success) return { status: "error", message: "Enter the six-digit code.", fieldErrors: fields(parsed.error) };
  const response = await request("/auth/verify-reset-otp", parsed.data);
  if (!response.ok) return { status: "error", message: await message(response, "The code is invalid or expired.") };
  return { status: "success", message: "Code verified.", data: (await response.json()) as VerifyPasswordResetOtpActionData };
}

export async function resetPasswordAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({ token: formData.get("token"), password: formData.get("password"), confirmPassword: formData.get("confirmPassword") });
  if (!parsed.success) return { status: "error", message: "Review the highlighted fields.", fieldErrors: fields(parsed.error) };
  const response = await request("/auth/reset-password", { resetToken: parsed.data.token, password: parsed.data.password });
  return response.ok ? { status: "success", message: "Your password has been reset. You can now sign in." } : { status: "error", message: await message(response, "The reset request is invalid or expired.") };
}

export async function resendVerificationAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = resendVerificationSchema.safeParse({ email: formData.get("email") });
  if (parsed.success) await request("/auth/resend-verification", parsed.data);
  return { status: "success", message: "If email verification is pending, a new verification link has been sent." };
}

export async function verifyEmailAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = verifyEmailSchema.safeParse({ token: formData.get("token") });
  if (!parsed.success) return { status: "error", message: "This verification link is invalid or expired." };
  const response = await request("/auth/verify-email", parsed.data);
  return response.ok ? { status: "success", message: "Your email has been verified. You can now sign in." } : { status: "error", message: await message(response, "This verification link is invalid or expired.") };
}

export async function googleSignInAction(): Promise<void> { redirect(`${API_URL}/auth/google`); }
