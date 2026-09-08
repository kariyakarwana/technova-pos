"use client";

import { useEffect, useMemo, useState } from "react";
import { useBranch } from "@/components/dashboard/BranchContext";
import { apiGet } from "@/lib/api/client";
import DashboardMetricsGrid from "./DashboardMetricsGrid";
import SalesPurchaseChartCard from "./SalesPurchaseChartCard";
import OverallInformationCard from "./OverallInformationCard";
import TopSellingProductsCard from "./TopSellingProductsCard";
import LowStockProductsCard from "./LowStockProductsCard";
import RecentSalesCard from "./RecentSalesCard";
import TopCustomersCard from "./TopCustomersCard";
import TopCategoriesCard from "./TopCategoriesCard";
import OrderStatisticsHeatmapCard from "./OrderStatisticsHeatmapCard";
import type { KpiCardItem, TopBannerMetric } from "./AdminDashboardTypes";

type Report = {
  period: { from: string; to: string };
  sales: { count: number; total: number; paid: number; balanceDue: number };
  customers: number; credit: { accounts: number; outstanding: number };
  returns: { count: number; total: number }; comparisons: { sales: number; purchases: number; returns: number };
  purchases: { count: number; total: number }; profit: number; suppliers: number;
  customerOverview: { firstTime: number; returning: number };
  monthlyTrends: Array<{ month: string; purchase: number; sales: number }>;
  topSellingProducts: Array<{ id: string; name: string; price: number; quantity: number; imageUrl: string }>;
  lowStockProducts: Array<{ id: string; name: string; sku: string; quantity: number; imageUrl: string }>;
  recentSales: Array<{ id: string; name: string; category: string; total: number; date: string; status: string; imageUrl: string }>;
  topCustomers: Array<{ id: string; name: string; country: string; orderCount: number; spent: number; avatarUrl: string }>;
  categories: Array<{ name: string; percentage: number; salesCount: number }>;
  categorySummary: { totalCategories: number; totalProducts: number }; heatmap: number[][];
};

