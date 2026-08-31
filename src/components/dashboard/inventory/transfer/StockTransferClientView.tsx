"use client";

import { useMemo, useState } from "react";
import {
  MOCK_TRANSFER_ITEMS,
  type TransferDirection,
  type TransferItem,
} from "./StockTransferMock";
import StockTransferHeader from "./StockTransferHeader";
import StockTransferStatsCards from "./StockTransferStatsCards";
import StockTransferTabsFilter from "./StockTransferTabsFilter";
import StockTransferTable from "./StockTransferTable";
import StockTransferPagination from "./StockTransferPagination";

export default function StockTransferClientView() {
  const [items] = useState<TransferItem[]>(MOCK_TRANSFER_ITEMS);
  const [activeTab, setActiveTab] = useState<TransferDirection>("outgoing");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(4);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const filteredItems = useMemo(() => {
    let result = items.filter((item) => item.direction === activeTab);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.transferId.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          item.destination.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, activeTab, searchQuery]);

  function handleCreateTransfer() {
    alert("New Stock Transfer wizard / modal opened");
  }

  function handleFilterClick() {
    alert("Transfer filter dialog opened");
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <StockTransferHeader onCreateTransfer={handleCreateTransfer} />

      {/* 2. Top Metric Cards (3 Cards) */}
      <StockTransferStatsCards />

      {/* 3. Table Card with Tabs */}
      <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-5 shadow-xs space-y-4">
        {/* Tabs & Search Controls */}
        <StockTransferTabsFilter
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={handleFilterClick}
        />

        {/* Transfer Table */}
        <StockTransferTable items={filteredItems} />

        {/* Pagination Footer */}
        <StockTransferPagination
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
