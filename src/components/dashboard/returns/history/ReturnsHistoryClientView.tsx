"use client";

import { useMemo, useState } from "react";
import {
  MOCK_RETURNS_HISTORY,
  type ReturnHistoryItem,
} from "./ReturnsHistoryMock";
import ReturnsHistoryHeader from "./ReturnsHistoryHeader";
import ReturnsHistoryFilterBar from "./ReturnsHistoryFilterBar";
import ReturnsHistoryTable from "./ReturnsHistoryTable";
import ReturnsHistoryPagination from "./ReturnsHistoryPagination";

export default function ReturnsHistoryClientView() {
  const [items] = useState<ReturnHistoryItem[]>(MOCK_RETURNS_HISTORY);
  const [dateRange, setDateRange] = useState("01-Aug-2026 - 12-Dec-2026");
  const [status, setStatus] = useState("All Statuses");
  const [branch, setBranch] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(4);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (status !== "All Statuses" && item.condition !== status) {
        return false;
      }
      return true;
    });
  }, [items, status]);

  function handleExportPdf() {
    alert("Exporting returns audit history to PDF...");
  }

  function handleExportExcel() {
    alert("Exporting returns audit history to Excel (.xlsx)...");
  }

  function handleRefresh() {
    setDateRange("01-Aug-2026 - 12-Dec-2026");
    setStatus("All Statuses");
    setBranch("All");
  }

  function handleApplyFilters() {
    alert("Returns history filters applied successfully.");
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <ReturnsHistoryHeader />

      {/* 2. Filter Bar */}
      <ReturnsHistoryFilterBar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        status={status}
        onStatusChange={setStatus}
        branch={branch}
        onBranchChange={setBranch}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
        onRefresh={handleRefresh}
        onApplyFilters={handleApplyFilters}
      />

      {/* 3. Table */}
      <ReturnsHistoryTable items={filteredItems} />

      {/* 4. Pagination */}
      <ReturnsHistoryPagination
        currentPage={currentPage}
        totalPages={15}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </main>
  );
}
