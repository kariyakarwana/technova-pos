"use client";

import Link from "next/link";
import type { PurchaseOrderItem } from "./PurchaseOrderMock";

interface PurchaseOrderTableProps {
  items: PurchaseOrderItem[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
}

export default function PurchaseOrderTable({
  items,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
}: PurchaseOrderTableProps) {
  const isAllSelected =
    items.length > 0 && items.every((i) => selectedIds.includes(i.id));

  function renderStatus(status: PurchaseOrderItem["status"]) {
    switch (status) {
      case "Delivered":
      case "Approved":
        return (
          <span className="font-bold text-[#16A34A] text-xs">{status}</span>
        );
      case "Pending Approval":
        return (
          <span className="font-bold text-[#D97706] text-xs">{status}</span>
        );
      case "Cancelled":
        return (
          <span className="font-bold text-[#DC2626] text-xs">{status}</span>
        );
      case "In Transit":
        return (
          <span className="font-bold text-[#2563EB] text-xs">{status}</span>
        );
      case "Completed":
      default:
        return (
          <span className="font-bold text-slate-700 text-xs">{status}</span>
        );
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider">
            {/* Checkbox Column */}
            <th className="py-3.5 px-4 w-10">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onToggleSelectAll}
                className="h-4 w-4 rounded border-[var(--brand-stroke)] text-[var(--brand-green)] focus:ring-[var(--brand-green)] cursor-pointer"
              />
            </th>
            <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
              PhoneNo
            </th>
            <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
              Supllier
            </th>
            <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
              Date
            </th>
            <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
              <span className="underline underline-offset-2">Total Amount</span>
            </th>
            <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-slate-400">
                No purchase orders found matching your search.
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <tr
                  key={item.id}
                  className={[
                    "hover:bg-slate-50/70 transition-colors",
                    isSelected ? "bg-emerald-50/40" : "",
                  ].join(" ")}
                >
                  {/* Checkbox */}
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOne(item.id)}
                      className="h-4 w-4 rounded border-[var(--brand-stroke)] text-[var(--brand-green)] focus:ring-[var(--brand-green)] cursor-pointer"
                    />
                  </td>

                  {/* PO Number */}
                  <td className="py-4 px-4 font-semibold text-[var(--brand-green)]">
                    <Link
                      href={`/purchases/order-management/${encodeURIComponent(item.poNumber.replace("#", ""))}`}
                      className="hover:underline"
                    >
                      {item.poNumber}
                    </Link>
                  </td>

                  {/* Supplier */}
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)]">
                    {item.supplier}
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 font-medium text-slate-600">
                    {item.date}
                  </td>

                  {/* Total Amount */}
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)] underline underline-offset-2">
                    {item.totalAmount}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    {renderStatus(item.status)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
