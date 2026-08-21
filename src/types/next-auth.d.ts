import type {
  DefaultSession,
} from "next-auth";

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    roles?: string[];
    permissions?: string[];
    sessionVersion?: number;
  }

  interface Session {
    user: {
      id: string;
      roles: string[];
      permissions: string[];
      sessionVersion: number;
    } & DefaultSession["user"];

    invalid?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles: string[];
    permissions: string[];
    sessionVersion: number;
    invalid?: boolean;
  }
}