"use client";

import { RotateCw, WifiOff } from "lucide-react";

interface PosOfflineBannerProps {
  onRetry?: () => void | Promise<boolean>;
  isChecking?: boolean;
}

/**
 * PosOfflineBanner — full-width strip placed above the top Navbar.
 * Rendered via OfflineBannerController which reads OfflineContext.
 */
export default function PosOfflineBanner({
  onRetry,
  isChecking = false,
}: PosOfflineBannerProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-center justify-between px-6 py-2.5 shrink-0 z-50 transition-all border-b border-[#F7C2BE]"
      style={{
        backgroundColor: "#FDEDEC",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="relative flex items-center justify-center shrink-0">
          <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full opacity-40 bg-[#D32F2F]" />
          <WifiOff className="relative h-4 w-4 text-[#D32F2F]" aria-hidden="true" />
        </span>

        <span className="text-xs font-bold uppercase tracking-wider text-[#D32F2F]">
          OFFLINE MODE ACTIVE
        </span>

        <span className="h-1.5 w-1.5 rounded-full bg-[#BA1A1A] shrink-0" aria-hidden="true" />

        <span className="text-xs font-medium text-[#7A271A]">
          Queueing: 12 transactions stored locally
        </span>
      </div>

      <button
        type="button"
        disabled={isChecking}
        onClick={onRetry}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#7B0F16] hover:bg-[#600C12] active:scale-[0.98] disabled:opacity-70 transition-all shadow-sm cursor-pointer"
      >
        <RotateCw
          className={[
            "h-3.5 w-3.5",
            isChecking ? "animate-spin" : "",
          ].join(" ")}
          aria-hidden="true"
        />
        {isChecking ? "Checking..." : "Retry Connection"}
      </button>
    </div>
  );
}
