import {
  hashPassword,
  validatePasswordStrength,
  verifyPassword,
} from "@/lib/security/password";

import {
  hashSensitiveIdentifier,
} from "@/lib/security/request";

import {
  createEmailVerificationToken,
  createPasswordResetOtp,
  createPasswordResetToken,
  hashOtp,
  hashToken,
  PASSWORD_RESET_GRANT_LIFETIME_MS,
} from "@/lib/security/token";

import {
  AuthDomainError,
  InvalidCredentialsError,
  InvalidTokenError,
  RateLimitError,
} from "./auth.errors";

import {
  authRepository,
  AuthRepository,
} from "./auth.repository";

import type {
  AccountProvisionResult,
  AuthenticatedUser,
  AuthRequestContext,
  GenericRequestResult,
  GoogleProfileInput,
  PasswordResetOtpRequestResult,
  PasswordResetOtpVerificationResult,
  SafeAuthUser,
} from "./auth.types";

import type {
    ProvisionUserInput,
} from "./auth.schema";

/*
 * String literals are used instead of importing Prisma enums.
 * This keeps the service independent from Prisma.
 */
const EMAIL_VERIFICATION_PURPOSE =
  "EMAIL_VERIFICATION" as const;

const PASSWORD_RESET_PURPOSE =
  "PASSWORD_RESET" as const;

const ACTIVE_STATUS =
  "ACTIVE" as const;

const PENDING_STATUS =
  "PENDING_VERIFICATION" as const;

const LOGIN_ACTION = "LOGIN";
const FORGOT_PASSWORD_ACTION =
  "FORGOT_PASSWORD";
const RESEND_VERIFICATION_ACTION =
  "RESEND_VERIFICATION";

const LOGIN_WINDOW_MS =
  15 * 60 * 1000;

const LOGIN_IDENTITY_LIMIT = 5;
const LOGIN_IP_LIMIT = 20;

const REQUEST_WINDOW_MS =
  30 * 60 * 1000;

const REQUEST_IDENTITY_LIMIT = 3;
const REQUEST_IP_LIMIT = 12;

const ACCOUNT_LOCK_MS =
  15 * 60 * 1000;

export type AuthServiceClock = () => Date;

function toAuthenticatedUser(
  user: SafeAuthUser,
): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    roles: user.roles,
    permissions: user.permissions,
    sessionVersion:
      user.sessionVersion,
  };
}

export class AuthService {
  constructor(
    private readonly repository: AuthRepository =
      authRepository,

    private readonly now: AuthServiceClock =
      () => new Date(),
  ) {}

  /**
   * Checks a persistent database-backed abuse window.
   */
  private async enforceRateLimit(input: {
    action: string;
    identity: string;
    context: AuthRequestContext;
    windowMs: number;
    identityLimit: number;
    ipLimit: number;
    failedOnly?: boolean;
  }): Promise<string> {
    const identityHash =
      hashSensitiveIdentifier(
        input.identity,
      );

    const since = new Date(
      this.now().getTime() -
        input.windowMs,
    );

    const counts =
      await this.repository.countRecentAuthAttempts({
        action: input.action,
        identityHash,
        ipHash: input.context.ipHash,
        since,
        successful:
          input.failedOnly
            ? false
            : undefined,
      });

    if (
      counts.identityAttempts >=
        input.identityLimit ||
      counts.ipAttempts >=
        input.ipLimit
    ) {
      throw new RateLimitError();
    }

    return identityHash;
  }

  private async recordAttempt(input: {
    action: string;
    identityHash: string;
    context: AuthRequestContext;
    successful: boolean;
  }): Promise<void> {
    await this.repository.createAuthAttempt({
      action: input.action,
      identityHash:
        input.identityHash,
      ipHash: input.context.ipHash,
      successful: input.successful,
    });
  }

