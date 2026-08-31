"use client";

import { useMemo, useState } from "react";
import {
  MOCK_CUSTOMER_PURCHASES,
  type CustomerPurchaseItem,
} from "./CustomerPurchasesMock";
import CustomerPurchasesHeader from "./CustomerPurchasesHeader";
import CustomerPurchasesFilterBar from "./CustomerPurchasesFilterBar";
import CustomerPurchasesTable from "./CustomerPurchasesTable";
import CustomerPurchasesPagination from "./CustomerPurchasesPagination";

export default function CustomerPurchasesClientView() {
  const [items] = useState<CustomerPurchaseItem[]>(MOCK_CUSTOMER_PURCHASES);
  const [dateRange, setDateRange] = useState("01-Aug-2026 - 12-Dec-2026");
  const [selectedCashier, setSelectedCashier] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(4);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const cashiers = useMemo(
    () => [
      "All",
      ...Array.from(new Set(MOCK_CUSTOMER_PURCHASES.map((p) => p.cashier))),
    ],
    []
  );

  const branches = useMemo(
    () => [
      "All",
      ...Array.from(new Set(MOCK_CUSTOMER_PURCHASES.map((p) => p.branch))),
    ],
    []
  );

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (selectedCashier !== "All") {
      result = result.filter((item) => item.cashier === selectedCashier);
    }

    if (selectedBranch !== "All") {
      result = result.filter((item) => item.branch === selectedBranch);
    }

    return result;
  }, [items, selectedCashier, selectedBranch]);

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

  function handleResetFilters() {
    setSelectedCashier("All");
    setSelectedBranch("All");
    setDateRange("01-Aug-2026 - 12-Dec-2026");
  }

  function handleApplyFilters() {
    alert(
      `Filters Applied:\nDate: ${dateRange}\nCashier: ${selectedCashier}\nBranch: ${selectedBranch}`
    );
  }

  function handleExportPdf() {
    alert("Exporting customer purchases report as PDF...");
  }

  function handleExportExcel() {
    alert("Exporting customer purchases report as Excel (.xlsx)...");
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-5">
      {/* 1. Header */}
      <CustomerPurchasesHeader />

      {/* 2. Main Card Container containing Filter Bar, Table, and Pagination */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs space-y-4">
        <CustomerPurchasesFilterBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedCashier={selectedCashier}
          onCashierChange={setSelectedCashier}
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
          cashiers={cashiers}
          branches={branches}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onExportPdf={handleExportPdf}
          onExportExcel={handleExportExcel}
        />

        <CustomerPurchasesTable
          items={filteredItems}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
        />

        <CustomerPurchasesPagination
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
