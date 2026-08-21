"use server";

import { z } from "zod";

import {
  authEmailDelivery,
} from "@/lib/email/email.service";

import {
  getSecurityRequestContext,
} from "@/lib/security/request";

import {
  getPublicAuthErrorMessage,
} from "./auth.errors";

import {
  forgotPasswordSchema,
  loginSchema,
  passwordResetOtpSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.schema";

import {
  authService,
} from "./auth.service";

import type {
  AuthActionState,
  ForgotPasswordActionData,
  VerifyPasswordResetOtpActionData,
} from "./auth.types";

import {
  generateRawToken,
} from "@/lib/security/token";

import {
  AuthError,
} from "next-auth";

import {
  signIn,
  signOut,
} from "@/auth";

function getFieldErrors(
  error: z.ZodError,
): Record<string, string[]> {
  const flattened =
    z.flattenError(error);

  return flattened.fieldErrors;
}

/**
 * Email delivery failures must be observable on the server but must
 * not reveal whether a user exists.
 */
async function deliverPasswordResetEmail(
  delivery:
    | Parameters<
        typeof authEmailDelivery.sendPasswordResetEmail
      >[0]
    | undefined,
): Promise<void> {
  if (!delivery) {
    return;
  }

  try {
    await authEmailDelivery
      .sendPasswordResetEmail(
        delivery,
      );
  } catch (error) {
    console.error(
      "Password-reset email delivery failed.",
      error,
    );
  }
}

async function deliverVerificationEmail(
  delivery:
    | Parameters<
        typeof authEmailDelivery.sendVerificationEmail
      >[0]
    | undefined,
): Promise<void> {
  if (!delivery) {
    return;
  }

  try {
    await authEmailDelivery
      .sendVerificationEmail(
        delivery,
      );
  } catch (error) {
    console.error(
      "Verification email delivery failed.",
      error,
    );
  }
}

export async function forgotPasswordAction(
  _previousState:
    AuthActionState<
      ForgotPasswordActionData
    >,

  formData: FormData,
): Promise<
  AuthActionState<
    ForgotPasswordActionData
  >
> {
  const parsed =
    forgotPasswordSchema.safeParse({
      email:
        formData.get("email"),
    });

  /*
   * Return the same public response shape even for malformed input.
   */
  if (!parsed.success) {
    return {
      status: "error",

      message:
        "Enter a valid email address.",

      fieldErrors:
        getFieldErrors(
          parsed.error,
        ),
    };
  }

  try {
    const context =
      await getSecurityRequestContext();

    const result =
      await authService
        .requestPasswordReset({
          email:
            parsed.data.email,

          context,
        });

    await deliverPasswordResetEmail(
      result.delivery,
    );

    return {
      status: "success",

      message:
        "If an eligible account exists, a verification code has been sent.",

      data: {
        challengeToken:
          result.challengeToken,
      },
    };
  } catch (error) {
    /*
     * Do not reveal:
     * - Account existence
     * - Account status
     * - Rate-limit state
     * - SMTP delivery failures
     */
    console.error(
      "Password-reset request failed.",
      error,
    );

    return {
      status: "success",

      message:
        "If an eligible account exists, a verification code has been sent.",

      data: {
        challengeToken:
          generateRawToken(),
      },
    };
  }
}

export async function verifyPasswordResetOtpAction(
  _previousState:
    AuthActionState<
      VerifyPasswordResetOtpActionData
    >,

  formData: FormData,
): Promise<
  AuthActionState<
    VerifyPasswordResetOtpActionData
  >
> {
  const parsed =
    passwordResetOtpSchema.safeParse({
      challengeToken:
        formData.get(
          "challengeToken",
        ),

      otp:
        formData.get("otp"),
    });

  if (!parsed.success) {
    return {
      status: "error",

      message:
        "Enter the six-digit code.",

      fieldErrors:
        getFieldErrors(
          parsed.error,
        ),
    };
  }

  try {
    const context =
      await getSecurityRequestContext();

    const result =
      await authService
        .verifyPasswordResetOtp({
          challengeToken:
            parsed.data
              .challengeToken,

          otp:
            parsed.data.otp,

          context,
        });

    return {
      status: "success",

      message:
        "Code verified. Create your new password.",

      data: {
        resetToken:
          result.resetToken,
      },
    };
  } catch (error) {
    return {
      status: "error",

      message:
        getPublicAuthErrorMessage(
          error,
        ),
    };
  }
}

export async function resendVerificationAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed =
    resendVerificationSchema.safeParse({
      email: formData.get("email"),
    });

  if (!parsed.success) {
    return {
      status: "success",
      message:
        "If email verification is pending, a new verification link has been sent.",
    };
  }

  try {
    const context =
      await getSecurityRequestContext();

    const result =
      await authService
        .resendEmailVerification({
          email: parsed.data.email,
          context,
        });

    await deliverVerificationEmail(
      result.delivery,
    );

    return {
      status: "success",
      message:
        "If email verification is pending, a new verification link has been sent.",
    };
  } catch (error) {
    console.error(
      "Verification resend failed.",
      error,
    );

    return {
      status: "success",
      message:
        "If email verification is pending, a new verification link has been sent.",
    };
  }
}

export async function resetPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed =
    resetPasswordSchema.safeParse({
      token: formData.get("token"),
      password:
        formData.get("password"),
      confirmPassword:
        formData.get(
          "confirmPassword",
        ),
    });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        "Review the highlighted fields.",

      fieldErrors:
        getFieldErrors(
          parsed.error,
        ),
    };
  }

  try {
    const context =
      await getSecurityRequestContext();

    await authService.resetPassword({
      rawToken: parsed.data.token,
      password: parsed.data.password,
      context,
    });

    return {
      status: "success",
      message:
        "Your password has been reset. You can now sign in.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        getPublicAuthErrorMessage(
          error,
        ),
    };
  }
}

export async function verifyEmailAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed =
    verifyEmailSchema.safeParse({
      token: formData.get("token"),
    });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        "This verification link is invalid or has expired.",
    };
  }

  try {
    const context =
      await getSecurityRequestContext();

    await authService.verifyEmail({
      rawToken: parsed.data.token,
      context,
    });

    return {
      status: "success",
      message:
        "Your email has been verified. You can now sign in.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        getPublicAuthErrorMessage(
          error,
        ),
    };
  }
}

/**
 * Utility for future authenticated administrative actions.
 */


export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed =
    loginSchema.safeParse({
      email: formData.get("email"),
      password:
        formData.get("password"),
    });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        "Enter a valid email and password.",
      fieldErrors:
        getFieldErrors(
          parsed.error,
        ),
    };
  }

  try {
    /*
     * Successful signIn redirects to /dashboard.
     */
    await signIn("credentials", {
      email: parsed.data.email,
      password:
        parsed.data.password,
      redirectTo: "/dashboard",
    });

    return {
      status: "success",
    };
  } catch (error) {
    if (
      error instanceof AuthError
    ) {
      return {
        status: "error",
        message:
          "Email or password is incorrect, or the account is unavailable.",
      };
    }

    /*
     * Auth.js/Next.js uses a redirect exception on successful login.
     * It must be rethrown.
     */
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({
    redirectTo: "/login",
  });
}

export async function googleSignInAction(): Promise<void> {
  await signIn("google", {
    redirectTo: "/dashboard",
  });
}