  /**
   * Validates Credentials-provider login.
   *
   * The public error deliberately does not reveal whether the account:
   * - Exists
   * - Is inactive
   * - Is suspended
   * - Is unverified
   * - Has the wrong password
   */
  async authenticateCredentials(input: {
    email: string;
    password: string;
    context: AuthRequestContext;
  }): Promise<AuthenticatedUser> {
    const email =
      input.email.trim().toLowerCase();

    const identityHash =
      await this.enforceRateLimit({
        action: LOGIN_ACTION,
        identity: email,
        context: input.context,
        windowMs: LOGIN_WINDOW_MS,
        identityLimit:
          LOGIN_IDENTITY_LIMIT,
        ipLimit: LOGIN_IP_LIMIT,
        failedOnly: true,
      });

    const user =
      await this.repository
        .findUserByEmailWithCredentials(
          email,
        );

    if (!user || !user.passwordHash) {
      await this.recordAttempt({
        action: LOGIN_ACTION,
        identityHash,
        context: input.context,
        successful: false,
      });

      await this.repository.createAuditEvent({
        action: "AUTH_LOGIN_FAILURE",
        outcome: "FAILURE",
        context: input.context,
        metadata: {
          provider: "credentials",
          reason: "invalid_credentials",
        },
      });

      throw new InvalidCredentialsError();
    }

    const accountIsLocked =
      user.lockedUntil !== null &&
      user.lockedUntil.getTime() >
        this.now().getTime();

    if (accountIsLocked) {
      await this.recordAttempt({
        action: LOGIN_ACTION,
        identityHash,
        context: input.context,
        successful: false,
      });

      await this.repository.createAuditEvent({
        action: "AUTH_LOGIN_FAILURE",
        outcome: "FAILURE",
        userId: user.id,
        context: input.context,
        metadata: {
          provider: "credentials",
          reason: "account_locked",
        },
      });

      throw new InvalidCredentialsError();
    }
    
    const passwordMatches =
      await verifyPassword(
        input.password,
        user.passwordHash,
      );

    if (!passwordMatches) {
      const lockUntil = new Date(
        this.now().getTime() +
          ACCOUNT_LOCK_MS,
      );

      const failure =
        await this.repository.recordFailedLogin(
          user.id,
          LOGIN_IDENTITY_LIMIT,
          lockUntil,
        );

      await this.recordAttempt({
        action: LOGIN_ACTION,
        identityHash,
        context: input.context,
        successful: false,
      });

      await this.repository.createAuditEvent({
        action:
          failure.lockedUntil
            ? "AUTH_ACCOUNT_LOCKED"
            : "AUTH_LOGIN_FAILURE",

        outcome: "FAILURE",
        userId: user.id,
        context: input.context,
        metadata: {
          provider: "credentials",
          reason: "invalid_credentials",
          failedLoginCount:
            failure.failedLoginCount,
        },
      });

      throw new InvalidCredentialsError();
    }

    

    

    if (
      user.status !== ACTIVE_STATUS ||
      !user.emailVerified
    ) {
      await this.recordAttempt({
        action: LOGIN_ACTION,
        identityHash,
        context: input.context,
        successful: false,
      });

      await this.repository.createAuditEvent({
        action: "AUTH_LOGIN_FAILURE",
        outcome: "FAILURE",
        userId: user.id,
        context: input.context,
        metadata: {
          provider: "credentials",
          reason:
            user.status !==
            ACTIVE_STATUS
              ? "account_unavailable"
              : "email_not_verified",
        },
      });

      throw new InvalidCredentialsError();
    }

    await this.repository.updateLastLogin(
      user.id,
    );

    await this.recordAttempt({
      action: LOGIN_ACTION,
      identityHash,
      context: input.context,
      successful: true,
    });

    await this.repository.createAuditEvent({
      action: "AUTH_LOGIN_SUCCESS",
      outcome: "SUCCESS",
      userId: user.id,
      context: input.context,
      metadata: {
        provider: "credentials",
      },
    });

    return toAuthenticatedUser(user);
  }

