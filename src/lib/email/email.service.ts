import nodemailer, {
  type Transporter,
} from "nodemailer";

import type {
  AuthEmailDelivery,
  EmailMessage,
} from "./email.types";

import type {
  PasswordResetOtpDelivery,
  TokenDelivery,
} from "@/modules/auth/auth.types";

const DEFAULT_SMTP_PORT = 587;

function getApplicationUrl(): string {
  const configured =
    process.env.APP_URL?.trim();

  if (!configured) {
    if (
      process.env.NODE_ENV ===
      "production"
    ) {
      throw new Error(
        "APP_URL is required in production.",
      );
    }

    return "http://localhost:3000";
  }

  const url = new URL(configured);

  if (
    process.env.NODE_ENV ===
      "production" &&
    url.protocol !== "https:"
  ) {
    throw new Error(
      "APP_URL must use HTTPS in production.",
    );
  }

  return url.origin;
}

function createAuthenticationUrl(
  pathname: string,
  rawToken: string,
): string {
  const url = new URL(
    pathname,
    getApplicationUrl(),
  );

  url.searchParams.set(
    "token",
    rawToken,
  );

  return url.toString();
}

function buildPasswordResetMessage(
  delivery: PasswordResetOtpDelivery,
): EmailMessage {
  const expiryText =
    delivery.expiresAt.toISOString();

  return {
    to: delivery.email,

    subject:
      "Your TechNova POS password reset code",

    text: [
      "A password reset was requested for your TechNova POS account.",
      "",
      `Your verification code is: ${delivery.otp}`,
      "",
      `This code expires at ${expiryText}.`,
      "",
      "If you did not request this reset, ignore this email.",
    ].join("\n"),

    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
        <h1 style="font-size:24px">
          Reset your password
        </h1>

        <p>
          Enter this verification code in TechNova POS:
        </p>

        <div style="
          margin:24px 0;
          padding:16px;
          border-radius:10px;
          background:#f0fdfa;
          color:#0f766e;
          font-size:32px;
          font-weight:700;
          letter-spacing:10px;
          text-align:center;
        ">
          ${delivery.otp}
        </div>

        <p>
          This code expires at ${expiryText}.
        </p>

        <p>
          If you did not request this reset,
          ignore this email.
        </p>
      </div>
    `,
  };
}

function buildVerificationMessage(
  delivery: TokenDelivery,
): EmailMessage {
  const verificationUrl =
    createAuthenticationUrl(
      "/verify-email",
      delivery.rawToken,
    );

  const expiryText =
    delivery.expiresAt.toISOString();

  return {
    to: delivery.email,

    subject:
      "Verify your TechNova POS email",

    text: [
      "Your TechNova POS account is ready for email verification.",
      "",
      "Open this link to verify your email:",
      verificationUrl,
      "",
      `This link expires at ${expiryText}.`,
      "",
      "If you were not expecting this email, contact your administrator.",
    ].join("\n"),

    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
        <h1 style="font-size:24px">
          Verify your email
        </h1>

        <p>
          Your TechNova POS account is ready
          for email verification.
        </p>

        <p>
          <a
            href="${verificationUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              border-radius:8px;
              background:#176bff;
              color:#ffffff;
              text-decoration:none;
              font-weight:700;
            "
          >
            Verify email
          </a>
        </p>

        <p>
          This link expires at ${expiryText}.
        </p>

        <p>
          If you were not expecting this email,
          contact your administrator.
        </p>
      </div>
    `,
  };
}

export class NodemailerAuthEmailDelivery
  implements AuthEmailDelivery
{
  private transporter:
    Transporter | null = null;

  private getTransporter():
    Transporter | null {
    const smtpHost =
      process.env.SMTP_HOST?.trim();

    if (!smtpHost) {
      if (
        process.env.NODE_ENV ===
        "production"
      ) {
        throw new Error(
          "SMTP_HOST is required in production.",
        );
      }

      return null;
    }

    if (this.transporter) {
      return this.transporter;
    }

    const port = Number(
      process.env.SMTP_PORT ??
        DEFAULT_SMTP_PORT,
    );

    if (
      !Number.isInteger(port) ||
      port <= 0 ||
      port > 65535
    ) {
      throw new Error(
        "SMTP_PORT is invalid.",
      );
    }

    const smtpUser =
      process.env.SMTP_USER?.trim();

    const smtpPassword =
      process.env.SMTP_PASSWORD;

    this.transporter =
      nodemailer.createTransport({
        host: smtpHost,
        port,
        secure: port === 465,

        auth: smtpUser
          ? {
              user: smtpUser,
              pass: smtpPassword,
            }
          : undefined,
      });

    return this.transporter;
  }

  private async send(
    message: EmailMessage,
  ): Promise<void> {
    const transporter =
      this.getTransporter();

    if (!transporter) {
      /*
       * Development-only fallback.
       *
       * Raw token URLs are written to the server terminal,
       * never returned to the browser.
       */
      console.info(
        [
          "[Development email]",
          `To: ${message.to}`,
          `Subject: ${message.subject}`,
          "",
          message.text,
        ].join("\n"),
      );

      return;
    }

    const from =
      process.env.SMTP_FROM?.trim();

    if (!from) {
      throw new Error(
        "SMTP_FROM is required when SMTP is configured.",
      );
    }

    await transporter.sendMail({
      from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
  }

    async sendPasswordResetEmail(
    delivery:
      PasswordResetOtpDelivery,
  ): Promise<void> {
    await this.send(
      buildPasswordResetMessage(
        delivery,
      ),
    );
  }

  async sendVerificationEmail(
    delivery: TokenDelivery,
  ): Promise<void> {
    await this.send(
      buildVerificationMessage(
        delivery,
      ),
    );
  }
}

export const authEmailDelivery =
  new NodemailerAuthEmailDelivery();