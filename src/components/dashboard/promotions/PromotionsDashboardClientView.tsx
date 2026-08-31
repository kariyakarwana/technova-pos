"use client";

import { useState } from "react";
import {
  MOCK_PROMOTIONS_DATA,
  type PromotionItem,
} from "./PromotionsMock";
import PromotionsHeader from "./PromotionsHeader";
import PromotionsStatsCards from "./PromotionsStatsCards";
import ActivePromotionsTableCard from "./ActivePromotionsTableCard";
import PromotionsRecentActivitySidebar from "./PromotionsRecentActivitySidebar";

export default function PromotionsDashboardClientView() {
  const [data] = useState(MOCK_PROMOTIONS_DATA);

  function handleCreatePromotion() {
    alert("Opening Create Promotion form modal/route.");
  }

  function handleFilter() {
    alert("Promotions table filter modal toggled.");
  }

  function handleAction(item: PromotionItem) {
    alert(`Managing promotion options for: ${item.name} (${item.code})`);
  }

  function handleViewAllActivity() {
    alert("Navigating to complete promotion activity logs.");
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <PromotionsHeader onCreatePromotion={handleCreatePromotion} />

      {/* 2. Top 4 Stats Cards */}
      <PromotionsStatsCards stats={data.stats} />

      {/* 3. 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Active & Upcoming Promotions Table (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <ActivePromotionsTableCard
            promotions={data.promotions}
            onFilterClick={handleFilter}
            onActionClick={handleAction}
          />
        </div>

        {/* Right Column: Recent Activity Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <PromotionsRecentActivitySidebar
            activity={data.recentActivity}
            onViewAllActivity={handleViewAllActivity}
          />
        </div>
      </div>
    </main>
  );
}
