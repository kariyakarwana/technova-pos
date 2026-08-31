"use client";

import { useMemo, useState } from "react";
import {
  MOCK_PURCHASE_ORDERS,
  type PurchaseOrderItem,
} from "./PurchaseOrderMock";
import PurchaseOrderHeader from "./PurchaseOrderHeader";
import PurchaseOrderStatsCards from "./PurchaseOrderStatsCards";
import PurchaseOrderFilterBar from "./PurchaseOrderFilterBar";
import PurchaseOrderTable from "./PurchaseOrderTable";

export default function PurchaseOrderClientView() {
  const [items] = useState<PurchaseOrderItem[]>(MOCK_PURCHASE_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusChip, setSelectedStatusChip] = useState("All Statuses");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.poNumber.toLowerCase().includes(q) ||
          item.supplier.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q)
      );
    }

    if (selectedStatusChip !== "All Statuses") {
      if (selectedStatusChip === "Pending") {
        result = result.filter((item) =>
          item.status.toLowerCase().includes("pending")
        );
      } else if (selectedStatusChip === "In Transit") {
        result = result.filter(
          (item) => item.status.toLowerCase() === "in transit"
        );
      }
    }

    return result;
  }, [items, searchQuery, selectedStatusChip]);

  function handleToggleSelectAll() {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  }

  function handleToggleSelectOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function handleCreatePO() {
    alert("Create Purchase Order form wizard opened.");
  }

  function handleFilterClick() {
    alert("Advanced Purchase Order Filter modal opened.");
  }

  function handleExportPdf() {
    alert("Exporting Purchase Orders list as PDF...");
  }

  function handleExportExcel() {
    alert("Exporting Purchase Orders list as Excel (.xlsx)...");
  }

  function handleRefresh() {
    setSearchQuery("");
    setSelectedStatusChip("All Statuses");
    setSelectedIds([]);
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <PurchaseOrderHeader
        onFilterClick={handleFilterClick}
        onCreatePOClick={handleCreatePO}
      />

      {/* 2. Top Stats Cards (4 Cards) */}
      <PurchaseOrderStatsCards />

      {/* 3. Filter Bar & Table Card Container */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs space-y-4">
        <PurchaseOrderFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatusChip={selectedStatusChip}
          onStatusChipChange={setSelectedStatusChip}
          onExportPdf={handleExportPdf}
          onExportExcel={handleExportExcel}
          onRefresh={handleRefresh}
        />

        <PurchaseOrderTable
          items={filteredItems}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
        />
      </div>
    </main>
  );
}