const money = (value: number) => new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(value);
const compact = (value: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
const delta = (value: number) => `${value >= 0 ? "+" : ""}${Math.round(value)}%`;
const fallbackImage = "/posmachine.png";

export default function AdminDashboardClientView() {
  const { branchId } = useBranch();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    apiGet<Report>(`/reports/dashboard${branchId ? `?branchId=${encodeURIComponent(branchId)}` : ""}`)
      .then((value) => { if (active) setReport(value); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load dashboard data."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [branchId]);

  const data = useMemo(() => {
    if (!report) return null;
    const banners: TopBannerMetric[] = [
      { title: "Total Sales", amount: money(report.sales.total), change: delta(report.comparisons.sales), isPositive: report.comparisons.sales >= 0, bgGradient: "bg-gradient-to-r from-orange-400 to-amber-500", iconName: "sales" },
      { title: "Total Sales Return", amount: money(report.returns.total), change: delta(report.comparisons.returns), isPositive: report.comparisons.returns <= 0, bgGradient: "bg-[#092C4C]", iconName: "sales_return" },
      { title: "Total Purchase", amount: money(report.purchases.total), change: delta(report.comparisons.purchases), isPositive: report.comparisons.purchases >= 0, bgGradient: "bg-[var(--brand-green)]", iconName: "purchase" },
      { title: "Purchase Returns", amount: money(0), change: "0%", isPositive: true, bgGradient: "bg-blue-600", iconName: "purchase_return" },
    ];
    const kpis: KpiCardItem[] = [
      { title: "Gross Profit", amount: money(report.profit), changeText: "Sales less product cost", isPositive: report.profit >= 0, iconBg: "bg-sky-50", iconColor: "text-sky-500", iconType: "profit" },
      { title: "Invoice Due", amount: money(report.sales.balanceDue), changeText: `${report.credit.accounts} active credit accounts`, isPositive: report.sales.balanceDue === 0, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", iconType: "due" },
      { title: "Purchase Expenses", amount: money(report.purchases.total), changeText: `${report.purchases.count} purchase orders`, isPositive: true, iconBg: "bg-orange-50", iconColor: "text-orange-500", iconType: "expense" },
      { title: "Refunded Payments", amount: money(report.returns.total), changeText: `${report.returns.count} returns`, isPositive: report.returns.total === 0, iconBg: "bg-purple-50", iconColor: "text-purple-500", iconType: "payment_return" },
    ];
    const sold = report.topSellingProducts.reduce((sum, item) => sum + item.quantity, 0);
    const completed = (status: string) => status === "COMPLETED" || status === "REFUNDED" || status === "PARTIALLY_REFUNDED";
    return {
      banners, kpis,
      overall: { suppliersCount: report.suppliers, customersCount: report.customers, ordersCount: report.sales.count, firstTimeAmount: compact(report.customerOverview.firstTime), firstTimeRate: report.customers ? `${Math.round(report.customerOverview.firstTime / report.customers * 100)}%` : "0%", returnAmount: compact(report.customerOverview.returning), returnRate: report.customers ? `${Math.round(report.customerOverview.returning / report.customers * 100)}%` : "0%" },
      products: report.topSellingProducts.map((item) => ({ id: item.id, name: item.name, price: money(item.price), salesCount: `${compact(item.quantity)} sold`, trend: sold ? `${Math.round(item.quantity / sold * 100)}%` : "0%", isPositive: true, imageUrl: item.imageUrl || fallbackImage })),
      lowStock: report.lowStockProducts.map((item) => ({ id: item.id, name: item.name, skuId: `SKU: ${item.sku}`, inStock: item.quantity, imageUrl: item.imageUrl || fallbackImage })),
      recent: report.recentSales.map((item) => ({ id: item.id, name: item.name, category: item.category, price: money(item.total), date: new Intl.DateTimeFormat("en-LK", { dateStyle: "medium" }).format(new Date(item.date)), status: completed(item.status) ? "Completed" as const : item.status === "CANCELLED" ? "Cancelled" as const : item.status === "DRAFT" ? "OnHold" as const : "Processing" as const, imageUrl: item.imageUrl || fallbackImage })),
      customers: report.topCustomers.map((item) => ({ id: item.id, name: item.name, country: item.country || "Not specified", orderCount: `${item.orderCount} Orders`, spentAmount: money(item.spent), avatarUrl: item.avatarUrl || fallbackImage })),
      categories: report.categories.map((item, index) => ({ ...item, color: ["#F97316", "#991B1B", "#0E9384", "#2563EB", "#7C3AED"][index] })),
    };
  }, [report]);

  if (loading) return <main className="min-h-screen bg-[var(--brand-app-bg)] p-6"><div className="rounded-2xl border bg-white p-8 text-sm text-slate-500">Loading live dashboard data…</div></main>;
  if (error || !data || !report) return <main className="min-h-screen bg-[var(--brand-app-bg)] p-6"><div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{error || "Dashboard data is unavailable."}</div></main>;

  return <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
    <header><p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-green)]">Live business overview</p><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-xs text-slate-500">Database values from {new Intl.DateTimeFormat("en-LK", { dateStyle: "medium" }).format(new Date(report.period.from))} to {new Intl.DateTimeFormat("en-LK", { dateStyle: "medium" }).format(new Date(report.period.to))}.</p></header>
    <DashboardMetricsGrid bannerMetrics={data.banners} kpiCards={data.kpis} />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6"><div className="lg:col-span-8"><SalesPurchaseChartCard data={report.monthlyTrends} /></div><div className="lg:col-span-4"><OverallInformationCard {...data.overall} /></div></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><TopSellingProductsCard products={data.products} /><LowStockProductsCard products={data.lowStock} /><RecentSalesCard sales={data.recent} /></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><TopCustomersCard customers={data.customers} /><TopCategoriesCard categories={data.categories} totalCategories={report.categorySummary.totalCategories} totalProducts={report.categorySummary.totalProducts} /><OrderStatisticsHeatmapCard days={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} times={["12 am", "3 am", "6 am", "9 am", "12 pm", "3 pm", "6 pm", "9 pm", "Late"]} matrix={report.heatmap} /></div>
  </main>;
}
