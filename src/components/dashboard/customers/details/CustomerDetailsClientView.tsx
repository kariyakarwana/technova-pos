"use client";

import { useMemo, useState } from "react";
import {
  MOCK_CUSTOMER_PROFILE,
  type CustomerProfileData,
} from "./CustomerDetailsMock";
import CustomerDetailsHeader from "./CustomerDetailsHeader";
import CustomerHeroCard from "./CustomerHeroCard";
import CustomerPersonalDetailsCard from "./CustomerPersonalDetailsCard";
import CustomerLoyaltySnapshotCard from "./CustomerLoyaltySnapshotCard";
import CustomerHistoryTabsTable from "./CustomerHistoryTabsTable";
import CustomerHistoryPagination from "./CustomerHistoryPagination";

interface CustomerDetailsClientViewProps {
  id?: string;
}

export default function CustomerDetailsClientView({
  id,
}: CustomerDetailsClientViewProps) {
  const [profile] = useState<CustomerProfileData>({
    ...MOCK_CUSTOMER_PROFILE,
    customerId: id ? String(id) : MOCK_CUSTOMER_PROFILE.customerId,
  });

  const [activeTab, setActiveTab] = useState<"purchase" | "points">("points");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [currentPage, setCurrentPage] = useState<number>(4);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isHeroCollapsed, setIsHeroCollapsed] = useState(false);

  // Filter purchase history
  const filteredPurchases = useMemo(() => {
    let result = [...profile.purchaseHistory];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.orderId.toLowerCase().includes(q) ||
          p.date.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q)
      );
    }
    return result;
  }, [profile.purchaseHistory, searchQuery]);

  // Filter point history
  const filteredPoints = useMemo(() => {
    let result = [...profile.pointHistory];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.orderId.toLowerCase().includes(q) ||
          p.date.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q)
      );
    }
    return result;
  }, [profile.pointHistory, searchQuery]);

  function handleDeactivate() {
    alert(`Customer account ${profile.customerId} deactivated.`);
  }

  function handleDelete() {
    if (confirm(`Are you sure you want to delete customer ${profile.customerId}?`)) {
      alert(`Customer ${profile.customerId} deleted.`);
    }
  }

  function handleViewLoyaltyDetails() {
    setActiveTab("points");
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <CustomerDetailsHeader
        customerId={profile.customerId}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
      />

      {/* 2. Top Hero Card */}
      <CustomerHeroCard
        customerId={profile.customerId}
        name={profile.name}
        customerSince={profile.customerSince}
        email={profile.email}
        phone={profile.phone}
        city={profile.city}
        avatarUrl={profile.avatarUrl}
        isCollapsed={isHeroCollapsed}
        onToggleCollapse={() => setIsHeroCollapsed((prev) => !prev)}
      />

      {/* 3. 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Personal Details & Loyalty Snapshot (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <CustomerPersonalDetailsCard
            customerId={profile.customerId}
            fullName={profile.personalDetails.fullName}
            phoneNumber={profile.personalDetails.phoneNumber}
            emailAddress={profile.personalDetails.emailAddress}
            shippingAddress={profile.personalDetails.shippingAddress}
          />

          <CustomerLoyaltySnapshotCard
            totalPoints={profile.loyaltySnapshot.totalPoints}
            expiringSoon={profile.loyaltySnapshot.expiringSoon}
            expDate={profile.loyaltySnapshot.expDate}
            onViewLoyaltyDetails={handleViewLoyaltyDetails}
          />
        </div>

        {/* Right Column: Tabbed History Table & Pagination (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <CustomerHistoryTabsTable
            activeTab={activeTab}
            onTabChange={setActiveTab}
            purchaseHistory={filteredPurchases}
            pointHistory={filteredPoints}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          <CustomerHistoryPagination
            currentPage={currentPage}
            totalPages={15}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        </div>
      </div>
    </main>
  );
}
