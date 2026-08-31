"use client";

import { useState } from "react";
import { ChevronDown, Link2 } from "lucide-react";

interface ReceiptDetailsCardProps {
  onConfirm?: () => void;
}

export default function ReceiptDetailsCard({ onConfirm }: ReceiptDetailsCardProps) {
  const [supplier, setSupplier] = useState("GlobalTech Solutions");
  const [purchaseOrder, setPurchaseOrder] = useState("PO-2023-089");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [destinationWarehouse, setDestinationWarehouse] = useState(
    "Main Warehouse (New York)"
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-xs">
      <h2 className="text-base font-bold text-[#1D2939] mb-5">
        Receipt Details
      </h2>

      {/* Row 1: 3-column input grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Supplier */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1D2939]">
            Supplier
          </label>
          <div className="relative">
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full h-10 pl-3 pr-8 text-xs bg-white border border-[#E4E7EC] rounded-xl text-[#1D2939] appearance-none focus:outline-none focus:border-[#0E9384] focus:ring-1 focus:ring-[#0E9384]/20 cursor-pointer shadow-xs font-medium"
            >
              <option value="GlobalTech Solutions">Select Supplier</option>
              <option value="GlobalTech Solutions">GlobalTech Solutions</option>
              <option value="Nexus Supplies Ltd">Nexus Supplies Ltd</option>
              <option value="Prime Distributors">Prime Distributors</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium pt-0.5">
            <span>ID: SUP-1001</span>
            <span>contact@globaltech.com</span>
          </div>
        </div>

        {/* Purchase Order */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1D2939]">
            Purchase Order
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. PO-2023-089"
              value={purchaseOrder}
              onChange={(e) => setPurchaseOrder(e.target.value)}
              className="w-full h-10 pl-3 pr-9 text-xs bg-white border border-[#E4E7EC] rounded-xl text-[#1D2939] placeholder:text-slate-400 focus:outline-none focus:border-[#0E9384] focus:ring-1 focus:ring-[#0E9384]/20 shadow-xs font-medium"
            />
            <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Invoice Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1D2939]">
            Invoice Number
          </label>
          <input
            type="text"
            placeholder="Enter invoice #"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full h-10 px-3 text-xs bg-white border border-[#E4E7EC] rounded-xl text-[#1D2939] placeholder:text-slate-400 focus:outline-none focus:border-[#0E9384] focus:ring-1 focus:ring-[#0E9384]/20 shadow-xs font-medium"
          />
        </div>
      </div>

      {/* Row 2: Destination Warehouse & Confirm Button */}
      <div className="mt-5 pt-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5 flex-1 max-w-md">
          <label className="text-xs font-semibold text-[#1D2939]">
            Destination Branch/Warehouse
          </label>
          <div className="relative">
            <select
              value={destinationWarehouse}
              onChange={(e) => setDestinationWarehouse(e.target.value)}
              className="w-full h-10 pl-3 pr-8 text-xs bg-white border border-[#E4E7EC] rounded-xl text-[#1D2939] appearance-none focus:outline-none focus:border-[#0E9384] focus:ring-1 focus:ring-[#0E9384]/20 cursor-pointer shadow-xs font-medium"
            >
              <option value="Main Warehouse (New York)">
                Main Warehouse (New York)
              </option>
              <option value="Downtown Flagship">Downtown Flagship</option>
              <option value="Westside Distribution Center">
                Westside Distribution Center
              </option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="h-10 px-6 rounded-xl bg-[#0E9384] hover:bg-[#0B6E63] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-stretch sm:self-auto flex items-center justify-center"
        >
          Confirm Stock
        </button>
      </div>
    </div>
  );
}
