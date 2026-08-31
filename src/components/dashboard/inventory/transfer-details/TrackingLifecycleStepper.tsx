"use client";

import { Check, Package } from "lucide-react";
import type { TransferLifecycleStep } from "./TransferDetailsMock";

interface TrackingLifecycleStepperProps {
  steps: TransferLifecycleStep[];
}

export default function TrackingLifecycleStepper({
  steps,
}: TrackingLifecycleStepperProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs">
      <h2 className="text-base font-bold text-[var(--brand-black-font)] mb-8">
        Tracking Lifecycle
      </h2>

      {/* Stepper Timeline */}
      <div className="relative">
        {/* Connecting Background Line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 hidden sm:block -z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
          {steps.map((step) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";

            return (
              <div
                key={step.id}
                className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
              >
                {/* Node Icon */}
                <div
                  className={[
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                    isCompleted
                      ? "bg-[var(--brand-green)] text-white shadow-xs"
                      : isCurrent
                      ? "border-2 border-[var(--brand-green)] bg-white text-[var(--brand-green)] shadow-xs"
                      : "border border-slate-300 bg-white text-slate-400",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : isCurrent ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-green)]" />
                  ) : (
                    <Package className="h-3.5 w-3.5" />
                  )}
                </div>

                {/* Text Info */}
                <div className="sm:mt-1">
                  <p
                    className={[
                      "text-xs font-bold",
                      isCurrent
                        ? "text-[var(--brand-green)]"
                        : "text-[var(--brand-black-font)]",
                    ].join(" ")}
                  >
                    {step.label}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {step.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
