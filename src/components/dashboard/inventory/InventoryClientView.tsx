"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, Plus } from "lucide-react";
import {
  MOCK_INVENTORY_ITEMS,
  type InventoryItem,
  type InventoryStatus,
} from "./inventory.mock";
import InventoryStatsCards from "./InventoryStatsCards";
import StockLevelsChart from "./StockLevelsChart";
import InventorySidebarWidgets from "./InventorySidebarWidgets";
import InventoryFilterBar from "./InventoryFilterBar";
import InventoryTable from "./InventoryTable";

export default function InventoryClientView() {
  const [items] = useState<InventoryItem[]>(MOCK_INVENTORY_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(4);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const branches = useMemo(
    () => [
      "All Branches",
      ...Array.from(new Set(MOCK_INVENTORY_ITEMS.map((item) => item.branch))),
    ],
    []
  );

  const categories = useMemo(
    () => [
      "All Categories",
      "Electronics",
      "Components",
      "Peripherals",
      "Audio",
    ],
    []
  );

  const statuses = ["All Statuses", "In Stock", "Low Stock", "Out of Stock"];

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.categoryHierarchy.toLowerCase().includes(q) ||
          item.branch.toLowerCase().includes(q)
      );
    }

    if (selectedBranch !== "All Branches") {
      result = result.filter((item) => item.branch === selectedBranch);
    }

    if (selectedCategory !== "All Categories") {
      result = result.filter((item) =>
        item.categoryHierarchy.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedStatus !== "All Statuses") {
      result = result.filter((item) => item.status === (selectedStatus as InventoryStatus));
    }

    return result;
  }, [items, searchQuery, selectedBranch, selectedCategory, selectedStatus]);

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
    setSearchQuery("");
    setSelectedBranch("All Branches");
    setSelectedCategory("All Categories");
    setSelectedStatus("All Statuses");
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 space-y-6">
      {/* 1. Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1D2939] tracking-tight">
            Inventory Management
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400 font-medium">
            <Link
              href="/dashboard"
              className="hover:text-[#0E9384] transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="text-slate-500">Inventory Management</span>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="h-9 px-3.5 rounded-xl border border-[#E4E7EC] bg-white hover:bg-slate-50 text-[#1D2939] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export Report</span>
          </button>

          <Link
            href="/products/product-list/add-product"
            className="h-9 px-4 rounded-xl bg-[#0E9384] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Stock</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards (4 Cards) */}
      <InventoryStatsCards />

      {/* 3. Middle Grid: Stock Levels Chart (65%) + Sidebar Widgets (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <StockLevelsChart />
        </div>
        <div className="lg:col-span-4">
          <InventorySidebarWidgets />
        </div>
      </div>

      {/* 4. Bottom Section: Filter Bar & Table Card */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs">
        <InventoryFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          branches={branches}
          categories={categories}
          statuses={statuses}
          onViewAll={handleResetFilters}
        />

        <InventoryTable
          items={filteredItems}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
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
