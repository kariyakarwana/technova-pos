import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AuthDomainError,
  getPublicAuthErrorMessage,
  InvalidCredentialsError,
  isAuthDomainError,
} from "./auth.errors";

describe("authentication errors", () => {
  it("recognizes controlled authentication errors", () => {
    const error =
      new InvalidCredentialsError();

    expect(
      isAuthDomainError(error),
    ).toBe(true);

    expect(error.code).toBe(
      "INVALID_CREDENTIALS",
    );

    expect(error.statusCode).toBe(401);
  });

  it("does not expose unknown errors", () => {
    const error = new Error(
      "database-password-and-internal-details",
    );

    expect(
      getPublicAuthErrorMessage(error),
    ).toBe(
      "Authentication could not be completed. Please try again.",
    );
  });

  it("returns safe messages for domain errors", () => {
    const error = new AuthDomainError(
      "TOKEN_EXPIRED",
      {
        publicMessage:
          "This link is invalid or has expired.",
        statusCode: 400,
      },
    );

    expect(
      getPublicAuthErrorMessage(error),
    ).toBe(
      "This link is invalid or has expired.",
    );
  });
});