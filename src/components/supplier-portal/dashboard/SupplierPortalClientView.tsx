"use client";

import { useState } from "react";
import {
  MOCK_SUPPLIER_PORTAL_DATA,
  type DeliveryStatus,
  type SupplierPurchaseOrder,
} from "./supplier-portal.mock";
import SupplierPortalHeader from "./SupplierPortalHeader";
import SupplierPortalStatsCards from "./SupplierPortalStatsCards";
import SupplierActiveOrdersTable from "./SupplierActiveOrdersTable";

export default function SupplierPortalClientView() {
  const [data] = useState(MOCK_SUPPLIER_PORTAL_DATA);
  const [orders, setOrders] = useState<SupplierPurchaseOrder[]>(
    MOCK_SUPPLIER_PORTAL_DATA.orders
  );
  const [dateRange, setDateRange] = useState("Last 30 days");

  function handleStatusChange(id: string, newStatus: DeliveryStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, deliveryStatus: newStatus } : o))
    );
  }

  function handleFilterToggle() {
    alert("Supplier order filters toggled.");
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header with Breadcrumbs & Date Range */}
      <SupplierPortalHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onFilterClick={handleFilterToggle}
      />

      {/* 2. Top 3 KPI Stats Cards */}
      <SupplierPortalStatsCards stats={data.stats} />

      {/* 3. Active Purchase Orders TanStack Data Table */}
      <SupplierActiveOrdersTable
        orders={orders}
        onStatusChange={handleStatusChange}
        onFilterToggle={handleFilterToggle}
      />
    </main>
  );
}
