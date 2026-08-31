"use client";

import { useMemo, useState } from "react";
import {
  MOCK_INVENTORY_LIST_ITEMS,
  type InventoryListItem,
  type InventoryListStatus,
} from "./InventoryListMock";
import InventoryProductListHeader from "./InventoryProductListHeader";
import InventoryProductListFilterBar from "./InventoryProductListFilterBar";
import InventoryProductListTable from "./InventoryProductListTable";
import InventoryProductListPagination from "./InventoryProductListPagination";

export default function InventoryProductListView() {
  const [items] = useState<InventoryListItem[]>(MOCK_INVENTORY_LIST_ITEMS);
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
      ...Array.from(new Set(MOCK_INVENTORY_LIST_ITEMS.map((item) => item.branch))),
    ],
    []
  );

  const categories = useMemo(
    () => [
      "All Categories",
      "Electronics",
      "Components",
      "Peripherals",
      "Displays",
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
          item.category.toLowerCase().includes(q) ||
          item.branch.toLowerCase().includes(q)
      );
    }

    if (selectedBranch !== "All Branches") {
      result = result.filter((item) => item.branch === selectedBranch);
    }

    if (selectedCategory !== "All Categories") {
      result = result.filter((item) =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedStatus !== "All Statuses") {
      result = result.filter(
        (item) => item.status === (selectedStatus as InventoryListStatus)
      );
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

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-5">
      {/* 1. Page Header */}
      <InventoryProductListHeader />

      {/* 2. Filter Bar Card */}
      <InventoryProductListFilterBar
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
      />

      {/* 3. Table Card */}
      <div className="bg-[var(--brand-card-bg)] border border-[var(--brand-stroke)] rounded-2xl p-5 shadow-xs">
        <InventoryProductListTable
          items={filteredItems}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
        />

        <InventoryProductListPagination
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