  /**
   * Creates a password-reset token only for eligible accounts.
   *
   * The returned accepted value is always true so the UI does not
   * reveal whether the email exists.
   */
    /**
   * Starts a password-reset OTP challenge.
   *
   * A challenge token is always returned, including when:
   * - The email does not exist
   * - The user is inactive
   * - The user is suspended
   * - The email has not been verified
   *
   * This prevents account enumeration.
   */
  async requestPasswordReset(input: {
    email: string;
    context: AuthRequestContext;
  }): Promise<PasswordResetOtpRequestResult> {
    const email =
      input.email.trim().toLowerCase();

    const identityHash =
      await this.enforceRateLimit({
        action:
          FORGOT_PASSWORD_ACTION,

        identity: email,
        context: input.context,
        windowMs:
          REQUEST_WINDOW_MS,

        identityLimit:
          REQUEST_IDENTITY_LIMIT,

        ipLimit:
          REQUEST_IP_LIMIT,
      });

    await this.recordAttempt({
      action:
        FORGOT_PASSWORD_ACTION,

      identityHash,
      context: input.context,
      successful: true,
    });

    /*
     * Create the challenge before checking the user.
     *
     * This ensures eligible and ineligible requests both receive
     * the same shape of public response.
     */
    const generated =
      createPasswordResetOtp(
        this.now(),
      );

    const user =
      await this.repository
        .findSafeUserByEmail(
          email,
        );

    const userIsEligible =
      user !== null &&
      user.status ===
        ACTIVE_STATUS &&
      user.emailVerified !== null;

    if (!userIsEligible) {
      /*
       * Do not store the fake challenge and do not send an email.
       * The browser still moves to the OTP screen.
       */
      return {
        accepted: true,

        challengeToken:
          generated.challengeToken,
      };
    }

    await this.repository
      .replaceSecurityToken({
        userId: user.id,

        purpose:
          PASSWORD_RESET_PURPOSE,

        /*
         * The challenge token remains in the browser.
         * Only its SHA-256 hash is stored.
         */
        tokenHash:
          generated.challengeHash,

        /*
         * Only the HMAC digest of the six-digit OTP is stored.
         */
        otpHash:
          generated.otpHash,

        expiresAt:
          generated.expiresAt,
      });

    await this.repository
      .createAuditEvent({
        action:
          "AUTH_PASSWORD_RESET_OTP_SENT",

        outcome: "SUCCESS",
        userId: user.id,
        context: input.context,
      });

    return {
      accepted: true,

      challengeToken:
        generated.challengeToken,

      delivery: {
        email: user.email,
        otp: generated.otp,

        expiresAt:
          generated.expiresAt,
      },
    };
  }

  /**
   * Verifies a six-digit password-reset OTP.
   *
   * Successful verification converts the OTP challenge into a
   * high-entropy, short-lived password-reset grant.
   */
  async verifyPasswordResetOtp(input: {
    challengeToken: string;
    otp: string;
    context: AuthRequestContext;
  }): Promise<PasswordResetOtpVerificationResult> {
    const now = this.now();

    /*
     * This token is not emailed. It is returned only after the
     * correct OTP is supplied.
     */
    const resetGrant =
      createPasswordResetToken(now);

    const verifiedTokenId =
      await this.repository
        .verifyPasswordResetOtp({
          challengeHash:
            hashToken(
              input.challengeToken,
            ),

          otpHash:
            hashOtp(
              input.challengeToken,
              input.otp,
            ),

          resetTokenHash:
            resetGrant.tokenHash,

          resetTokenExpiresAt:
            new Date(
              now.getTime() +
                PASSWORD_RESET_GRANT_LIFETIME_MS,
            ),

          now,
        });

    if (!verifiedTokenId) {
      await this.repository
        .createAuditEvent({
          action:
            "AUTH_PASSWORD_RESET_OTP_REJECTED",

          outcome: "FAILURE",
          context: input.context,

          metadata: {
            reason:
              "invalid_expired_or_attempt_limit",
          },
        });

      throw new AuthDomainError(
        "TOKEN_INVALID",
        {
          publicMessage:
            "The code is invalid or has expired.",

          statusCode: 400,
        },
      );
    }

    await this.repository
      .createAuditEvent({
        action:
          "AUTH_PASSWORD_RESET_OTP_VERIFIED",

        outcome: "SUCCESS",
        context: input.context,

        metadata: {
          securityTokenId:
            verifiedTokenId,
        },
      });

    return {
      resetToken:
        resetGrant.rawToken,
    };
  }

  /**
   * Consumes the short-lived reset grant and changes the password.
   */
  async resetPassword(input: {
    rawToken: string;
    password: string;
    context: AuthRequestContext;
  }): Promise<void> {
    const validation =
      validatePasswordStrength(
        input.password,
      );

    if (!validation.valid) {
      throw new AuthDomainError(
        "INVALID_INPUT",
        {
          publicMessage:
            validation.errors[0] ??
            "The password is invalid.",

          statusCode: 400,
        },
      );
    }

    const passwordHash =
      await hashPassword(
        input.password,
      );

    const tokenHash =
      hashToken(
        input.rawToken,
      );

    const userId =
      await this.repository
        .resetPasswordUsingToken({
          tokenHash,
          passwordHash,
          now: this.now(),
        });

    if (!userId) {
      await this.repository
        .createAuditEvent({
          action:
            "AUTH_PASSWORD_RESET_COMPLETED",

          outcome: "FAILURE",
          context: input.context,

          metadata: {
            reason:
              "invalid_or_expired_token",
          },
        });

      throw new InvalidTokenError();
    }

    await this.repository
      .createAuditEvent({
        action:
          "AUTH_PASSWORD_RESET_COMPLETED",

        outcome: "SUCCESS",
        userId,
        context: input.context,
      });
  }

