import {
  describe,
  expect,
  it,
} from "vitest";

import {
  hashPassword,
  validatePasswordStrength,
  verifyPassword,
} from "./password";

describe("password security", () => {
  it("accepts a strong password", () => {
    const result = validatePasswordStrength(
      "TechNova!Secure2026",
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it.each([
    "short",
    "alllowercase123!",
    "ALLUPPERCASE123!",
    "NoNumbersHere!",
    "NoSymbolsHere123",
  ])("rejects weak password: %s", (password) => {
    expect(
      validatePasswordStrength(password).valid,
    ).toBe(false);
  });

  it(
  "hashes and verifies a password",
  async () => {
    const password =
      "TechNova!Secure2026";

    const digest =
      await hashPassword(password);

    expect(digest).not.toBe(password);

    expect(
      await verifyPassword(
        password,
        digest,
      ),
    ).toBe(true);

    expect(
      await verifyPassword(
        "Wrong!Password2026",
        digest,
      ),
    ).toBe(false);
  },
  15_000,
);
});