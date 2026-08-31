"use client";

import { useMemo, useState } from "react";
import {
  MOCK_ADJUSTMENT_ITEMS,
  type AdjustmentItem,
} from "./StockAdjustmentMock";
import StockAdjustmentHeader from "./StockAdjustmentHeader";
import StockAdjustmentStatsCards from "./StockAdjustmentStatsCards";
import StockAdjustmentFilterBar from "./StockAdjustmentFilterBar";
import StockAdjustmentTable from "./StockAdjustmentTable";
import StockAdjustmentPagination from "./StockAdjustmentPagination";

export default function StockAdjustmentClientView() {
  const [items] = useState<AdjustmentItem[]>(MOCK_ADJUSTMENT_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(4);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.productName.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.reason.toLowerCase().includes(q) ||
          item.adjustedBy.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, searchQuery]);

  function handleFilterClick() {
    alert("Adjustment filters opened");
  }

  function handleExportClick() {
    alert("Exporting adjustment audit records to CSV/Excel...");
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Page Header */}
      <StockAdjustmentHeader />

      {/* 2. Top Metric Cards (3 Cards) */}
      <StockAdjustmentStatsCards />

      {/* 3. Filter Bar & Table Card */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs space-y-4">
        {/* Filter Bar */}
        <StockAdjustmentFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={handleFilterClick}
          onExportClick={handleExportClick}
        />

        {/* Table UI */}
        <StockAdjustmentTable items={filteredItems} />

        {/* Pagination Footer */}
        <StockAdjustmentPagination
          currentPage={currentPage}
          totalPages={15}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>
    </main>
  );
}
