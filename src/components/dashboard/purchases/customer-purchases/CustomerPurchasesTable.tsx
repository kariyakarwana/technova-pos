"use client";

import type { CustomerPurchaseItem } from "./CustomerPurchasesMock";

interface CustomerPurchasesTableProps {
  items: CustomerPurchaseItem[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
}

export default function CustomerPurchasesTable({
  items,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
}: CustomerPurchasesTableProps) {
  const isAllSelected =
    items.length > 0 && items.every((i) => selectedIds.includes(i.id));

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
            <th className="py-3.5 px-4 font-semibold text-slate-500">Sale Id</th>
            <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
              Branch
            </th>
            <th className="py-3.5 px-4 font-semibold text-slate-500">
              Customer Id
            </th>
            <th className="py-3.5 px-4 font-semibold text-slate-500">Cashier</th>
            <th className="py-3.5 px-4 font-semibold text-slate-500">
              <span className="underline underline-offset-2">Sale Date</span>
            </th>
            <th className="py-3.5 px-4 font-semibold text-slate-500">Subtotal</th>
            <th className="py-3.5 px-4 font-semibold text-slate-500">Discount</th>
            <th className="py-3.5 px-4 font-semibold text-slate-500">Tax</th>
            <th className="py-3.5 px-4 font-semibold text-slate-500">
              <span className="underline underline-offset-2">Total Amount</span>
            </th>
            <th className="py-3.5 px-4 font-semibold text-slate-500">
              <span className="underline underline-offset-2">Created at</span>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
          {items.length === 0 ? (
            <tr>
              <td colSpan={11} className="py-12 text-center text-slate-400">
                No customer purchase records found matching your filters.
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

                  {/* Sale Id */}
                  <td className="py-4 px-4 font-medium text-slate-500">
                    {item.saleId}
                  </td>

                  {/* Branch */}
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)]">
                    {item.branch}
                  </td>

                  {/* Customer Id */}
                  <td className="py-4 px-4 font-medium text-slate-600">
                    {item.customerId}
                  </td>

                  {/* Cashier */}
                  <td className="py-4 px-4 font-medium text-slate-600">
                    {item.cashier}
                  </td>

                  {/* Sale Date */}
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)] underline underline-offset-2">
                    {item.saleDate}
                  </td>

                  {/* Subtotal */}
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)]">
                    {item.subtotal}
                  </td>

                  {/* Discount */}
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)]">
                    {item.discount}
                  </td>

                  {/* Tax */}
                  <td className="py-4 px-4 font-medium text-slate-600">
                    {item.tax}
                  </td>

                  {/* Total Amount */}
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)] underline underline-offset-2">
                    {item.totalAmount}
                  </td>

                  {/* Created at */}
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)] underline underline-offset-2">
                    {item.createdAt}
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
