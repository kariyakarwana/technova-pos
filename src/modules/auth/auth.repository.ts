import {
  AuditOutcome,
  Prisma,
  TokenPurpose,
  UserStatus,
} from "@/generated/prisma";

import { prisma } from "@/lib/db/prisma";

import type {
  AuthenticationAuditData,
  FailedLoginResult,
  RateLimitCounts,
  SafeAuthUser,
  SecurityTokenRecord,
  UserStatusSnapshot,
  UserWithCredentials,
} from "./auth.types";

/**
 * Relations needed to build authentication claims.
 *
 * This loads:
 * User → UserRole → Role → RolePermission → Permission
 */
const authenticationUserInclude = {
  roles: {
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.UserInclude;

type AuthenticationUserRecord =
  Prisma.UserGetPayload<{
    include: typeof authenticationUserInclude;
  }>;

/**
 * Converts a Prisma user record into a safe authentication user.
 *
 * OAuth tokens, password hashes and internal relational structures
 * must not leave the repository accidentally.
 */
function mapSafeAuthUser(
  user: AuthenticationUserRecord,
): SafeAuthUser {
  const roles = user.roles.map(
    (userRole) => userRole.role.name,
  );

  const permissions = [
    ...new Set(
      user.roles.flatMap((userRole) =>
        userRole.role.permissions.map(
          (rolePermission) =>
            rolePermission.permission.key,
        ),
      ),
    ),
  ];

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    emailVerified: user.emailVerified,
    status: user.status,
    lockedUntil: user.lockedUntil,
    sessionVersion: user.sessionVersion,
    roles,
    permissions,
  };
}

function mapUserWithCredentials(
  user: AuthenticationUserRecord,
): UserWithCredentials {
  return {
    ...mapSafeAuthUser(user),
    passwordHash: user.passwordHash,
    failedLoginCount:
      user.failedLoginCount,
  };
}

function mapSecurityToken(
  token: {
    id: string;
    userId: string;
    purpose: TokenPurpose;
    expiresAt: Date;
    usedAt: Date | null;
  },
): SecurityTokenRecord {
  return {
    id: token.id,
    userId: token.userId,
    purpose: token.purpose,
    expiresAt: token.expiresAt,
    usedAt: token.usedAt,
  };
}

export class AuthRepository {
  /**
   * Finds a user for credentials authentication.
   *
   * This is one of the few repository methods allowed to return
   * passwordHash, and it remains inside the service boundary.
   */
  async findUserByEmailWithCredentials(
    email: string,
  ): Promise<UserWithCredentials | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },

      include: authenticationUserInclude,
    });

    if (!user) {
      return null;
    }

    return mapUserWithCredentials(user);
  }

  /**
   * Finds a safe user by email.
   *
   * Used for Google OAuth eligibility and account provisioning.
   */
  async findSafeUserByEmail(
    email: string,
  ): Promise<SafeAuthUser | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },

      include: authenticationUserInclude,
    });

    if (!user) {
      return null;
    }

    return mapSafeAuthUser(user);
  }

  async findSafeUserById(
    userId: string,
  ): Promise<SafeAuthUser | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      include: authenticationUserInclude,
    });

    if (!user) {
      return null;
    }

    return mapSafeAuthUser(user);
  }

  /**
   * Lightweight lookup used on protected server requests.
   *
   * This avoids loading all roles when only current account status
   * and session invalidation data are required.
   */
  async findUserStatusById(
    userId: string,
  ): Promise<UserStatusSnapshot | null> {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        status: true,
        emailVerified: true,
        sessionVersion: true,
      },
    });
  }

  async updateLastLogin(
    userId: string,
  ): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        lastLoginAt: new Date(),
        failedLoginCount: 0,
        lockedUntil: null,
      },
    });
  }

  async resetFailedLoginAttempts(
    userId: string,
  ): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        failedLoginCount: 0,
        lockedUntil: null,
      },
    });
  }

  /**
   * Records a failed login and optionally locks the account.
   *
   * The service decides the threshold and lock duration.
   */
  async recordFailedLogin(
    userId: string,
    maximumFailures: number,
    lockUntil: Date,
  ): Promise<FailedLoginResult> {
    return prisma.$transaction(
      async (transaction) => {
        const user =
          await transaction.user.findUnique({
            where: {
              id: userId,
            },

            select: {
              failedLoginCount: true,
              lockedUntil: true,
            },
          });

        if (!user) {
          return {
            failedLoginCount: 0,
            lockedUntil: null,
          };
        }

        const failedLoginCount =
          user.failedLoginCount + 1;

        const shouldLock =
          failedLoginCount >= maximumFailures;

        const updated =
          await transaction.user.update({
            where: {
              id: userId,
            },

            data: {
              failedLoginCount,
              lockedUntil: shouldLock
                ? lockUntil
                : user.lockedUntil,
            },

            select: {
              failedLoginCount: true,
              lockedUntil: true,
            },
          });

        return updated;
      },
    );
  }

  /**
   * Records an authentication attempt for persistent throttling.
   *
   * identityHash must already be hashed by the service.
   */
  async createAuthAttempt(input: {
    action: string;
    identityHash: string;
    ipHash: string;
    successful: boolean;
  }): Promise<void> {
    await prisma.authAttempt.create({
      data: {
        action: input.action,
        identityHash: input.identityHash,
        ipHash: input.ipHash,
        successful: input.successful,
      },
    });
  }

  async countRecentAuthAttempts(input: {
    action: string;
    identityHash: string;
    ipHash: string;
    since: Date;
  }): Promise<RateLimitCounts> {
    const [
      identityAttempts,
      ipAttempts,
    ] = await Promise.all([
      prisma.authAttempt.count({
        where: {
          action: input.action,
          identityHash:
            input.identityHash,
          createdAt: {
            gte: input.since,
          },
        },
      }),

      prisma.authAttempt.count({
        where: {
          action: input.action,
          ipHash: input.ipHash,
          createdAt: {
            gte: input.since,
          },
        },
      }),
    ]);

    return {
      identityAttempts,
      ipAttempts,
    };
  }

  async deleteOldAuthAttempts(
    olderThan: Date,
  ): Promise<number> {
    const result =
      await prisma.authAttempt.deleteMany({
        where: {
          createdAt: {
            lt: olderThan,
          },
        },
      });

    return result.count;
  }

  /**
   * Invalidates all existing unused tokens of one purpose before
   * issuing a new token.
   */
  async replaceSecurityToken(input: {
    userId: string;
    purpose: TokenPurpose;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<SecurityTokenRecord> {
    const token = await prisma.$transaction(
      async (transaction) => {
        const now = new Date();

        await transaction.securityToken.updateMany({
          where: {
            userId: input.userId,
            purpose: input.purpose,
            usedAt: null,
          },

          data: {
            usedAt: now,
          },
        });

        return transaction.securityToken.create({
          data: {
            userId: input.userId,
            purpose: input.purpose,
            tokenHash: input.tokenHash,
            expiresAt: input.expiresAt,
          },

          select: {
            id: true,
            userId: true,
            purpose: true,
            expiresAt: true,
            usedAt: true,
          },
        });
      },
    );

    return mapSecurityToken(token);
  }

  async findValidSecurityToken(input: {
    tokenHash: string;
    purpose: TokenPurpose;
    now?: Date;
  }): Promise<SecurityTokenRecord | null> {
    const now = input.now ?? new Date();

    const token =
      await prisma.securityToken.findFirst({
        where: {
          tokenHash: input.tokenHash,
          purpose: input.purpose,
          usedAt: null,
          expiresAt: {
            gt: now,
          },
        },

        select: {
          id: true,
          userId: true,
          purpose: true,
          expiresAt: true,
          usedAt: true,
        },
      });

    if (!token) {
      return null;
    }

    return mapSecurityToken(token);
  }

  /**
   * Atomically verifies a pending user's email.
   *
   * Returns the activated safe user, or null when the token became
   * invalid/used/expired before the transaction completed.
   */
  async verifyEmailUsingToken(input: {
    tokenHash: string;
    now?: Date;
  }): Promise<SafeAuthUser | null> {
    const now = input.now ?? new Date();

    return prisma.$transaction(
      async (transaction) => {
        const token =
          await transaction.securityToken.findFirst({
            where: {
              tokenHash: input.tokenHash,
              purpose:
                TokenPurpose.EMAIL_VERIFICATION,
              usedAt: null,
              expiresAt: {
                gt: now,
              },
            },

            include: {
              user: true,
            },
          });

        if (
          !token ||
          token.user.status !==
            UserStatus.PENDING_VERIFICATION
        ) {
          return null;
        }

        const consumed =
          await transaction.securityToken.updateMany({
            where: {
              id: token.id,
              usedAt: null,
              expiresAt: {
                gt: now,
              },
            },

            data: {
              usedAt: now,
            },
          });

        if (consumed.count !== 1) {
          return null;
        }

        await transaction.user.update({
          where: {
            id: token.userId,
          },

          data: {
            emailVerified: now,
            status: UserStatus.ACTIVE,
          },
        });

        const activatedUser =
          await transaction.user.findUnique({
            where: {
              id: token.userId,
            },

            include:
              authenticationUserInclude,
          });

        return activatedUser
          ? mapSafeAuthUser(activatedUser)
          : null;
      },
    );
  }

  /**
   * Atomically consumes a password-reset token, changes the password,
   * increments sessionVersion and removes database sessions.
   *
   * sessionVersion will invalidate Auth.js JWTs after the protected
   * request compares the claim with the current database value.
   */
  async resetPasswordUsingToken(input: {
    tokenHash: string;
    passwordHash: string;
    now?: Date;
  }): Promise<string | null> {
    const now = input.now ?? new Date();

    return prisma.$transaction(
      async (transaction) => {
        const token =
          await transaction.securityToken.findFirst({
            where: {
              tokenHash: input.tokenHash,
              purpose:
                TokenPurpose.PASSWORD_RESET,
              usedAt: null,
              expiresAt: {
                gt: now,
              },

              user: {
                status: UserStatus.ACTIVE,
                emailVerified: {
                  not: null,
                },
              },
            },

            select: {
              id: true,
              userId: true,
            },
          });

        if (!token) {
          return null;
        }

        const consumed =
          await transaction.securityToken.updateMany({
            where: {
              id: token.id,
              usedAt: null,
            },

            data: {
              usedAt: now,
            },
          });

        if (consumed.count !== 1) {
          return null;
        }

        await transaction.user.update({
          where: {
            id: token.userId,
          },

          data: {
            passwordHash:
              input.passwordHash,
            passwordChangedAt: now,
            failedLoginCount: 0,
            lockedUntil: null,
            sessionVersion: {
              increment: 1,
            },
          },
        });

        // Mark every other unused reset token as used.
        await transaction.securityToken.updateMany({
          where: {
            userId: token.userId,
            purpose:
              TokenPurpose.PASSWORD_RESET,
            usedAt: null,
          },

          data: {
            usedAt: now,
          },
        });

        // Relevant if database sessions are enabled in the future.
        await transaction.session.deleteMany({
          where: {
            userId: token.userId,
          },
        });

        return token.userId;
      },
    );
  }

  /**
   * Used by an authenticated user changing their own password.
   */
  async updatePassword(input: {
    userId: string;
    passwordHash: string;
    now?: Date;
  }): Promise<void> {
    const now = input.now ?? new Date();

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: input.userId,
        },

        data: {
          passwordHash:
            input.passwordHash,
          passwordChangedAt: now,
          failedLoginCount: 0,
          lockedUntil: null,
          sessionVersion: {
            increment: 1,
          },
        },
      }),

      prisma.session.deleteMany({
        where: {
          userId: input.userId,
        },
      }),

      prisma.securityToken.updateMany({
        where: {
          userId: input.userId,
          purpose:
            TokenPurpose.PASSWORD_RESET,
          usedAt: null,
        },

        data: {
          usedAt: now,
        },
      }),
    ]);
  }

  /**
   * Creates a pending employee account.
   *
   * Authentication service must normalize the email and validate roles
   * before calling this method.
   */
  async createPendingUser(input: {
    email: string;
    name: string;
    roleIds: string[];
  }): Promise<SafeAuthUser> {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        status:
          UserStatus.PENDING_VERIFICATION,

        roles: {
          create: input.roleIds.map(
            (roleId) => ({
              role: {
                connect: {
                  id: roleId,
                },
              },
            }),
          ),
        },
      },

      include: authenticationUserInclude,
    });

    return mapSafeAuthUser(user);
  }

  async findExistingRoleIds(
    roleIds: string[],
  ): Promise<string[]> {
    const roles = await prisma.role.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },

      select: {
        id: true,
      },
    });

    return roles.map((role) => role.id);
  }

  /**
   * Writes a safe security audit record.
   */
  async createAuditEvent(
    data: AuthenticationAuditData,
  ): Promise<void> {
    await prisma.auditEvent.create({
      data: {
        userId: data.userId,
        action: data.action,

        outcome:
          data.outcome === "SUCCESS"
            ? AuditOutcome.SUCCESS
            : AuditOutcome.FAILURE,

        ipHash:
          data.context?.ipHash,

        userAgent:
          data.context?.userAgent,

        metadata:
          data.metadata
            ? (data.metadata as Prisma.InputJsonValue)
            : undefined,
      },
    });
  }

  async deleteExpiredSecurityTokens(
    olderThan: Date,
  ): Promise<number> {
    const result =
      await prisma.securityToken.deleteMany({
        where: {
          OR: [
            {
              expiresAt: {
                lt: olderThan,
              },
            },
            {
              usedAt: {
                lt: olderThan,
              },
            },
          ],
        },
      });

    return result.count;
  }
}

/**
 * Default application repository.
 *
 * The service will accept this through dependency injection so tests
 * can supply a mock repository.
 */
export const authRepository =
  new AuthRepository();