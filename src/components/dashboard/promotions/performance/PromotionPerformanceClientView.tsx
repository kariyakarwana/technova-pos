"use client";

import { useState } from "react";
import { MOCK_PERFORMANCE_DATA } from "./PromotionPerformanceMock";
import PromotionPerformanceHeader from "./PromotionPerformanceHeader";
import SalesVsPromotionsChart from "./SalesVsPromotionsChart";
import TopPerformingPromosCard from "./TopPerformingPromosCard";
import PromotionPerformanceTable from "./PromotionPerformanceTable";

export default function PromotionPerformanceClientView() {
  const [data] = useState(MOCK_PERFORMANCE_DATA);
  const [typeFilter, setTypeFilter] = useState("All Types");

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <PromotionPerformanceHeader />

      {/* 2. Top Row: Sales vs. Promotions (8 cols) & Top Performing Promos (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <SalesVsPromotionsChart data={data.monthlySales} />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <TopPerformingPromosCard promos={data.topPromos} />
        </div>
      </div>

      {/* 3. Bottom Row: Promotion Details Table */}
      <div className="w-full">
        <PromotionPerformanceTable
          items={data.tableData}
          selectedTypeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
        />
      </div>
    </main>
  );
}
