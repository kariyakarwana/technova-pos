import {
  describe,
  expect,
  it,
} from "vitest";

import {
  extractClientIp,
  extractUserAgent,
  hashClientIp,
  USER_AGENT_MAX_LENGTH,
} from "./request";

describe("request security", () => {
  it("extracts the first forwarded IP address", () => {
    const headers = new Headers({
      "x-forwarded-for":
        "203.0.113.10, 10.0.0.2",
    });

    expect(extractClientIp(headers)).toBe(
      "203.0.113.10",
    );
  });

  it("uses x-real-ip when forwarded-for is absent", () => {
    const headers = new Headers({
      "x-real-ip": "203.0.113.20",
    });

    expect(extractClientIp(headers)).toBe(
      "203.0.113.20",
    );
  });

  it("limits user-agent length", () => {
    const headers = new Headers({
      "user-agent": "A".repeat(700),
    });

    expect(
      extractUserAgent(headers)?.length,
    ).toBe(USER_AGENT_MAX_LENGTH);
  });

  it("creates a deterministic keyed IP hash", () => {
    const first = hashClientIp(
      "203.0.113.10",
      "test-secret",
    );

    const second = hashClientIp(
      "203.0.113.10",
      "test-secret",
    );

    expect(first).toBe(second);
    expect(first).not.toContain(
      "203.0.113.10",
    );
  });
});