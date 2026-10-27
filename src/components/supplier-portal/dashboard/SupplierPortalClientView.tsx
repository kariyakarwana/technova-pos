"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type DeliveryStatus,
  type SupplierPurchaseOrder,
  type SupplierPortalStats,
} from "./supplier-portal.mock";
import SupplierPortalHeader from "./SupplierPortalHeader";
import SupplierPortalStatsCards from "./SupplierPortalStatsCards";
import SupplierActiveOrdersTable from "./SupplierActiveOrdersTable";
import { apiGet } from "@/lib/api/client";

type DashboardResponse = {
  supplier: { name: string };
  stats: { pending: number; inTransit: number; completedThisMonth: number; unread: number };
  orders: { data: Array<{
    id: string; orderNumber: string; total: string | number; createdAt: string; status: string;
    branch: { name: string };
    supplierResponses: Array<{ status: string; reviewStatus: string }>;
    supplierShipments: Array<{ status: string }>;
  }> };
};

export default function SupplierPortalClientView() {
  const [stats, setStats] = useState<SupplierPortalStats>({ pendingOrdersCount: 0, pendingOrdersTrend: "Awaiting your response", inTransitCount: 0, inTransitSubtitle: "Active shipments", completedMtdCount: 0, completedMtdRate: "Received this month" });
  const [orders, setOrders] = useState<SupplierPurchaseOrder[]>([]);
  const [dateRange, setDateRange] = useState("30");

  useEffect(() => {
    const from = dateRange === "all" ? "" : `&from=${encodeURIComponent(new Date(Date.now() - Number(dateRange) * 86400000).toISOString())}`;
    apiGet<DashboardResponse>(`/supplier-portal/dashboard?page=1&pageSize=100${from}`).then((result) => {
      setStats({
        pendingOrdersCount: result.stats.pending,
        pendingOrdersTrend: `${result.stats.unread} unread notification${result.stats.unread === 1 ? "" : "s"}`,
        inTransitCount: result.stats.inTransit,
        inTransitSubtitle: "Active shipments",
        completedMtdCount: result.stats.completedThisMonth,
        completedMtdRate: "Received this month",
      });
      setOrders(result.orders.data.map((order) => {
        const response = order.supplierResponses[0];
        const shipment = order.supplierShipments[0];
        let deliveryStatus: DeliveryStatus = "Pending response";
        if (order.status === "RECEIVED") deliveryStatus = "Received";
        else if (shipment?.status === "DISPATCHED") deliveryStatus = "Dispatched";
        else if (response?.status === "ACCEPTED") deliveryStatus = "Accepted";
        else if (response?.status === "CHANGES_PROPOSED") deliveryStatus = "Changes proposed";
        else if (response?.status === "REJECTED") deliveryStatus = "Rejected";
        return { id: order.id, poNumber: order.orderNumber, date: new Date(order.createdAt).toLocaleDateString(), totalAmount: `LKR ${Number(order.total).toLocaleString()}`, deliveryStatus, branchName: order.branch.name };
      }));
    }).catch((error) => toast.error(error instanceof Error ? error.message : "Unable to load supplier orders.", { duration: 8000 }));
  }, [dateRange]);

  function handleFilterToggle() {
    toast.info("Use the search box to filter by purchase order number.", { duration: 5000 });
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
      <SupplierPortalStatsCards stats={stats} />

      {/* 3. Active Purchase Orders TanStack Data Table */}
      <SupplierActiveOrdersTable
        orders={orders}
        onFilterToggle={handleFilterToggle}
      />
    </main>
  );
}
