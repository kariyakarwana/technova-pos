"use client";

import { ScanBarcode, Search } from "lucide-react";

interface StockReceiveScanBarProps {
  scanInput: string;
  onScanInputChange: (val: string) => void;
  onSearchSubmit: () => void;
}

export default function StockReceiveScanBar({
  scanInput,
  onScanInputChange,
  onSearchSubmit,
}: StockReceiveScanBarProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      {/* Scanner Input with dark accent outline */}
      <div className="relative flex-1">
        <div className="flex items-center h-12 w-full rounded-xl border-2 border-[#004532] bg-white px-3.5 shadow-xs transition-colors focus-within:border-[#0E9384] focus-within:ring-2 focus-within:ring-[#0E9384]/15">
          <ScanBarcode className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Scan Barcode or Enter SKU..."
            value={scanInput}
            onChange={(e) => onScanInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchSubmit();
              }
            }}
            className="w-full text-xs sm:text-sm font-medium text-[#1D2939] placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* Search Square Button */}
      <button
        type="button"
        onClick={onSearchSubmit}
        title="Search item"
        className="h-12 w-12 rounded-xl border border-[#E4E7EC] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}
