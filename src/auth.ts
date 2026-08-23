import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import {
  PrismaAdapter,
} from "@auth/prisma-adapter";

import {
  prisma,
} from "@/lib/db/prisma";

import {
  getSecurityRequestContext,
  getSecurityRequestContextFromHeaders,
} from "@/lib/security/request";

import {
  loginSchema,
} from "@/modules/auth/auth.schema";

import {
  authService,
} from "@/modules/auth/auth.service";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),

  trustHost: true,

  session: {
    /*
     * Credentials provider requires JWT sessions.
     */
    strategy: "jwt",

    // Eight-hour employee session.
    maxAge: 8 * 60 * 60,

    // Refresh JWT claims at most once per hour where applicable.
    updateAge: 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/auth-error",
  },

  providers: [
    Credentials({
      name: "TechNova credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(
        credentials,
        request,
      ) {
        const parsed =
          loginSchema.safeParse(
            credentials,
          );

        if (!parsed.success) {
          return null;
        }

        try {
          const context =
            getSecurityRequestContextFromHeaders(
              request.headers,
            );

          const user =
            await authService
              .authenticateCredentials({
                email:
                  parsed.data.email,

                password:
                  parsed.data.password,

                context,
              });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            roles: user.roles,
            permissions:
              user.permissions,
            sessionVersion:
              user.sessionVersion,
          };
        } catch {
          /*
           * Always return Auth.js's generic CredentialsSignin result.
           * Detailed reasons are already captured by audit events.
           */
          return null;
        }
      },
    }),

    Google({
      /*
       * This setting is acceptable only because the signIn callback:
       *
       * 1. Requires Google's verified-email claim.
       * 2. Requires a pre-provisioned TechNova user.
       * 3. Requires that TechNova user to be active and verified.
       *
       * Without those checks, automatic email linking would be unsafe.
       */
      allowDangerousEmailAccountLinking:
        true,
    }),
  ],

  callbacks: {
    /**
     * Runs before Auth.js creates or links a Google account.
     *
     * Unknown Google users are rejected before adapter persistence.
     */
    async signIn({
      account,
      profile,
    }) {
      if (
        account?.provider !==
        "google"
      ) {
        return true;
      }

      const email =
        typeof profile?.email ===
        "string"
          ? profile.email
          : null;

      const emailVerified =
        profile?.email_verified ===
        true;

      if (!email) {
        return false;
      }

      try {
        const context =
          await getSecurityRequestContext();

        await authService
          .authorizeGoogleLogin({
            profile: {
              email,
              emailVerified,
            },

            context,
          });

        return true;
      } catch {
        return false;
      }
    },

    /**
     * Adds authorization claims to the signed JWT.
     *
     * It also revalidates status/sessionVersion on subsequent calls.
     */
    async jwt({
      token,
      user,
    }) {
      /*
       * Initial sign-in for both Credentials and Google.
       */
      if (user?.id) {
        const currentUser =
          await authService
            .getSessionUserById(
              user.id,
            );

        if (!currentUser) {
          return {
            ...token,
            sub: user.id,
            roles: [],
            permissions: [],
            sessionVersion: 0,
            invalid: true,
          };
        }

        return {
          ...token,
          sub: currentUser.id,
          name: currentUser.name,
          email:
            currentUser.email,
          picture:
            currentUser.image,
          roles:
            currentUser.roles,
          permissions:
            currentUser.permissions,
          sessionVersion:
            currentUser.sessionVersion,
          invalid: false,
        };
      }

      /*
       * Subsequent session requests.
       *
       * Checking PostgreSQL here makes deactivation and password-reset
       * invalidation effective without waiting eight hours.
       */
      if (
        token.sub &&
        typeof token.sessionVersion ===
          "number"
      ) {
        const currentUser =
          await authService
            .validateSessionUser({
              userId: token.sub,

              expectedSessionVersion:
                token.sessionVersion,
            });

        if (!currentUser) {
          return {
            ...token,
            roles: [],
            permissions: [],
            invalid: true,
          };
        }

        return {
          ...token,
          name: currentUser.name,
          email:
            currentUser.email,
          picture:
            currentUser.image,
          roles:
            currentUser.roles,
          permissions:
            currentUser.permissions,
          sessionVersion:
            currentUser.sessionVersion,
          invalid: false,
        };
      }

      return {
        ...token,
        roles: [],
        permissions: [],
        sessionVersion: 0,
        invalid: true,
      };
    },

    session({
      session,
      token,
    }) {
      if (
        session.user &&
        token.sub
      ) {
        session.user.id =
          token.sub;

        session.user.roles =
          token.roles ?? [];

        session.user.permissions =
          token.permissions ?? [];

        session.user.sessionVersion =
          token.sessionVersion ?? 0;
      }

      session.invalid =
        token.invalid === true;

      return session;
    },

    /**
     * Prevent external redirects from leaving the TechNova origin.
     */
    redirect({
      url,
      baseUrl,
    }) {
      if (
        url.startsWith("/")
      ) {
        return `${baseUrl}${url}`;
      }

      try {
        if (
          new URL(url).origin ===
          baseUrl
        ) {
          return url;
        }
      } catch {
        // Invalid URLs return to the application root.
      }

      return baseUrl;
    },
  },
});