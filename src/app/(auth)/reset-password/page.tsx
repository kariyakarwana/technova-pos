import type {
  Metadata,
} from "next";

export const metadata: Metadata = {
  title:
    "Reset password | TechNova POS",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const {
    token,
  } = await searchParams;

  return (
    <main>
      <h1>Reset password</h1>

      {token ? (
        <p>
          Reset token received. The password form will be added next.
        </p>
      ) : (
        <p>
          This password-reset link is invalid.
        </p>
      )}
    </main>
  );
}