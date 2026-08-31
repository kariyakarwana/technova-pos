"use client";

import { useState } from "react";
import { MOCK_SUPPLIER_DASHBOARD } from "./SupplierDashboardMock";
import SupplierDashboardHeader from "./SupplierDashboardHeader";
import SupplierKPIStatsCards from "./SupplierKPIStatsCards";
import PurchaseTrendsChart from "./PurchaseTrendsChart";
import SupplierPaymentStatusChart from "./SupplierPaymentStatusChart";
import SupplierQuickNavCards from "./SupplierQuickNavCards";

export default function SupplierDashboardClientView() {
  const [data] = useState(MOCK_SUPPLIER_DASHBOARD);
  const [dateRange, setDateRange] = useState("Last 30 days");

  function handleFilterClick() {
    alert("Supplier dashboard advanced filter drawer opened.");
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <SupplierDashboardHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onFilterClick={handleFilterClick}
      />

      {/* 2. Top 4 KPI Stats Cards */}
      <SupplierKPIStatsCards kpis={data.kpis} />

      {/* 3. 2-Column Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Purchase Trends (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <PurchaseTrendsChart data={data.purchaseTrends} />
        </div>

        {/* Right: Payment Status (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <SupplierPaymentStatusChart data={data.paymentStatus} />
        </div>
      </div>

      {/* 4. Bottom Quick Nav Cards */}
      <SupplierQuickNavCards />
    </main>
  );
}
