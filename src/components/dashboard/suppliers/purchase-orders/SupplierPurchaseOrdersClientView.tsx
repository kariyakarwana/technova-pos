"use client";

import { useMemo, useState } from "react";
import {
  MOCK_SUPPLIER_PO_STATUS_COUNTS,
  MOCK_SUPPLIER_PURCHASE_ORDERS,
  type SupplierPOStatus,
  type SupplierPurchaseOrderItem,
} from "./SupplierPurchaseOrdersMock";
import SupplierPurchaseOrdersHeader from "./SupplierPurchaseOrdersHeader";
import SupplierPurchaseOrdersFilterBar from "./SupplierPurchaseOrdersFilterBar";
import SupplierOrderStatusCards from "./SupplierOrderStatusCards";
import SupplierPurchaseOrdersTable from "./SupplierPurchaseOrdersTable";
import SupplierPurchaseOrdersPagination from "./SupplierPurchaseOrdersPagination";

export default function SupplierPurchaseOrdersClientView() {
  const [orders] = useState<SupplierPurchaseOrderItem[]>(
    MOCK_SUPPLIER_PURCHASE_ORDERS
  );
  const [statusCounts] = useState(MOCK_SUPPLIER_PO_STATUS_COUNTS);

  const [selectedSupplier, setSelectedSupplier] = useState("All Suppliers");
  const [dateRange, setDateRange] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "All Statuses" | SupplierPOStatus
  >("All Statuses");

  const [currentPage, setCurrentPage] = useState<number>(4);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const supplierOptions = useMemo(
    () => [
      "All Suppliers",
      "TechZone",
      "Alpha Electronics",
      "Global Components",
    ],
    []
  );

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (selectedSupplier !== "All Suppliers") {
      result = result.filter((o) =>
        o.supplier.toLowerCase().includes(selectedSupplier.toLowerCase())
      );
    }

    if (selectedStatus !== "All Statuses") {
      result = result.filter((o) => o.status === selectedStatus);
    }

    if (dateRange.trim()) {
      result = result.filter((o) =>
        o.date.toLowerCase().includes(dateRange.toLowerCase().trim())
      );
    }

    return result;
  }, [orders, selectedSupplier, selectedStatus, dateRange]);

  function handleFilterClick() {
    alert("Purchase Orders advanced filter drawer toggled.");
  }

  function handleExport() {
    alert("Exporting supplier purchase orders dataset...");
  }

  function handleCardStatusSelect(status: string) {
    if (selectedStatus === status) {
      setSelectedStatus("All Statuses");
    } else {
      setSelectedStatus(status as SupplierPOStatus);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <SupplierPurchaseOrdersHeader
        onFilterClick={handleFilterClick}
        onExport={handleExport}
      />

      {/* 2. Filter Bar */}
      <SupplierPurchaseOrdersFilterBar
        selectedSupplier={selectedSupplier}
        onSupplierChange={setSelectedSupplier}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        supplierOptions={supplierOptions}
      />

      {/* 3. Status KPI Cards (6 columns) */}
      <SupplierOrderStatusCards
        counts={statusCounts}
        selectedStatus={selectedStatus}
        onSelectStatus={handleCardStatusSelect}
      />

      {/* 4. Data Table */}
      <SupplierPurchaseOrdersTable orders={filteredOrders} />

      {/* 5. Pagination */}
      <SupplierPurchaseOrdersPagination
        currentPage={currentPage}
        totalPages={15}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </main>
  );
}
