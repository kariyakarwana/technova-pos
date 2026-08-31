"use client";

import { useState } from "react";
import {
  MOCK_PO_DETAILS,
  type PurchaseOrderDetails,
} from "./PurchaseDetailsMock";
import PurchaseDetailsHeader from "./PurchaseDetailsHeader";
import SupplierInformationCard from "./SupplierInformationCard";
import OrderDetailsSidebarCard from "./OrderDetailsSidebarCard";
import PurchaseLineItemsTable from "./PurchaseLineItemsTable";
import PurchaseAuditLogSidebar from "./PurchaseAuditLogSidebar";

interface PurchaseDetailsClientViewProps {
  id?: string;
}

export default function PurchaseDetailsClientView({
  id,
}: PurchaseDetailsClientViewProps) {
  const [details] = useState<PurchaseOrderDetails>({
    ...MOCK_PO_DETAILS,
    poNumber: id ? `#${decodeURIComponent(id)}` : MOCK_PO_DETAILS.poNumber,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function handleCancel() {
    alert("Order view closed.");
  }

  function handleEdit() {
    alert(`Editing Purchase Order: ${details.poNumber}`);
  }

  function handleReject() {
    alert(`Purchase Order ${details.poNumber} marked as Rejected.`);
  }

  function handleApprove() {
    alert(`Purchase Order ${details.poNumber} Approved successfully!`);
  }

  function handleToggleSelectAll() {
    if (selectedIds.length === details.lineItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(details.lineItems.map((item) => item.id));
    }
  }

  function handleToggleSelectOne(itemId: string) {
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    );
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <PurchaseDetailsHeader
        poNumber={details.poNumber}
        onCancel={handleCancel}
        onEdit={handleEdit}
        onReject={handleReject}
        onApprove={handleApprove}
      />

      {/* 2. Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Supplier Info & Line Items Table (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <SupplierInformationCard
            supplierName={details.supplierName}
            vendorId={details.vendorId}
            contactName={details.contactName}
            contactEmail={details.contactEmail}
            shippingWarehouse={details.shippingWarehouse}
            shippingAddress1={details.shippingAddress1}
            shippingAddress2={details.shippingAddress2}
          />

          <PurchaseLineItemsTable
            items={details.lineItems}
            subtotal={details.subtotal}
            tax={details.tax}
            shipping={details.shipping}
            total={details.total}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectOne={handleToggleSelectOne}
          />
        </div>

        {/* Right Column: Order Details & Audit Log (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <OrderDetailsSidebarCard
            dateCreated={details.dateCreated}
            expectedDelivery={details.expectedDelivery}
            paymentTerms={details.paymentTerms}
            department={details.department}
          />

          <PurchaseAuditLogSidebar logs={details.auditLogs} />
        </div>
      </div>
    </main>
  );
}
