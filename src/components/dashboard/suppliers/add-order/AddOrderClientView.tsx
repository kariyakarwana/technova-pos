"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  INITIAL_ADD_ORDER_LINE_ITEMS,
  type AddOrderLineItem,
} from "./AddOrderMock";
import AddOrderHeader from "./AddOrderHeader";
import AddOrderDetailsCard from "./AddOrderDetailsCard";
import AddOrderLineItemsTable from "./AddOrderLineItemsTable";
import AddOrderSummarySidebar from "./AddOrderSummarySidebar";

export default function AddOrderClientView() {
  const router = useRouter();

  // Order Details
  const [supplier, setSupplier] = useState("");
  const [branch, setBranch] = useState("All Statuses");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  // Line items
  const [items, setItems] = useState<AddOrderLineItem[]>(
    INITIAL_ADD_ORDER_LINE_ITEMS
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supplierOptions = useMemo(
    () => [
      "Global Electronics Ltd.",
      "TechZone Distributors",
      "Apex Materials Ltd.",
      "Quantum Electronics",
    ],
    []
  );

  const branchOptions = useMemo(
    () => [
      "All Statuses",
      "Branch 1 - Downtown",
      "Branch 2 - Westside",
      "TechNova Main Warehouse",
    ],
    []
  );

  // Financial calculations
  const { subtotal, discount, tax, shipping, total } = useMemo(() => {
    let sub = 0;
    let disc = 0;
    let tx = 0;
    const ship = items.length > 0 ? 50.0 : 0.0;

    items.forEach((item) => {
      const lineRaw = item.qty * item.unitCost;
      const lineDisc = lineRaw * (item.discountPercent / 100);
      const lineDiscounted = lineRaw - lineDisc;
      const lineTax = lineDiscounted * (item.taxPercent / 100);

      sub += lineRaw;
      disc += lineDisc;
      tx += lineTax;
    });

    const tot = sub - disc + tx + ship;

    return {
      subtotal: sub,
      discount: disc,
      tax: tx,
      shipping: ship,
      total: tot,
    };
  }, [items]);

  // Actions
  function handleFilterClick() {
    alert("Advanced filters toggled.");
  }

  function handleExport() {
    alert("Exporting current order draft...");
  }

  function handleUpdateItem<K extends keyof AddOrderLineItem>(
    id: string,
    field: K,
    value: AddOrderLineItem[K]
  ) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function handleDeleteItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleAddBlankLine() {
    const nextId = String(Date.now());
    const newLine: AddOrderLineItem = {
      id: nextId,
      productName: "",
      sku: `HW-NEW-${items.length + 1}`,
      qty: 1,
      unitCost: 0,
      taxPercent: 8,
      discountPercent: 0,
    };
    setItems((prev) => [...prev, newLine]);
  }

  function handleSubmitForApproval() {
    if (!supplier) {
      alert("Please select a Supplier.");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one line item.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Purchase Order created and submitted for approval!");
      router.push("/suppliers/purchase-orders");
    }, 600);
  }

  function handleSaveDraft() {
    alert("Purchase Order saved as Draft.");
    router.push("/suppliers/purchase-orders");
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <AddOrderHeader
        onFilterClick={handleFilterClick}
        onExport={handleExport}
      />

      {/* 2. Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Order Details & Line Items Table (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <AddOrderDetailsCard
            supplier={supplier}
            onSupplierChange={setSupplier}
            branch={branch}
            onBranchChange={setBranch}
            deliveryDate={deliveryDate}
            onDeliveryDateChange={setDeliveryDate}
            referenceNumber={referenceNumber}
            onReferenceNumberChange={setReferenceNumber}
            supplierOptions={supplierOptions}
            branchOptions={branchOptions}
          />

          <AddOrderLineItemsTable
            items={items}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onAddBlankLine={handleAddBlankLine}
          />
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4 sticky top-6">
          <AddOrderSummarySidebar
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            shipping={shipping}
            total={total}
            onSubmitForApproval={handleSubmitForApproval}
            onSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </main>
  );
}
