"use client";

import { useState } from "react";
import CreateAdjustmentHeader from "./CreateAdjustmentHeader";
import SelectProductCard, { type SelectedProduct } from "./SelectProductCard";
import AdjustmentDetailsForm, { type StockAdjustmentType } from "./AdjustmentDetailsForm";
import ImpactPreviewCard from "./ImpactPreviewCard";
import WorkflowApprovalsCard from "./WorkflowApprovalsCard";

const DEFAULT_PRODUCT: SelectedProduct = {
  name: "Ergonomic Office Chair Pro",
  sku: "FUR-CH-092",
  currentStock: 142,
};

export default function CreateAdjustmentClientView() {
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(
    DEFAULT_PRODUCT
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<StockAdjustmentType>("OUT");
  const [quantity, setQuantity] = useState<number>(5);
  const [reason, setReason] = useState("Damaged Goods");
  const [notes, setNotes] = useState("");
  const [requestApproval, setRequestApproval] = useState(true);

  function handleSaveDraft() {
    alert("Draft adjustment record saved successfully!");
  }

  function handleSubmitAdjustment() {
    if (!selectedProduct) {
      alert("Please select a product first.");
      return;
    }

    const diff = adjustmentType === "OUT" ? -quantity : quantity;
    const newStock = Math.max(0, selectedProduct.currentStock + diff);

    alert(
      `Stock Adjustment Submitted Successfully!\nProduct: ${selectedProduct.name} (${selectedProduct.sku})\nType: ${
        adjustmentType === "OUT" ? "Stock Out" : "Stock In"
      }\nAdjusted Qty: ${diff > 0 ? `+${diff}` : diff}\nReason: ${reason}\nNew Balance: ${newStock}\nApproval Routed: ${
        requestApproval ? "Yes (Sarah Manager)" : "No"
      }`
    );
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <CreateAdjustmentHeader onSaveDraft={handleSaveDraft} />

      {/* 2. 2-Column Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Selection & Adjustment Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <SelectProductCard
            product={selectedProduct}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRemoveProduct={() => setSelectedProduct(null)}
            onSelectProduct={setSelectedProduct}
          />

          <AdjustmentDetailsForm
            adjustmentType={adjustmentType}
            onAdjustmentTypeChange={setAdjustmentType}
            quantity={quantity}
            onQuantityChange={setQuantity}
            reason={reason}
            onReasonChange={setReason}
            notes={notes}
            onNotesChange={setNotes}
          />
        </div>

        {/* Right Column: Impact Preview & Workflow Approvals (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ImpactPreviewCard
            currentStock={selectedProduct ? selectedProduct.currentStock : 0}
            quantity={quantity}
            adjustmentType={adjustmentType}
          />

          <WorkflowApprovalsCard
            requestApproval={requestApproval}
            onRequestApprovalToggle={() => setRequestApproval((prev) => !prev)}
            onSubmitAdjustment={handleSubmitAdjustment}
          />
        </div>
      </div>
    </main>
  );
}
