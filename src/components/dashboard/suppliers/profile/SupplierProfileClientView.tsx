"use client";

import { useState } from "react";
import {
  MOCK_SUPPLIER_PROFILE,
  type SupplierProfileData,
} from "./SupplierProfileMock";
import SupplierProfileHeader from "./SupplierProfileHeader";
import SupplierProfileHeroCard from "./SupplierProfileHeroCard";
import SupplierPerformanceStatsCards from "./SupplierPerformanceStatsCards";
import AISupplyInsightCard from "./AISupplyInsightCard";
import DeliveryReliabilityChart from "./DeliveryReliabilityChart";
import SupplierPrimaryContactCard from "./SupplierPrimaryContactCard";
import SupplierRecentActivitySidebar from "./SupplierRecentActivitySidebar";

interface SupplierProfileClientViewProps {
  id?: string;
}

export default function SupplierProfileClientView({
  id,
}: SupplierProfileClientViewProps) {
  const [profile] = useState<SupplierProfileData>({
    ...MOCK_SUPPLIER_PROFILE,
    id: id || MOCK_SUPPLIER_PROFILE.id,
  });

  function handleAddSupplier() {
    alert("Add new supplier modal opened.");
  }

  function handleExport() {
    alert("Exporting supplier profile report...");
  }

  function handleExportPdf() {
    alert("Exporting profile to PDF...");
  }

  function handleExportExcel() {
    alert("Exporting profile to Excel...");
  }

  function handleRefresh() {
    alert("Refreshed supplier metrics.");
  }

  function handleEditProfile() {
    alert(`Editing profile for: ${profile.name}`);
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <SupplierProfileHeader
        onAddSupplier={handleAddSupplier}
        onExport={handleExport}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
        onRefresh={handleRefresh}
      />

      {/* 2. Supplier Hero Overview Card */}
      <SupplierProfileHeroCard
        name={profile.name}
        status={profile.status}
        location={profile.location}
        category={profile.category}
        partnerSince={profile.partnerSince}
        onEditProfile={handleEditProfile}
      />

      {/* 3. Performance Metrics (3 Cards) */}
      <SupplierPerformanceStatsCards
        reliabilityScore={profile.reliabilityScore}
        reliabilityTrend={profile.reliabilityTrend}
        totalPurchasesYTD={profile.totalPurchasesYTD}
        avgLeadTime={profile.avgLeadTime}
        avgLeadTimeTrend={profile.avgLeadTimeTrend}
      />

      {/* 4. 2-Column Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: AI Supply Insight & Delivery Reliability Chart (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <AISupplyInsightCard insightText={profile.aiInsightText} />
          <DeliveryReliabilityChart trendData={profile.reliabilityMonthlyTrend} />
        </div>

        {/* Right Column: Primary Contact & Recent Activity (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <SupplierPrimaryContactCard
            name={profile.primaryContact.name}
            role={profile.primaryContact.role}
            email={profile.primaryContact.email}
            phone={profile.primaryContact.phone}
            avatarUrl={profile.primaryContact.avatarUrl}
          />

          <SupplierRecentActivitySidebar
            activities={profile.recentActivities}
          />
        </div>
      </div>
    </main>
  );
}
