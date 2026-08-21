import {
  describe,
  expect,
  it,
} from "vitest";

import {
  compareTokenHashes,
  createEmailVerificationToken,
  createPasswordResetToken,
  hashToken,
  isTokenExpired,
} from "./token";

describe("authentication tokens", () => {
  it("stores a hash instead of the raw token", () => {
    const generated =
      createEmailVerificationToken();

    expect(generated.rawToken).not.toBe(
      generated.tokenHash,
    );

    expect(
      hashToken(generated.rawToken),
    ).toBe(generated.tokenHash);
  });

  it("creates different tokens", () => {
    const first = createPasswordResetToken();
    const second = createPasswordResetToken();

    expect(first.rawToken).not.toBe(
      second.rawToken,
    );
  });

  it("detects expired tokens", () => {
    expect(
      isTokenExpired(new Date(Date.now() - 1)),
    ).toBe(true);

    expect(
      isTokenExpired(new Date(Date.now() + 60_000)),
    ).toBe(false);
  });

  it("compares hashes safely", () => {
    const hash = hashToken("test-token");

    expect(compareTokenHashes(hash, hash)).toBe(true);

    expect(
      compareTokenHashes(
        hash,
        hashToken("different-token"),
      ),
    ).toBe(false);
  });
});