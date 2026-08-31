"use client";

import { useState } from "react";
import { MOCK_ADMIN_DASHBOARD } from "./AdminDashboardMock";
import DashboardMetricsGrid from "./DashboardMetricsGrid";
import SalesPurchaseChartCard from "./SalesPurchaseChartCard";
import OverallInformationCard from "./OverallInformationCard";
import TopSellingProductsCard from "./TopSellingProductsCard";
import LowStockProductsCard from "./LowStockProductsCard";
import RecentSalesCard from "./RecentSalesCard";
import TopCustomersCard from "./TopCustomersCard";
import TopCategoriesCard from "./TopCategoriesCard";
import OrderStatisticsHeatmapCard from "./OrderStatisticsHeatmapCard";

export default function AdminDashboardClientView() {
  const [data] = useState(MOCK_ADMIN_DASHBOARD);

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Top Metrics Grid (Two Rows) */}
      <DashboardMetricsGrid
        bannerMetrics={data.bannerMetrics}
        kpiCards={data.kpiCards}
      />

      {/* 2. Middle Row: Sales & Purchase Chart (8 cols) & Overall Information (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <SalesPurchaseChartCard data={data.monthlyTrends} />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <OverallInformationCard
            suppliersCount={data.overallInformation.suppliersCount}
            customersCount={data.overallInformation.customersCount}
            ordersCount={data.overallInformation.ordersCount}
            firstTimeAmount={data.overallInformation.firstTimeAmount}
            firstTimeRate={data.overallInformation.firstTimeRate}
            returnAmount={data.overallInformation.returnAmount}
            returnRate={data.overallInformation.returnRate}
          />
        </div>
      </div>

      {/* 3. Third Row: Top Selling (4 cols), Low Stock (4 cols), Recent Sales (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <TopSellingProductsCard products={data.topSellingProducts} />
        <LowStockProductsCard products={data.lowStockProducts} />
        <RecentSalesCard sales={data.recentSales} />
      </div>

      {/* 4. Fourth Row: Top Customers (4 cols), Top Categories (4 cols), Order Statistics (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <TopCustomersCard customers={data.topCustomers} />
        <TopCategoriesCard
          categories={data.topCategories}
          totalCategories={data.categorySummary.totalCategories}
          totalProducts={data.categorySummary.totalProducts}
        />
        <OrderStatisticsHeatmapCard
          days={data.heatmapDays}
          times={data.heatmapTimes}
        />
      </div>
    </main>
  );
}
