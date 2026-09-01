"use client";

import { ShieldCheck, Smartphone } from "lucide-react";

interface TwoFactorAuthSectionProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onManageAuthenticator?: () => void;
}

export default function TwoFactorAuthSection({
  isEnabled,
  onToggle,
  onManageAuthenticator,
}: TwoFactorAuthSectionProps) {
  return (
    <div className="bg-white border border-[var(--brand-stroke)] rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header & Toggle Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex items-center justify-center text-[var(--brand-green)] mt-0.5 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="space-y-1 max-w-xl">
            <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
              Two-Step Verification (2FA)
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Add an extra layer of security to your account. We&apos;ll ask for a
              code in addition to your password when you sign in on a new device.
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={isEnabled}
          onClick={() => onToggle(!isEnabled)}
          className={[
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
            isEnabled ? "bg-[var(--brand-green)]" : "bg-slate-300",
          ].join(" ")}
        >
          <span
            className={[
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
              isEnabled ? "translate-x-5" : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Authenticator App Card */}
      {isEnabled && (
        <div className="border border-[var(--brand-stroke)] rounded-xl p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-100/70 text-[var(--brand-green)] flex items-center justify-center shrink-0 shadow-2xs">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--brand-black-font)]">
                Authenticator App
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Google Authenticator configured
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onManageAuthenticator}
            className="h-8 px-4 rounded-lg border border-[var(--brand-stroke)] bg-white hover:border-[var(--brand-green)] text-slate-700 hover:text-[var(--brand-green)] text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            Manage
          </button>
        </div>
      )}
    </div>
  );
}
