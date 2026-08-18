import { z } from "zod";

import {
  PASSWORD_MAX_LENGTH,
  validatePasswordStrength,
} from "@/lib/security/password";

export const EMAIL_MAX_LENGTH = 254;
export const NAME_MAX_LENGTH = 100;
export const AUTH_TOKEN_MIN_LENGTH = 32;
export const AUTH_TOKEN_MAX_LENGTH = 256;

/**
 * Used for all authentication email input.
 *
 * Every email is:
 * - Trimmed
 * - Converted to lowercase
 * - Validated
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email address is required.")
  .max(
    EMAIL_MAX_LENGTH,
    "Email address is too long.",
  )
  .email("Enter a valid email address.");

/**
 * Login intentionally does not apply new-password complexity rules.
 *
 * Existing passwords should be verified as submitted. Complexity
 * belongs to account creation/reset/change operations.
 */
export const loginSchema = z.object({
  email: emailSchema,

  password: z
    .string()
    .min(1, "Password is required.")
    .max(
      PASSWORD_MAX_LENGTH,
      "Password is too long.",
    ),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resendVerificationSchema = z.object({
  email: emailSchema,
});

export const tokenSchema = z
  .string()
  .trim()
  .min(
    AUTH_TOKEN_MIN_LENGTH,
    "The authentication token is invalid.",
  )
  .max(
    AUTH_TOKEN_MAX_LENGTH,
    "The authentication token is invalid.",
  )
  .regex(
    /^[A-Za-z0-9_-]+$/,
    "The authentication token is invalid.",
  );

/**
 * Zod wrapper around the central password policy.
 */
export const strongPasswordSchema = z
  .string()
  .min(1, "Password is required.")
  .max(
    PASSWORD_MAX_LENGTH,
    `Password must not exceed ${PASSWORD_MAX_LENGTH} characters.`,
  )
  .superRefine((password, context) => {
    const validation =
      validatePasswordStrength(password);

    for (const message of validation.errors) {
      context.addIssue({
        code: "custom",
        message,
      });
    }
  });

export const resetPasswordSchema = z
  .object({
    token: tokenSchema,

    password: strongPasswordSchema,

    confirmPassword: z
      .string()
      .min(
        1,
        "Password confirmation is required.",
      ),
  })
  .refine(
    (values) =>
      values.password === values.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export const verifyEmailSchema = z.object({
  token: tokenSchema,
});

/**
 * Used when an administrator creates an employee account.
 */
export const provisionUserSchema = z.object({
  email: emailSchema,

  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(
      NAME_MAX_LENGTH,
      `Name must not exceed ${NAME_MAX_LENGTH} characters.`,
    ),

  roleIds: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Role ID is required."),
    )
    .min(
      1,
      "At least one role must be assigned.",
    )
    .max(
      20,
      "Too many roles were selected.",
    ),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required.")
      .max(
        PASSWORD_MAX_LENGTH,
        "Current password is too long.",
      ),

    newPassword: strongPasswordSchema,

    confirmPassword: z
      .string()
      .min(
        1,
        "Password confirmation is required.",
      ),
  })
  .refine(
    (values) =>
      values.newPassword ===
      values.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  )
  .refine(
    (values) =>
      values.currentPassword !==
      values.newPassword,
    {
      message:
        "The new password must be different from the current password.",
      path: ["newPassword"],
    },
  );


  export const passwordResetOtpSchema =
  z.object({
    challengeToken: tokenSchema,

    otp: z
      .string()
      .trim()
      .regex(
        /^\d{6}$/,
        "Enter the six-digit code.",
      ),
  });

export const resendPasswordResetOtpSchema =
  z.object({
    email: emailSchema,
  });


/**
 * Inferred types ensure UI, actions and service methods all use
 * the same validated input contracts.
 */
export type LoginInput = z.infer<
  typeof loginSchema
>;

export type ForgotPasswordInput = z.infer<
  typeof forgotPasswordSchema
>;

export type ResendVerificationInput = z.infer<
  typeof resendVerificationSchema
>;

export type ResetPasswordInput = z.infer<
  typeof resetPasswordSchema
>;

export type VerifyEmailInput = z.infer<
  typeof verifyEmailSchema
>;

export type ProvisionUserInput = z.infer<
  typeof provisionUserSchema
>;

export type ChangePasswordInput = z.infer<
  typeof changePasswordSchema
>;

export type PasswordResetOtpInput =
  z.infer<
    typeof passwordResetOtpSchema
  >;