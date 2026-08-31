"use client";

import { CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";

interface WorkflowApprovalsCardProps {
  requestApproval: boolean;
  onRequestApprovalToggle: () => void;
  onSubmitAdjustment: () => void;
}

export default function WorkflowApprovalsCard({
  requestApproval,
  onRequestApprovalToggle,
  onSubmitAdjustment,
}: WorkflowApprovalsCardProps) {
  return (
    <div className="bg-[var(--brand-card-bg)] rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-5">
      {/* Title */}
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-[var(--brand-green)]" />
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Workflow & Approvals
        </h2>
      </div>

      {/* Toggle Row */}
      <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-50 border border-[var(--brand-stroke)]">
        <div>
          <p className="text-xs font-bold text-[var(--brand-black-font)]">
            Request Approval
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Route to manager for review
          </p>
        </div>

        {/* Interactive Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={requestApproval}
          onClick={onRequestApprovalToggle}
          className={[
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
            requestApproval ? "bg-[var(--brand-green)]" : "bg-slate-300",
          ].join(" ")}
        >
          <span
            className={[
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
              requestApproval ? "translate-x-5" : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Approver Info Card */}
      {requestApproval && (
        <div className="bg-[#E6F7F5] border border-[#CBEFE8] rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[var(--brand-green)] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
              SM
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--brand-black-font)] leading-tight">
                Sarah Manager
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Branch Inventory Lead (Downtown)
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--brand-green)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Assigned</span>
          </span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={onSubmitAdjustment}
        className="w-full h-11 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
      >
        <UserCheck className="h-4 w-4" />
        <span>Submit Adjustment →</span>
      </button>
    </div>
  );
}
