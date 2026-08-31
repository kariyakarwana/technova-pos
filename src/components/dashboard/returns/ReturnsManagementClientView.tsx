"use client";

import { useState } from "react";
import { MOCK_RETURNS_DATA } from "./ReturnsManagementMock";
import ReturnsManagementHeader from "./ReturnsManagementHeader";
import ReturnsStatsCards from "./ReturnsStatsCards";
import RecentReturnsTableCard from "./RecentReturnsTableCard";
import ReturnReasonsChartCard from "./ReturnReasonsChartCard";

export default function ReturnsManagementClientView() {
  const [data] = useState(MOCK_RETURNS_DATA);

  function handleViewHistory() {
    alert("Viewing complete returns audit history.");
  }

  function handleProcessReturn() {
    alert("Process return request modal opened.");
  }

  function handleFilter() {
    alert("Returns table filter toggled.");
  }

  function handleMore() {
    alert("More options menu toggled.");
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
