import { z } from "zod";

const PASSWORD_MAX_LENGTH = 128;
const tokenSchema = z.string().trim().min(32).max(256).regex(/^[A-Za-z0-9_-]+$/);
const emailSchema = z.string().trim().toLowerCase().max(254).email("Enter a valid email address.");

const strongPasswordSchema = z.string().min(12, "Password must contain at least 12 characters.").max(PASSWORD_MAX_LENGTH)
  .regex(/[a-z]/, "Password must contain a lowercase letter.")
  .regex(/[A-Z]/, "Password must contain an uppercase letter.")
  .regex(/[0-9]/, "Password must contain a number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain a symbol.");

export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Password is required.").max(PASSWORD_MAX_LENGTH) });
export const forgotPasswordSchema = z.object({ email: emailSchema });
export const resendVerificationSchema = z.object({ email: emailSchema });
export const verifyEmailSchema = z.object({ token: tokenSchema });
export const passwordResetOtpSchema = z.object({ challengeToken: tokenSchema, otp: z.string().trim().regex(/^\d{6}$/, "Enter the six-digit code.") });
export const resetPasswordSchema = z.object({
  token: tokenSchema,
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, "Password confirmation is required."),
}).refine((value) => value.password === value.confirmPassword, { message: "Passwords do not match.", path: ["confirmPassword"] });
