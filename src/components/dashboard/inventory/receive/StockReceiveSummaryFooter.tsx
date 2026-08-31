"use client";

interface StockReceiveSummaryFooterProps {
  totalItems: number;
  totalSkus: number;
  totalValue: number;
}

export default function StockReceiveSummaryFooter({
  totalItems,
  totalSkus,
  totalValue,
}: StockReceiveSummaryFooterProps) {
  return (
    <div className="bg-[#E6F7F5] border-t border-[#CBEFE8] rounded-b-2xl -mx-6 -mb-6 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
      {/* Left Item & SKU Count */}
      <div className="text-xs text-slate-700 font-medium">
        <span>Total Items: </span>
        <strong className="font-bold text-[#1D2939]">
          {totalItems} ({totalSkus} SKUs)
        </strong>
      </div>

      {/* Right Total Value Received */}
      <div className="text-xs text-slate-700 font-medium flex items-center gap-2">
        <span>Total Value Received:</span>
        <span className="text-base font-bold text-[#004532]">
          ${totalValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
}
