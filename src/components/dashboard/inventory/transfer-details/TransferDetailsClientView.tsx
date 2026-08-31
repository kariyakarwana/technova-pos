"use client";

import { useState } from "react";
import {
  MOCK_TRANSFER_DETAILS,
  type TransferDetails,
} from "./TransferDetailsMock";
import TransferDetailsHeader from "./TransferDetailsHeader";
import TransferLocationCards from "./TransferLocationCards";
import TrackingLifecycleStepper from "./TrackingLifecycleStepper";
import TransferItemsTable from "./TransferItemsTable";
import VerificationActionsSidebar from "./VerificationActionsSidebar";
import TransferAuditTrail from "./TransferAuditTrail";

interface TransferDetailsClientViewProps {
  id?: string;
}

export default function TransferDetailsClientView({
  id,
}: TransferDetailsClientViewProps) {
  const [details] = useState<TransferDetails>({
    ...MOCK_TRANSFER_DETAILS,
    transferId: id || MOCK_TRANSFER_DETAILS.transferId,
  });

  function handlePrint() {
    window.print();
  }

  function handleReceiveVerify() {
    alert(`Receive & Verify workflow initiated for ${details.transferId}`);
  }

  function handleScanToVerify() {
    alert("Barcode/QR scanner opened to verify received units.");
  }

  function handleUploadPackingSlip() {
    alert("Upload Packing Slip dialog opened.");
  }

  function handleReportDiscrepancy() {
    alert("Report Transfer Discrepancy form opened.");
  }

  function handleViewFullHistory() {
    alert("Showing comprehensive audit trail and timestamp records.");
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <TransferDetailsHeader
        transferId={details.transferId}
        status={details.status}
        onPrint={handlePrint}
        onReceiveVerify={handleReceiveVerify}
      />

      {/* 2. Top Location & Logistics Cards */}
      <TransferLocationCards
        sourceName={details.sourceName}
        sourceCode={details.sourceCode}
        sourceAuth={details.sourceAuth}
        destinationName={details.destinationName}
        destinationCode={details.destinationCode}
        destinationAttn={details.destinationAttn}
        logisticsCarrier={details.logisticsCarrier}
        logisticsTrackingNumber={details.logisticsTrackingNumber}
      />

      {/* 3. Tracking Lifecycle Stepper */}
      <TrackingLifecycleStepper steps={details.lifecycle} />

      {/* 4. Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transfer Items Table (8 cols) */}
        <div className="lg:col-span-8">
          <TransferItemsTable
            items={details.items}
            totalExpectedUnits={details.totalExpectedUnits}
          />
        </div>

        {/* Right Column: Actions Sidebar & Audit Trail (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <VerificationActionsSidebar
            onScanToVerify={handleScanToVerify}
            onUploadPackingSlip={handleUploadPackingSlip}
            onReportDiscrepancy={handleReportDiscrepancy}
          />

          <TransferAuditTrail
            logs={details.auditLogs}
            onViewFullHistory={handleViewFullHistory}
          />
        </div>
      </div>
    </main>
  );
}
