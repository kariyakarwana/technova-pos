import type {
  Metadata,
} from "next";

export const metadata: Metadata = {
  title:
    "Forgot password | TechNova POS",
};

export default function ForgotPasswordPage() {
  return (
    <main>
      <h1>Forgot password</h1>
      <p>
        Password recovery will be available here.
      </p>
    </main>
  );
}