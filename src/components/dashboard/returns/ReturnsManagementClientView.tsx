"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MOCK_RETURNS_DATA } from "./ReturnsManagementMock";
import ReturnsManagementHeader from "./ReturnsManagementHeader";
import ReturnsStatsCards from "./ReturnsStatsCards";
import RecentReturnsTableCard from "./RecentReturnsTableCard";
import ReturnReasonsChartCard from "./ReturnReasonsChartCard";

export default function ReturnsManagementClientView() {
  const [data] = useState(MOCK_RETURNS_DATA);

  function handleViewHistory() {
    toast.info("Viewing complete returns audit history.", { duration: 5000 });
  }

  function handleProcessReturn() {
    toast.info("Process return request modal opened.", { duration: 5000 });
  }

  function handleFilter() {
    toast.info("Returns table filter toggled.", { duration: 5000 });
  }

  function handleMore() {
    toast.info("More options menu toggled.", { duration: 5000 });
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <ReturnsManagementHeader
        onViewHistory={handleViewHistory}
        onProcessReturn={handleProcessReturn}
      />

      {/* 2. Top 4 Stats Cards */}
      <ReturnsStatsCards stats={data.stats} />

      {/* 3. 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Recent Return Requests (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <RecentReturnsTableCard
            returns={data.recentReturns}
            onFilterClick={handleFilter}
            onMoreClick={handleMore}
          />
        </div>

        {/* Right Column: Return Reasons Breakdown (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <ReturnReasonsChartCard
            totalReturns={data.reasons.totalReturns}
            breakdown={data.reasons.breakdown}
          />
        </div>
      </div>
    </main>
  );
}
