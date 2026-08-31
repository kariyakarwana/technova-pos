"use client";

import { useMemo, useState } from "react";
import {
  INITIAL_PO_ITEMS,
  type PurchaseOrderItemEntry,
} from "./CreatePurchaseOrderMock";
import CreatePurchaseOrderHeader from "./CreatePurchaseOrderHeader";
import PurchaseOrderDetailsForm from "./PurchaseOrderDetailsForm";
import PurchaseOrderItemsTable from "./PurchaseOrderItemsTable";
import PurchaseOrderSummaryFooter from "./PurchaseOrderSummaryFooter";

export default function CreatePurchaseOrderClientView() {
  const [supplier, setSupplier] = useState("All");
  const [deliveryDate, setDeliveryDate] = useState("01-Aug-2026");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [items, setItems] = useState<PurchaseOrderItemEntry[]>(INITIAL_PO_ITEMS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotalSum = useMemo(
    () => items.reduce((sum, item) => sum + item.subtotal, 0),
    [items]
  );

  const taxEstimated = useMemo(() => subtotalSum * 0.1, [subtotalSum]);
  const totalAmount = useMemo(
    () => subtotalSum + taxEstimated,
    [subtotalSum, taxEstimated]
  );

  function handleQuantityChange(id: string, qty: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: qty, subtotal: qty * item.unitPrice }
          : item
      )
    );
  }

  function handleUnitPriceChange(id: string, price: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, unitPrice: price, subtotal: item.quantity * price }
          : item
      )
    );
  }

  function handleToggleSelectAll() {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.id));
    }
  }

  function handleToggleSelectOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function handleSaveDraft() {
    alert("Purchase Order saved as draft successfully!");
  }

  function handleSubmitApproval() {
    alert(
      `Purchase Order Submitted for Approval!\nSupplier: ${supplier}\nExpected Delivery: ${deliveryDate}\nRef: ${
        referenceNumber || "N/A"
      }\nTotal Items: ${totalItems}\nTotal Amount: $${totalAmount.toFixed(2)}`
    );
  }

  function handleAddProductPrompt() {
    const newId = String(items.length + 1);
    const newItem: PurchaseOrderItemEntry = {
      id: newId,
      productName: `New Item #${newId}`,
      sku: `#00${newId}`,
      quantity: 1,
      unitPrice: 1000.0,
      subtotal: 1000.0,
    };
    setItems((prev) => [...prev, newItem]);
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <CreatePurchaseOrderHeader />

      {/* 2. Form Details Row */}
      <PurchaseOrderDetailsForm
        supplier={supplier}
        onSupplierChange={setSupplier}
        deliveryDate={deliveryDate}
        onDeliveryDateChange={setDeliveryDate}
        referenceNumber={referenceNumber}
        onReferenceNumberChange={setReferenceNumber}
        onSaveDraft={handleSaveDraft}
        onSubmitApproval={handleSubmitApproval}
      />

      {/* 3. Items Table */}
      <PurchaseOrderItemsTable
        items={items}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectOne={handleToggleSelectOne}
        onQuantityChange={handleQuantityChange}
        onUnitPriceChange={handleUnitPriceChange}
        onAddProductPrompt={handleAddProductPrompt}
      />

      {/* 4. Summary Banner Footer */}
      <PurchaseOrderSummaryFooter
        totalItems={totalItems}
        taxEstimated={taxEstimated}
        totalAmount={totalAmount}
      />
    </main>
  );
}
