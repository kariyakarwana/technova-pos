"use client";

import { Store } from "lucide-react";
import type { BranchAlertGroup, AlertItem } from "./InventoryAlertsMock";
import AlertItemCard from "./AlertItemCard";

interface BranchAlertColumnProps {
  branchGroup: BranchAlertGroup;
  onPrimaryAction?: (item: AlertItem) => void;
  onSecondaryAction?: (item: AlertItem) => void;
  onViewAllForBranch?: (branchId: string) => void;
}

export default function BranchAlertColumn({
  branchGroup,
  onPrimaryAction,
  onSecondaryAction,
  onViewAllForBranch,
}: BranchAlertColumnProps) {
  return (
    <div className="bg-[var(--brand-card-bg)] rounded-2xl border border-[var(--brand-stroke)] shadow-xs flex flex-col justify-between overflow-hidden">
      {/* Branch Header */}
      <div className="p-5 pb-4 flex items-center justify-between border-b border-[var(--brand-stroke)] bg-white">
        <div className="flex items-center gap-2.5">
          <Store className="h-5 w-5 text-slate-500" />
          <h2 className="text-base font-bold text-[var(--brand-black-font)]">
            {branchGroup.branchName}
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
          {branchGroup.totalItemsCount} Items
        </span>
      </div>

      {/* Cards List */}
      <div className="p-5 space-y-4 flex-1">
        {branchGroup.alerts.map((alert) => (
          <AlertItemCard
            key={alert.id}
            alert={alert}
            onPrimaryAction={onPrimaryAction}
            onSecondaryAction={onSecondaryAction}
          />
        ))}
      </div>

      {/* Footer Link */}
      <div className="p-4 border-t border-[var(--brand-stroke)] bg-white text-center">
        <button
          type="button"
          onClick={() => onViewAllForBranch?.(branchGroup.id)}
          className="text-xs font-semibold text-[var(--brand-green)] hover:underline cursor-pointer transition-colors"
        >
          View all {branchGroup.totalItemsCount} items for {branchGroup.branchName.replace(" Branch", "")}
        </button>
      </div>
    </div>
  );
}
