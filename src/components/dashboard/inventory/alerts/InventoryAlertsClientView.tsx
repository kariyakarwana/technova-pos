"use client";

import { useState } from "react";
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
    alert("Branch filter opened");
  }

  function handleBulkReorder() {
    alert("Bulk reorder process initiated for all critical alerts!");
  }

  function handlePrimaryAction(item: AlertItem) {
    alert(`Review order initiated for ${item.name} (${item.sku})`);
  }

  function handleSecondaryAction(item: AlertItem) {
    alert(`Stock transfer initiated for ${item.name}`);
  }

  function handleViewAllForBranch(branchId: string) {
    alert(`Viewing full alert inventory for branch: ${branchId}`);
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