  async resendEmailVerification(input: {
    email: string;
    context: AuthRequestContext;
  }): Promise<GenericRequestResult> {
    const email =
      input.email.trim().toLowerCase();

    const identityHash =
      await this.enforceRateLimit({
        action:
          RESEND_VERIFICATION_ACTION,
        identity: email,
        context: input.context,
        windowMs: REQUEST_WINDOW_MS,
        identityLimit:
          REQUEST_IDENTITY_LIMIT,
        ipLimit: REQUEST_IP_LIMIT,
      });

    await this.recordAttempt({
      action:
        RESEND_VERIFICATION_ACTION,
      identityHash,
      context: input.context,
      successful: true,
    });

    const user =
      await this.repository
        .findSafeUserByEmail(email);

    if (
      !user ||
      user.status !== PENDING_STATUS ||
      user.emailVerified
    ) {
      return {
        accepted: true,
      };
    }

    const generated =
      createEmailVerificationToken(
        this.now(),
      );

    await this.repository.replaceSecurityToken({
      userId: user.id,
      purpose:
        EMAIL_VERIFICATION_PURPOSE,
      tokenHash:
        generated.tokenHash,
      expiresAt:
        generated.expiresAt,
    });

    await this.repository.createAuditEvent({
      action:
        "AUTH_EMAIL_VERIFICATION_REQUESTED",
      outcome: "SUCCESS",
      userId: user.id,
      context: input.context,
    });

    return {
      accepted: true,

      delivery: {
        email: user.email,
        rawToken:
          generated.rawToken,
        expiresAt:
          generated.expiresAt,
      },
    };
  }

  async verifyEmail(input: {
    rawToken: string;
    context: AuthRequestContext;
  }): Promise<SafeAuthUser> {
    const tokenHash =
      hashToken(input.rawToken);

    const user =
      await this.repository
        .verifyEmailUsingToken({
          tokenHash,
          now: this.now(),
        });

    if (!user) {
      await this.repository.createAuditEvent({
        action:
          "AUTH_EMAIL_VERIFIED",
        outcome: "FAILURE",
        context: input.context,
        metadata: {
          reason:
            "invalid_or_expired_token",
        },
      });

      throw new InvalidTokenError();
    }

    await this.repository.createAuditEvent({
      action:
        "AUTH_EMAIL_VERIFIED",
      outcome: "SUCCESS",
      userId: user.id,
      context: input.context,
    });

    return user;
  }

  /**
   * Google OAuth is login-only.
   *
   * Unknown Google accounts are rejected. A TechNova administrator
   * must provision the employee before Google login is permitted.
   */
  async authorizeGoogleLogin(input: {
    profile: GoogleProfileInput;
    context: AuthRequestContext;
  }): Promise<AuthenticatedUser> {
    const email =
      input.profile.email
        .trim()
        .toLowerCase();

    if (!input.profile.emailVerified) {
      await this.repository.createAuditEvent({
        action:
          "AUTH_GOOGLE_LOGIN_REJECTED",
        outcome: "FAILURE",
        context: input.context,
        metadata: {
          reason:
            "google_email_not_verified",
        },
      });

      throw new AuthDomainError(
        "GOOGLE_EMAIL_NOT_VERIFIED",
        {
          publicMessage:
            "This Google account cannot be used to sign in.",
          statusCode: 403,
        },
      );
    }

    const user =
      await this.repository
        .findSafeUserByEmail(email);

    if (!user) {
      await this.repository.createAuditEvent({
        action:
          "AUTH_GOOGLE_LOGIN_REJECTED",
        outcome: "FAILURE",
        context: input.context,
        metadata: {
          reason:
            "account_not_provisioned",
        },
      });

      throw new AuthDomainError(
        "GOOGLE_ACCOUNT_NOT_PROVISIONED",
        {
          publicMessage:
            "This Google account is not registered with TechNova.",
          statusCode: 403,
        },
      );
    }

    if (
      user.status !== ACTIVE_STATUS ||
      !user.emailVerified
    ) {
      await this.repository.createAuditEvent({
        action:
          "AUTH_GOOGLE_LOGIN_REJECTED",
        outcome: "FAILURE",
        userId: user.id,
        context: input.context,
        metadata: {
          reason:
            "account_unavailable",
        },
      });

      throw new AuthDomainError(
        "ACCOUNT_UNAVAILABLE",
        {
          publicMessage:
            "This account is not available.",
          statusCode: 403,
        },
      );
    }

    await this.repository.updateLastLogin(
      user.id,
    );

    await this.repository.createAuditEvent({
      action:
        "AUTH_GOOGLE_LOGIN_SUCCESS",
      outcome: "SUCCESS",
      userId: user.id,
      context: input.context,
      metadata: {
        provider: "google",
      },
    });

    return toAuthenticatedUser(user);
  }

