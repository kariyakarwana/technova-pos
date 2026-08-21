import type {
  PasswordResetOtpDelivery,
  TokenDelivery,
} from "@/modules/auth/auth.types";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export interface AuthEmailDelivery {
  sendPasswordResetEmail(
    delivery:
      PasswordResetOtpDelivery,
  ): Promise<void>;

  sendVerificationEmail(
    delivery:
      TokenDelivery,
  ): Promise<void>;
}