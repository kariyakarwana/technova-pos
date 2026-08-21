"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Timer } from "lucide-react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AuthButton } from "@/components/auth/auth-button";
import { verifyEmailAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/form-state";

const OTP_LENGTH = 4;
const COUNTDOWN_SECONDS = 10 * 60 - 1;

type TwoStepVerificationFormProps = {
  emailHint?: string;
};

/** Two-step verification form with OTP input, live countdown, and resend support. */
export function TwoStepVerificationForm({
  emailHint = "******doe@example.com",
}: TwoStepVerificationFormProps) {
  const [state, formAction, isPending] = useActionState(
    verifyEmailAction,
    initialAuthActionState,
  );

  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startCountdown() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current ?? undefined);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    startCountdown();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function handleResend() {
    setOtp("");
    setSecondsLeft(COUNTDOWN_SECONDS);
    setExpired(false);
    startCountdown();
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-5 text-sm text-emerald-800"
      >
        {state.message}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        2 Step Verification
      </h1>
      <p className="mt-2 mb-6 text-sm text-slate-500">
        Please enter the OTP received to confirm your account ownership. A code
        has been send to {emailHint}
      </p>

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="space-y-5" noValidate>
        <input type="hidden" name="token" value={otp} readOnly />

        <InputOTP
          maxLength={OTP_LENGTH}
          value={otp}
          onChange={setOtp}
          disabled={isPending || expired}
          inputMode="numeric"
          pattern="\d*"
          containerClassName="gap-3"
        >
          <InputOTPGroup className="gap-3">
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="size-12 rounded-lg border border-slate-200 text-lg font-semibold text-slate-900 data-[active=true]:border-[#0e9f90] data-[active=true]:ring-[#0e9f90]/30"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <div className="flex flex-col items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
              expired
                ? "border-slate-200 bg-slate-50 text-slate-400"
                : "border-red-100 bg-red-50 text-red-500"
            }`}
          >
            <Timer size={12} aria-hidden="true" />
            {expired ? "Expired" : `${minutes}:${seconds} s`}
          </span>

          <p className="text-sm text-slate-500">
            Didn&apos;t get the OTP?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-slate-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e9f90] rounded"
            >
              Resend OTP
            </button>
          </p>
        </div>

        <AuthButton
          isLoading={isPending}
          loadingText="Verifying..."
          disabled={otp.length < OTP_LENGTH || expired}
        >
          Submit
        </AuthButton>
      </form>
    </div>
  );
}
