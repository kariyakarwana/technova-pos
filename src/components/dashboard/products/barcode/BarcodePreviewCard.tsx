"use client";

import { Printer, RefreshCw } from "lucide-react";
import type { BarcodeProductItem } from "./BarcodeMock";

interface BarcodePreviewCardProps {
  products: BarcodeProductItem[];
  quantities: Record<string, number>;
  onReset?: () => void;
  onPrint?: () => void;
}

export default function BarcodePreviewCard({
  products,
  onReset,
  onPrint,
}: BarcodePreviewCardProps) {
  return (
    <div className="space-y-6">
      {/* Printable Sheet Preview */}
      <div className="p-6 bg-white border border-[var(--brand-stroke)] rounded-2xl shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
          Barcode Preview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1.5 bg-slate-50/50"
            >
              <span className="text-xs font-bold text-[var(--brand-black-font)] truncate max-w-full">
                {item.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {item.sku}
              </span>

              {/* Barcode SVG */}
              <svg
                className="w-32 h-8 my-1"
                viewBox="0 0 112 28"
                fill="currentColor"
              >
                <rect x="0" y="0" width="2" height="28" fill="#151C27" />
                <rect x="4" y="0" width="1" height="28" fill="#151C27" />
                <rect x="7" y="0" width="3" height="28" fill="#151C27" />
                <rect x="12" y="0" width="1" height="28" fill="#151C27" />
                <rect x="15" y="0" width="2" height="28" fill="#151C27" />
                <rect x="19" y="0" width="4" height="28" fill="#151C27" />
                <rect x="25" y="0" width="1" height="28" fill="#151C27" />
                <rect x="28" y="0" width="2" height="28" fill="#151C27" />
                <rect x="32" y="0" width="3" height="28" fill="#151C27" />
                <rect x="37" y="0" width="1" height="28" fill="#151C27" />
                <rect x="40" y="0" width="2" height="28" fill="#151C27" />
                <rect x="44" y="0" width="1" height="28" fill="#151C27" />
                <rect x="47" y="0" width="3" height="28" fill="#151C27" />
                <rect x="52" y="0" width="2" height="28" fill="#151C27" />
                <rect x="56" y="0" width="1" height="28" fill="#151C27" />
                <rect x="59" y="0" width="4" height="28" fill="#151C27" />
                <rect x="65" y="0" width="2" height="28" fill="#151C27" />
                <rect x="69" y="0" width="1" height="28" fill="#151C27" />
                <rect x="72" y="0" width="3" height="28" fill="#151C27" />
                <rect x="77" y="0" width="2" height="28" fill="#151C27" />
                <rect x="81" y="0" width="1" height="28" fill="#151C27" />
                <rect x="84" y="0" width="2" height="28" fill="#151C27" />
                <rect x="88" y="0" width="3" height="28" fill="#151C27" />
                <rect x="93" y="0" width="1" height="28" fill="#151C27" />
                <rect x="96" y="0" width="2" height="28" fill="#151C27" />
                <rect x="100" y="0" width="4" height="28" fill="#151C27" />
                <rect x="106" y="0" width="1" height="28" fill="#151C27" />
                <rect x="109" y="0" width="2" height="28" fill="#151C27" />
              </svg>

              <span className="text-[10px] font-mono text-slate-600 font-bold">
                {item.barcodeCode}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="h-10 px-5 rounded-xl bg-[#004532] hover:bg-[#003828] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          onClick={onPrint}
          className="h-10 px-6 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print Barcode</span>
        </button>
      </div>
    </div>
  );
}
