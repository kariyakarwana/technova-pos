"use client";

import { useMemo, useState } from "react";
import {
  MOCK_SUPPLIERS,
  type SupplierManagementItem,
  type SupplierStatus,
} from "./SupplierManagementMock";
import SupplierManagementHeader from "./SupplierManagementHeader";
import SupplierQuickFiltersSidebar from "./SupplierQuickFiltersSidebar";
import SupplierSummaryCountCard from "./SupplierSummaryCountCard";
import SupplierManagementTable from "./SupplierManagementTable";
import SupplierManagementPagination from "./SupplierManagementPagination";

export default function SupplierManagementClientView() {
  const [items, setItems] = useState<SupplierManagementItem[]>(MOCK_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | SupplierStatus>("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState<number>(4);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [showFilters, setShowFilters] = useState(true);

  const categories = useMemo(
    () => [
      "All Categories",
      "Electronics",
      "Raw Materials",
      "Logistics",
      "Apparel",
    ],
    []
  );

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.id.toLowerCase().includes(q) ||
          item.supplierName.toLowerCase().includes(q) ||
          item.contactPerson.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (categoryFilter !== "All Categories") {
      result = result.filter(
        (item) => item.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    return result;
  }, [items, searchQuery, statusFilter, categoryFilter]);

  function handleAddSupplier() {
    alert("Add Supplier wizard / form modal opened.");
  }

  function handleExport() {
    alert("Exporting supplier directory...");
  }

  function handleExportPdf() {
    alert("Exporting supplier list to PDF...");
  }

  function handleExportExcel() {
    alert("Exporting supplier list to Excel (.xlsx)...");
  }

  function handleRefresh() {
    setSearchQuery("");
    setStatusFilter("All");
    setCategoryFilter("All Categories");
  }

  function handleView(item: SupplierManagementItem) {
    alert(`Viewing Supplier: ${item.supplierName} (${item.id})`);
  }

  function handleEdit(item: SupplierManagementItem) {
    alert(`Editing Supplier: ${item.supplierName} (${item.id})`);
  }

  function handleDelete(item: SupplierManagementItem) {
    if (confirm(`Are you sure you want to delete ${item.supplierName}?`)) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <SupplierManagementHeader
        onAddSupplier={handleAddSupplier}
        onExport={handleExport}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
        onRefresh={handleRefresh}
        onToggleCollapse={() => setShowFilters((prev) => !prev)}
      />

      {/* 2. Main 2-Column Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar (Filters + Summary Counter) - 3 cols */}
        {showFilters && (
          <div className="lg:col-span-3 space-y-5">
            <SupplierQuickFiltersSidebar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              categories={categories}
            />

            <SupplierSummaryCountCard
              totalCount={124}
              activeCount={118}
              inactiveCount={6}
            />
          </div>
        )}

        {/* Right Content (Table + Pagination) - 9 or 12 cols */}
        <div
          className={
            showFilters ? "lg:col-span-9 space-y-4" : "lg:col-span-12 space-y-4"
          }
        >
          <SupplierManagementTable
            items={filteredItems}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <SupplierManagementPagination
            currentPage={currentPage}
            totalPages={15}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        </div>
      </div>
    </main>
  );
}
