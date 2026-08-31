"use client";

import { AlertTriangle, QrCode, Upload } from "lucide-react";

interface VerificationActionsSidebarProps {
  onScanToVerify?: () => void;
  onUploadPackingSlip?: () => void;
  onReportDiscrepancy?: () => void;
}

export default function VerificationActionsSidebar({
  onScanToVerify,
  onUploadPackingSlip,
  onReportDiscrepancy,
}: VerificationActionsSidebarProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-4">
      <h2 className="text-base font-bold text-[var(--brand-black-font)]">
        Verification Actions
      </h2>

      <div className="space-y-2.5">
        {/* Scan to Verify */}
        <button
          type="button"
          onClick={onScanToVerify}
          className="w-full h-10 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <QrCode className="h-4 w-4" />
          <span>Scan to Verify</span>
        </button>

        {/* Upload Packing Slip */}
        <button
          type="button"
          onClick={onUploadPackingSlip}
          className="w-full h-10 rounded-xl border border-[var(--brand-green)] bg-white hover:bg-slate-50 text-[var(--brand-green)] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Packing Slip</span>
        </button>

        {/* Report Discrepancy */}
        <button
          type="button"
          onClick={onReportDiscrepancy}
          className="w-full h-10 rounded-xl bg-[#D32F2F] hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Report Discrepancy</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-400 text-center font-medium pt-1">
        Available during verification
      </p>
    </div>
  );
}
