import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  UserStatus,
} from "@prisma/client";

import {
  AuthService,
} from "./auth.service";

import {
  InvalidCredentialsError,
  InvalidTokenError,
} from "./auth.errors";

import type {
  AuthRepository,
} from "./auth.repository";

const NOW = new Date(
  "2026-08-14T08:00:00.000Z",
);

const context = {
  ipHash: "test-ip-hash",
  userAgent: "Vitest",
};

function createRepositoryMock() {
  return {
    countRecentAuthAttempts:
      vi.fn().mockResolvedValue({
        identityAttempts: 0,
        ipAttempts: 0,
      }),

    createAuthAttempt:
      vi.fn().mockResolvedValue(undefined),

    findUserByEmailWithCredentials:
      vi.fn(),

    findSafeUserByEmail:
      vi.fn(),

    findSafeUserById:
      vi.fn(),

    findUserStatusById:
      vi.fn(),

    updateLastLogin:
      vi.fn().mockResolvedValue(undefined),

    recordFailedLogin:
      vi.fn().mockResolvedValue({
        failedLoginCount: 1,
        lockedUntil: null,
      }),

    createAuditEvent:
      vi.fn().mockResolvedValue(undefined),

    replaceSecurityToken:
      vi.fn(),

    resetPasswordUsingToken:
      vi.fn(),

    verifyEmailUsingToken:
      vi.fn(),

    findExistingRoleIds:
      vi.fn(),

    createPendingUser:
      vi.fn(),
  };
}

describe("AuthService", () => {
  let repository:
    ReturnType<
      typeof createRepositoryMock
    >;

  let service: AuthService;

  beforeEach(() => {
    repository =
      createRepositoryMock();

    service = new AuthService(
      repository as unknown as AuthRepository,
      () => NOW,
    );
  });

  it("rejects an unknown credentials user", async () => {
    repository
      .findUserByEmailWithCredentials
      .mockResolvedValue(null);

    await expect(
      service.authenticateCredentials({
        email: "unknown@example.com",
        password:
          "TechNova!Secure2026",
        context,
      }),
    ).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );

    expect(
      repository.createAuthAttempt,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "LOGIN",
        successful: false,
      }),
    );
  });

  it("does not create a reset token for an unknown user", async () => {
    repository
      .findSafeUserByEmail
      .mockResolvedValue(null);

    const result =
      await service.requestPasswordReset({
        email: "unknown@example.com",
        context,
      });

    expect(result).toEqual({
        accepted: true,

        challengeToken:
          expect.any(String),
      });

      expect(
        result.challengeToken,
      ).toMatch(
        /^[A-Za-z0-9_-]{43}$/,
      );

      expect(
        result.delivery,
      ).toBeUndefined();

      expect(
        repository.replaceSecurityToken,
      ).not.toHaveBeenCalled();
  });

  it("rejects an invalid password-reset token", async () => {
    repository
      .resetPasswordUsingToken
      .mockResolvedValue(null);

    await expect(
      service.resetPassword({
        rawToken:
          "abcdefghijklmnopqrstuvwxyzABCDEFG1234567890_-",
        password:
          "TechNova!Secure2026",
        context,
      }),
    ).rejects.toBeInstanceOf(
      InvalidTokenError,
    );
  });

  it("authorizes a provisioned active Google user", async () => {
    repository
      .findSafeUserByEmail
      .mockResolvedValue({
        id: "user-1",
        email:
          "employee@technova.com",
        name: "Employee",
        image: null,
        emailVerified: NOW,
        status: UserStatus.ACTIVE,
        lockedUntil: null,
        sessionVersion: 1,
        roles: ["CASHIER"],
        permissions: [
          "dashboard:view",
        ],
      });

    const user =
      await service.authorizeGoogleLogin({
        profile: {
          email:
            "employee@technova.com",
          emailVerified: true,
        },
        context,
      });

    expect(user.email).toBe(
      "employee@technova.com",
    );

    expect(
      repository.updateLastLogin,
    ).toHaveBeenCalledWith(
      "user-1",
    );
  });

  it("rejects an unknown Google user", async () => {
    repository
      .findSafeUserByEmail
      .mockResolvedValue(null);

    await expect(
      service.authorizeGoogleLogin({
        profile: {
          email:
            "unknown@gmail.com",
          emailVerified: true,
        },
        context,
      }),
    ).rejects.toMatchObject({
      code:
        "GOOGLE_ACCOUNT_NOT_PROVISIONED",
    });
  });
});