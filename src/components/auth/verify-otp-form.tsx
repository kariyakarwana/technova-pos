"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Timer,
} from "lucide-react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  AuthButton,
} from "@/components/auth/auth-button";

import {
  verifyPasswordResetOtpAction,
} from "@/lib/auth/actions";

import type {
  AuthActionState,
} from "@/lib/auth/form-state";

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS =
  10 * 60;

type ResetOtpActionData = {
  resetToken: string;
};

const initialState: AuthActionState<
  ResetOtpActionData
> = {
  status: "idle",
};

type VerifyOtpFormProps = {
  challengeToken: string;
  emailHint?: string;
};

export function VerifyOtpForm({
  challengeToken,
  emailHint = "your email address",
}: VerifyOtpFormProps) {
  const router = useRouter();

  const [
    state,
    formAction,
    isPending,
  ] = useActionState(
    verifyPasswordResetOtpAction,
    initialState,
  );

  const [
    otp,
    setOtp,
  ] = useState("");

  const [
    secondsLeft,
    setSecondsLeft,
  ] = useState(
    COUNTDOWN_SECONDS,
  );

  const intervalRef =
    useRef<
      ReturnType<
        typeof setInterval
      > | null
    >(null);

  const expired =
    secondsLeft <= 0;

  /*
   * This timer is only a UI indicator.
   * The server remains responsible for
   * enforcing the real expiry time.
   */
  useEffect(() => {
    intervalRef.current =
      setInterval(() => {
        setSecondsLeft(
          (previous) => {
            if (
              previous <= 1
            ) {
              if (
                intervalRef.current
              ) {
                clearInterval(
                  intervalRef.current,
                );

                intervalRef.current =
                  null;
              }

              return 0;
            }

            return (
              previous - 1
            );
          },
        );
      }, 1000);

    return () => {
      if (
        intervalRef.current
      ) {
        clearInterval(
          intervalRef.current,
        );

        intervalRef.current =
          null;
      }
    };
  }, []);

  /*
   * A successful OTP verification
   * returns a short-lived, one-time
   * password-reset token.
   */
  useEffect(() => {
    if (
      state.status !==
      "success"
    ) {
      return;
    }

    const resetToken =
      state.data?.resetToken;

    if (!resetToken) {
      return;
    }

    router.replace(
      `/reset-password?token=${encodeURIComponent(
        resetToken,
      )}`,
    );
  }, [
    router,
    state.status,
    state.data?.resetToken,
  ]);

  const handleOtpChange = (
    value: string,
  ) => {
    const numericValue =
      value
        .replace(/\D/g, "")
        .slice(0, OTP_LENGTH);

    setOtp(numericValue);
  };

  const minutes = String(
    Math.floor(
      secondsLeft / 60,
    ),
  ).padStart(2, "0");

  const seconds = String(
    secondsLeft % 60,
  ).padStart(2, "0");

  const formDisabled =
    isPending ||
    expired ||
    state.status ===
      "success";

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Email OTP
        Verification
      </h1>

      <p className="mb-6 mt-2 text-sm text-slate-500">
        Enter the six-digit
        code sent to{" "}
        {emailHint}.
      </p>

      {state.status ===
        "error" &&
      state.message ? (
        <div
          role="alert"
          aria-live="polite"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      ) : null}

      {state.status ===
      "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          Code verified.
          Redirecting…
        </div>
      ) : null}

      <form
        action={formAction}
        className="space-y-5"
        noValidate
      >
        <input
          type="hidden"
          name="challengeToken"
          value={
            challengeToken
          }
          readOnly
        />

        <input
          type="hidden"
          name="otp"
          value={otp}
          readOnly
        />

        <div className="flex justify-center">
          <InputOTP
            maxLength={
              OTP_LENGTH
            }
            value={otp}
            onChange={
              handleOtpChange
            }
            disabled={
              formDisabled
            }
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            aria-label="Six-digit password reset code"
          >
            <InputOTPGroup className="gap-2 sm:gap-3">
              {Array.from({
                length:
                  OTP_LENGTH,
              }).map(
                (
                  _unused,
                  index,
                ) => (
                  <InputOTPSlot
                    key={
                      index
                    }
                    index={
                      index
                    }
                    className="size-11 rounded-lg border border-slate-200 text-lg font-semibold text-slate-900 data-[active=true]:border-[#0e9f90] data-[active=true]:ring-[#0e9f90]/30 sm:size-12"
                  />
                ),
              )}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {state.fieldErrors?.otp?.map(
          (message) => (
            <p
              key={message}
              role="alert"
              className="text-center text-xs text-red-600"
            >
              {message}
            </p>
          ),
        )}

        <div className="flex flex-col items-center gap-3">
          <span
            aria-live="polite"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
              expired
                ? "border-slate-200 bg-slate-50 text-slate-400"
                : "border-red-100 bg-red-50 text-red-500"
            }`}
          >
            <Timer
              size={12}
              aria-hidden="true"
            />

            {expired
              ? "Expired"
              : `${minutes}:${seconds}`}
          </span>

          {expired ? (
            <p className="text-center text-sm text-slate-500">
              This code has
              expired. Return to
              the forgot-password
              page to request a
              new code.
            </p>
          ) : (
            <p className="text-center text-sm text-slate-500">
              Didn&apos;t receive
              the OTP? Request a
              new code from the
              forgot-password
              page.
            </p>
          )}
        </div>

        <AuthButton
          isLoading={
            isPending
          }
          loadingText="Verifying..."
          disabled={
            formDisabled ||
            otp.length !==
              OTP_LENGTH
          }
        >
          Verify &amp;
          Proceed
        </AuthButton>
      </form>
    </div>
  );
}
