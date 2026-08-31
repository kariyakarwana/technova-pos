"use client";

import { QrCode } from "lucide-react";

export interface ReceivedItem {
  id: string;
  name: string;
  sku: string;
  receivedQty: number;
  unitPrice: number;
  expiryDate: string;
}

interface StockReceiveTableProps {
  items: ReceivedItem[];
  onQtyChange: (id: string, qty: number) => void;
  onUnitPriceChange: (id: string, price: number) => void;
  onExpiryChange: (id: string, expiry: string) => void;
}

export default function StockReceiveTable({
  items,
  onQtyChange,
  onUnitPriceChange,
  onExpiryChange,
}: StockReceiveTableProps) {
  return (
    <div className="w-full pt-4">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-700 text-xs font-semibold border-y border-[#E4E7EC]">
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4">Product Name</th>
              <th className="py-3.5 px-4">SKU/Barcode</th>
              <th className="py-3.5 px-4 text-center w-28">Received Qty</th>
              <th className="py-3.5 px-4 text-center w-36">Unit Price</th>
              <th className="py-3.5 px-4 text-right">Total</th>
              <th className="py-3.5 px-4 text-center w-36">Expiry (Opt)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E4E7EC] text-xs text-[#1D2939]">
            {items.map((item, index) => {
              const rowTotal = item.receivedQty * item.unitPrice;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {/* Row Number (Teal) */}
                  <td className="py-4 px-4 text-center font-bold text-[#0E9384]">
                    {index + 1}
                  </td>

                  {/* Product Name */}
                  <td className="py-4 px-4 font-bold text-[#1D2939]">
                    {item.name}
                  </td>

                  {/* SKU/Barcode (Teal) */}
                  <td className="py-4 px-4 font-semibold text-[#0E9384]">
                    {item.sku}
                  </td>

                  {/* Received Qty (Input Box) */}
                  <td className="py-4 px-4 text-center">
                    <input
                      type="number"
                      min={1}
                      value={item.receivedQty}
                      onChange={(e) =>
                        onQtyChange(item.id, Math.max(0, Number(e.target.value)))
                      }
                      className="w-16 h-9 text-center text-xs font-bold text-[#1D2939] border border-[#E4E7EC] rounded-lg bg-white focus:outline-none focus:border-[#0E9384] focus:ring-1 focus:ring-[#0E9384]/20 shadow-xs"
                    />
                  </td>

                  {/* Unit Price (Input Box) */}
                  <td className="py-4 px-4 text-center">
                    <div className="relative inline-block w-28">
                      <input
                        type="text"
                        value={`$${item.unitPrice.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                        onChange={(e) => {
                          const cleanVal = e.target.value.replace(/[^0-9.]/g, "");
                          onUnitPriceChange(item.id, Number(cleanVal) || 0);
                        }}
                        className="w-full h-9 text-center text-xs font-medium text-[#1D2939] border border-[#E4E7EC] rounded-lg bg-white focus:outline-none focus:border-[#0E9384] focus:ring-1 focus:ring-[#0E9384]/20 shadow-xs"
                      />
                    </div>
                  </td>

                  {/* Total (Calculated) */}
                  <td className="py-4 px-4 text-right font-bold text-[#1D2939]">
                    ${rowTotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  {/* Expiry Date */}
                  <td className="py-4 px-4 text-center">
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      value={item.expiryDate}
                      onChange={(e) => onExpiryChange(item.id, e.target.value)}
                      className="w-28 h-9 text-center text-xs font-medium text-[#0E9384] placeholder:text-[#0E9384]/70 border-none bg-transparent focus:outline-none focus:ring-0"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty / Scan Helper Prompt */}
      <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
        <div className="h-10 w-10 text-[#0E9384] flex items-center justify-center opacity-80">
          <QrCode className="h-8 w-8" />
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Scan more items or search to add them to the receipt.
        </p>
      </div>
    </div>
  );
}
