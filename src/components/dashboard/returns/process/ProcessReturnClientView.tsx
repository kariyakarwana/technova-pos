"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MOCK_LOOKUP_DEFAULT,
  MOCK_RETURNABLE_ITEMS,
  type ResolutionType,
  type ReturnLookupResult,
  type ReturnableItem,
} from "./ProcessReturnMock";
import ProcessReturnHeader from "./ProcessReturnHeader";
import TransactionLookupCard from "./TransactionLookupCard";
import SelectReturnItemsCard from "./SelectReturnItemsCard";
import ReturnResolutionCard from "./ReturnResolutionCard";
import ReturnSummarySidebar from "./ReturnSummarySidebar";

export default function ProcessReturnClientView() {
  const router = useRouter();

  // 1. Transaction Lookup State
  const [searchQuery, setSearchQuery] = useState("TXN-9982-A4");
  const [lookupResult, setLookupResult] =
    useState<ReturnLookupResult | null>(MOCK_LOOKUP_DEFAULT);
  const [isSearching, setIsSearching] = useState(false);

  // 2. Select Items State
  const [items, setItems] = useState<ReturnableItem[]>(MOCK_RETURNABLE_ITEMS);

  // 3. Resolution State
  const [selectedResolution, setSelectedResolution] =
    useState<ResolutionType>("original_method");

  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Calculations
  const {
    originalTotal,
    selectedTotal,
    selectedCount,
    taxRefund,
    restockingFee,
    refundableAmount,
  } = useMemo(() => {
    const orig = 239.49;
    const selected = items.filter((i) => i.isSelected);
    const count = selected.length;
    const sub = selected.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tax = selected.length > 0 ? (count === 1 && sub === 149.99 ? 12.0 : Number((sub * 0.08).toFixed(2))) : 0;
    const fee = 0.0;
    const total = sub + tax - fee;

    return {
      originalTotal: orig,
      selectedTotal: sub,
      selectedCount: count,
      taxRefund: tax,
      restockingFee: fee,
      refundableAmount: total,
    };
  }, [items]);

  // Handlers
  function handleSearch() {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setLookupResult({
        invoiceNumber: searchQuery.trim(),
        purchaseDate: "Oct 24, 2023",
        customerName: "Walk-in",
        isVerified: true,
      });
    }, 400);
  }

  function handleToggleItem(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  }

  function handleUpdateCondition(id: string, condition: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, condition } : item))
    );
  }

  function handleUpdateReason(id: string, reason: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reason } : item))
    );
  }

  function handleAuthorizeRefund() {
    if (selectedCount === 0) {
      alert("Please select at least one item to return.");
      return;
    }

    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      alert(
        `Refund of $${refundableAmount.toFixed(
          2
        )} authorized via ${selectedResolution.replace("_", " ")}!`
      );
      router.push("/returns-refunds");
    }, 600);
  }

  function handleCancelReturn() {
    router.push("/returns-refunds");
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <ProcessReturnHeader />

      {/* 2. Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3-Step Wizard Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Lookup */}
          <TransactionLookupCard
            query={searchQuery}
            onQueryChange={setSearchQuery}
            onSearch={handleSearch}
            lookupResult={lookupResult}
            isSearching={isSearching}
          />

          {/* Step 2: Select Return Items */}
          <SelectReturnItemsCard
            items={items}
            onToggleItem={handleToggleItem}
            onUpdateCondition={handleUpdateCondition}
            onUpdateReason={handleUpdateReason}
          />

          {/* Step 3: Resolution Method */}
          <ReturnResolutionCard
            selectedResolution={selectedResolution}
            onSelectResolution={setSelectedResolution}
          />
        </div>

        {/* Right Column: Sticky Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-6">
          <ReturnSummarySidebar
            originalTotal={originalTotal}
            selectedTotal={selectedTotal}
            selectedCount={selectedCount}
            taxRefund={taxRefund}
            restockingFee={restockingFee}
            refundableAmount={refundableAmount}
            onAuthorizeRefund={handleAuthorizeRefund}
            onCancelReturn={handleCancelReturn}
            isAuthorizing={isAuthorizing}
          />
        </div>
      </div>
    </main>
  );
}
