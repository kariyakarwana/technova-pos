import {
  createHmac,
  createHash,
} from "node:crypto";
import { headers } from "next/headers";

export const USER_AGENT_MAX_LENGTH = 500;

export type SecurityRequestContext = {
  ipHash: string;
  userAgent: string | null;
};

/**
 * Extracts the original client IP from trusted proxy headers.
 *
 * x-forwarded-for can contain:
 * client, proxy-1, proxy-2
 *
 * The first entry is normally the original client.
 *
 * Important: only trust these headers when your production proxy
 * overwrites them instead of forwarding user-supplied values.
 */
export function extractClientIp(
  requestHeaders: Headers,
): string {
  const forwardedFor =
    requestHeaders.get("x-forwarded-for");

  if (forwardedFor) {
    const firstAddress = forwardedFor
      .split(",")[0]
      ?.trim();

    if (firstAddress) {
      return firstAddress;
    }
  }

  const realIp = requestHeaders
    .get("x-real-ip")
    ?.trim();

  if (realIp) {
    return realIp;
  }

  return "unknown";
}

/**
 * Creates a non-reversible identifier for an IP address.
 *
 * HMAC-SHA-256 is preferable to plain SHA-256 here because IPv4
 * addresses have a small enough search space to be guessed.
 */
export function hashClientIp(
  ipAddress: string,
  secret = process.env.AUTH_SECRET,
): string {
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is required to hash client IP addresses.",
    );
  }

  return createHmac("sha256", secret)
    .update(ipAddress, "utf8")
    .digest("hex");
}

/**
 * Plain SHA-256 alternative when an unkeyed digest is specifically
 * required. Prefer hashClientIp for authentication audit records.
 */
export function sha256(value: string): string {
  return createHash("sha256")
    .update(value, "utf8")
    .digest("hex");
}

export function extractUserAgent(
  requestHeaders: Headers,
): string | null {
  const userAgent = requestHeaders.get("user-agent");

  if (!userAgent) {
    return null;
  }

  // Remove control characters before writing to logs/database.
  const sanitized = userAgent.replace(
    /[\u0000-\u001F\u007F]/g,
    "",
  );

  return sanitized.slice(0, USER_AGENT_MAX_LENGTH);
}

/**
 * Reads request information in a Next.js Server Action,
 * Route Handler or Server Component.
 */
export async function getSecurityRequestContext(): Promise<SecurityRequestContext> {
  const requestHeaders = await headers();
  const ipAddress = extractClientIp(requestHeaders);

  return {
    ipHash: hashClientIp(ipAddress),
    userAgent: extractUserAgent(requestHeaders),
  };
}