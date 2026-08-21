import {
  describe,
  expect,
  it,
} from "vitest";

import {
  emailSchema,
  loginSchema,
  resetPasswordSchema,
  tokenSchema,
} from "./auth.schema";

describe("authentication schemas", () => {
  it("normalizes email addresses", () => {
    expect(
      emailSchema.parse(
        " Admin@TechNova.COM ",
      ),
    ).toBe("admin@technova.com");
  });

  it("accepts valid login input", () => {
    const result = loginSchema.safeParse({
      email: "employee@technova.com",
      password: "submitted exactly",
    });

    expect(result.success).toBe(true);
  });

  it("does not trim login passwords", () => {
    const result = loginSchema.parse({
      email: "employee@technova.com",
      password: " password with spaces ",
    });

    expect(result.password).toBe(
      " password with spaces ",
    );
  });

  it("rejects malformed email addresses", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "anything",
    });

    expect(result.success).toBe(false);
  });

  it("rejects weak reset passwords", () => {
    const result =
      resetPasswordSchema.safeParse({
        token:
          "abcdefghijklmnopqrstuvwxyzABCDEFG1234567890_-",
        password: "weak",
        confirmPassword: "weak",
      });

    expect(result.success).toBe(false);
  });

  it("rejects different passwords", () => {
    const result =
      resetPasswordSchema.safeParse({
        token:
          "abcdefghijklmnopqrstuvwxyzABCDEFG1234567890_-",
        password:
          "TechNova!Secure2026",
        confirmPassword:
          "Different!Secure2026",
      });

    expect(result.success).toBe(false);
  });

  it("accepts a valid reset request", () => {
    const result =
      resetPasswordSchema.safeParse({
        token:
          "abcdefghijklmnopqrstuvwxyzABCDEFG1234567890_-",
        password:
          "TechNova!Secure2026",
        confirmPassword:
          "TechNova!Secure2026",
      });

    expect(result.success).toBe(true);
  });

  it("rejects tokens containing URL-unsafe characters", () => {
    expect(
      tokenSchema.safeParse(
        "invalid/token+containing=characters",
      ).success,
    ).toBe(false);
  });
});