export type AuthErrorCode =
  | "INVALID_INPUT"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_UNAVAILABLE"
  | "ACCOUNT_INACTIVE"
  | "ACCOUNT_SUSPENDED"
  | "ACCOUNT_LOCKED"
  | "EMAIL_NOT_VERIFIED"
  | "EMAIL_ALREADY_VERIFIED"
  | "TOKEN_INVALID"
  | "TOKEN_EXPIRED"
  | "TOKEN_ALREADY_USED"
  | "PASSWORD_REUSED"
  | "RATE_LIMITED"
  | "GOOGLE_ACCOUNT_NOT_PROVISIONED"
  | "GOOGLE_EMAIL_NOT_VERIFIED"
  | "PERMISSION_DENIED"
  | "CONFIGURATION_ERROR"
  | "INTERNAL_ERROR";

type AuthErrorOptions = {
  /**
   * Safe message that can be shown to a user.
   */
  publicMessage: string;

  /**
   * HTTP-style status used by Route Handlers where needed.
   */
  statusCode: number;

  /**
   * Internal cause. Never send this directly to the browser.
   */
  cause?: unknown;
};

export class AuthDomainError extends Error {
  readonly code: AuthErrorCode;
  readonly publicMessage: string;
  readonly statusCode: number;

  constructor(
    code: AuthErrorCode,
    options: AuthErrorOptions,
  ) {
    super(options.publicMessage, {
      cause: options.cause,
    });

    this.name = "AuthDomainError";
    this.code = code;
    this.publicMessage =
      options.publicMessage;
    this.statusCode =
      options.statusCode;

    Object.setPrototypeOf(
      this,
      new.target.prototype,
    );
  }
}

/**
 * Generic login error.
 *
 * Do not tell the browser whether:
 * - The email exists
 * - The password was wrong
 * - The account is suspended
 * - The email is unverified
 */
export class InvalidCredentialsError extends AuthDomainError {
  constructor(cause?: unknown) {
    super("INVALID_CREDENTIALS", {
      publicMessage:
        "Email or password is incorrect, or the account is unavailable.",
      statusCode: 401,
      cause,
    });

    this.name =
      "InvalidCredentialsError";
  }
}

export class RateLimitError extends AuthDomainError {
  constructor(cause?: unknown) {
    super("RATE_LIMITED", {
      publicMessage:
        "Too many attempts. Please wait before trying again.",
      statusCode: 429,
      cause,
    });

    this.name = "RateLimitError";
  }
}

export class InvalidTokenError extends AuthDomainError {
  constructor(cause?: unknown) {
    super("TOKEN_INVALID", {
      publicMessage:
        "This link is invalid or has expired.",
      statusCode: 400,
      cause,
    });

    this.name = "InvalidTokenError";
  }
}

export class PermissionDeniedError extends AuthDomainError {
  constructor(cause?: unknown) {
    super("PERMISSION_DENIED", {
      publicMessage:
        "You do not have permission to perform this action.",
      statusCode: 403,
      cause,
    });

    this.name =
      "PermissionDeniedError";
  }
}

export class ConfigurationError extends AuthDomainError {
  constructor(
    message =
      "Authentication is not configured correctly.",
    cause?: unknown,
  ) {
    super("CONFIGURATION_ERROR", {
      publicMessage: message,
      statusCode: 500,
      cause,
    });

    this.name = "ConfigurationError";
  }
}

export function isAuthDomainError(
  error: unknown,
): error is AuthDomainError {
  return error instanceof AuthDomainError;
}

/**
 * Converts an unknown error into a safe browser message.
 */
export function getPublicAuthErrorMessage(
  error: unknown,
): string {
  if (isAuthDomainError(error)) {
    return error.publicMessage;
  }

  return "Authentication could not be completed. Please try again.";
}