  /**
   * Provisions an employee and issues their initial verification link.
   *
   * The caller must already have users:manage permission.
   */
  async provisionUser(
    input: ProvisionUserInput & {
      context: AuthRequestContext;
    },
  ): Promise<AccountProvisionResult> {
    const email =
      input.email.trim().toLowerCase();

    const existing =
      await this.repository
        .findSafeUserByEmail(email);

    if (existing) {
      throw new AuthDomainError(
        "INVALID_INPUT",
        {
          publicMessage:
            "A user with this email already exists.",
          statusCode: 409,
        },
      );
    }

    const uniqueRoleIds = [
      ...new Set(input.roleIds),
    ];

    const existingRoleIds =
      await this.repository
        .findExistingRoleIds(
          uniqueRoleIds,
        );

    if (
      existingRoleIds.length !==
      uniqueRoleIds.length
    ) {
      throw new AuthDomainError(
        "INVALID_INPUT",
        {
          publicMessage:
            "One or more selected roles are invalid.",
          statusCode: 400,
        },
      );
    }

    const user =
      await this.repository
        .createPendingUser({
          email,
          name: input.name.trim(),
          roleIds: uniqueRoleIds,
        });

    const generated =
      createEmailVerificationToken(
        this.now(),
      );

    await this.repository.replaceSecurityToken({
      userId: user.id,
      purpose:
        EMAIL_VERIFICATION_PURPOSE,
      tokenHash:
        generated.tokenHash,
      expiresAt:
        generated.expiresAt,
    });

    await this.repository.createAuditEvent({
      action:
        "AUTH_EMAIL_VERIFICATION_REQUESTED",
      outcome: "SUCCESS",
      userId: user.id,
      context: input.context,
      metadata: {
        reason:
          "account_provisioned",
      },
    });

    return {
      user,

      delivery: {
        email: user.email,
        rawToken:
          generated.rawToken,
        expiresAt:
          generated.expiresAt,
      },
    };
  }

  /**
   * Revalidates current account state for protected requests.
   */
  async validateSessionUser(input: {
    userId: string;
    expectedSessionVersion: number;
  }): Promise<SafeAuthUser | null> {
    const status =
      await this.repository
        .findUserStatusById(
          input.userId,
        );

    if (
      !status ||
      status.status !== ACTIVE_STATUS ||
      !status.emailVerified ||
      status.sessionVersion !==
        input.expectedSessionVersion
    ) {
      return null;
    }

    return this.repository.findSafeUserById(
      input.userId,
    );
  }

  /**
 * Loads current authorization claims for a new Auth.js session.
 */
    async getSessionUserById(
    userId: string,
    ): Promise<AuthenticatedUser | null> {
    const user =
        await this.repository
        .findSafeUserById(userId);

    if (
        !user ||
        user.status !== ACTIVE_STATUS ||
        !user.emailVerified
    ) {
        return null;
    }

    return toAuthenticatedUser(user);
    }

    async recordPermissionDenied(input: {
        userId: string;
        permission: string;
        context: AuthRequestContext;
    }): Promise<void> {
    await this.repository.createAuditEvent({
        action:
        "AUTH_PERMISSION_DENIED",
        outcome: "FAILURE",
        userId: input.userId,
        context: input.context,
        metadata: {
        permission:
            input.permission,
        },
    });
    }
}

export const authService =
  new AuthService();