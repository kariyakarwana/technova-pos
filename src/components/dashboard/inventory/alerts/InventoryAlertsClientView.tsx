"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  MOCK_BRANCH_ALERTS,
  type BranchAlertGroup,
  type AlertItem,
} from "./InventoryAlertsMock";
import InventoryAlertsHeader from "./InventoryAlertsHeader";
import BranchAlertColumn from "./BranchAlertColumn";

export default function InventoryAlertsClientView() {
  const [branchGroups] = useState<BranchAlertGroup[]>(MOCK_BRANCH_ALERTS);

  function handleFilterBranch() {
    toast.info("Branch filter opened", { duration: 5000 });
  }

  function handleBulkReorder() {
    toast.info("Bulk reorder process initiated for all critical alerts!", { duration: 5000 });
  }

  function handlePrimaryAction(item: AlertItem) {
    toast.info(`Review order initiated for ${item.name} (${item.sku})`, { duration: 5000 });
  }

  function handleSecondaryAction(item: AlertItem) {
    toast.info(`Stock transfer initiated for ${item.name}`, { duration: 5000 });
  }

  function handleViewAllForBranch(branchId: string) {
    toast.info(`Viewing full alert inventory for branch: ${branchId}`, { duration: 5000 });
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* Page Header */}
      <InventoryAlertsHeader
        onFilterBranch={handleFilterBranch}
        onBulkReorder={handleBulkReorder}
      />

      {/* Branch Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {branchGroups.map((group) => (
          <BranchAlertColumn
            key={group.id}
            branchGroup={group}
            onPrimaryAction={handlePrimaryAction}
            onSecondaryAction={handleSecondaryAction}
            onViewAllForBranch={handleViewAllForBranch}
          />
        ))}
      </div>
    </main>
  );
}
