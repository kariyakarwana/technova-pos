import type {
  UserStatus,
} from "@prisma/client";

export type AuthenticationProvider =
  | "credentials"
  | "google";

export type AuditOutcomeValue =
  | "SUCCESS"
  | "FAILURE";

export type AuthenticationAuditAction =
  | "AUTH_LOGIN_SUCCESS"
  | "AUTH_LOGIN_FAILURE"
  | "AUTH_LOGOUT"
  | "AUTH_ACCOUNT_LOCKED"
  | "AUTH_EMAIL_VERIFICATION_REQUESTED"
  | "AUTH_EMAIL_VERIFIED"
  | "AUTH_PASSWORD_RESET_REQUESTED"
  | "AUTH_PASSWORD_RESET_COMPLETED"
  | "AUTH_PASSWORD_CHANGED"
  | "AUTH_GOOGLE_LOGIN_SUCCESS"
  | "AUTH_GOOGLE_LOGIN_REJECTED"
  | "AUTH_PERMISSION_DENIED";

/**
 * Safe role representation used outside the repository.
 */
export type AuthRole = {
  id: string;
  name: string;
};

/**
 * Safe permission representation.
 */
export type AuthPermission = {
  id: string;
  key: string;
};

/**
 * Safe user object.
 *
 * This must never include:
 * - passwordHash
 * - access_token
 * - refresh_token
 * - id_token
 * - raw verification/reset tokens
 */
export type SafeAuthUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
  status: UserStatus;
  lockedUntil: Date | null;
  sessionVersion: number;
  roles: string[];
  permissions: string[];
};

/**
 * Result returned by successful credential verification.
 */
export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  roles: string[];
  permissions: string[];
  sessionVersion: number;
};

/**
 * Internal user type required for password comparison.
 *
 * Keep this inside the repository/service boundary.
 */
export type UserWithCredentials = SafeAuthUser & {
  passwordHash: string | null;
  failedLoginCount: number;
};

/**
 * Request data permitted in audit events.
 *
 * The raw IP address must not be stored.
 */
export type AuthRequestContext = {
  ipHash: string;
  userAgent: string | null;
};

export type AuthenticationAuditData = {
  action: AuthenticationAuditAction;
  outcome: AuditOutcomeValue;
  userId?: string;
  context?: AuthRequestContext;
  metadata?: Record<
    string,
    string | number | boolean | null
  >;
};



export type SecurityTokenRecord = {
  id: string;
  userId: string;
  purpose:
    | "EMAIL_VERIFICATION"
    | "PASSWORD_RESET";
  expiresAt: Date;
  usedAt: Date | null;
};

export type RateLimitCounts = {
  identityAttempts: number;
  ipAttempts: number;
};

export type FailedLoginResult = {
  failedLoginCount: number;
  lockedUntil: Date | null;
};

export type UserStatusSnapshot = {
  id: string;
  status: UserStatus;
  emailVerified: Date | null;
  sessionVersion: number;
};
/**
 * Standard result returned by Server Actions.
 *
 * Field errors use arrays because Zod can return multiple messages
 * for one field.
 */
export type AuthActionState<
  TData = undefined,
> = {
  status:
    | "idle"
    | "success"
    | "error";

  message?: string;

  fieldErrors?: Record<
    string,
    string[]
  >;

  data?: TData;
};

export type LoginActionData = {
  redirectTo: string;
};

export type VerifyEmailResult = {
  verified: boolean;
};

export type PasswordResetRequestResult = {
  accepted: true;
};

export const initialAuthActionState: AuthActionState = {
  status: "idle",
};


export type TokenDelivery = {
  email: string;
  rawToken: string;
  expiresAt: Date;
};

export type GenericRequestResult = {
  accepted: true;
  delivery?: TokenDelivery;
};

export type GoogleProfileInput = {
  email: string;
  emailVerified: boolean;
};

export type AccountProvisionResult = {
  user: SafeAuthUser;
  delivery: TokenDelivery;
};