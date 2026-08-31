"use client";

import { ChevronDown, Eye, Info, Pencil, Trash2 } from "lucide-react";
import type { CustomerItem } from "./CustomerManagementMock";

interface CustomerManagementTableProps {
  customers: CustomerItem[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onView?: (item: CustomerItem) => void;
  onEdit?: (item: CustomerItem) => void;
  onDelete?: (item: CustomerItem) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function CustomerManagementTable({
  customers,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onView,
  onEdit,
  onDelete,
  isCollapsed = false,
  onToggleCollapse,
}: CustomerManagementTableProps) {
  const isAllSelected =
    customers.length > 0 &&
    customers.every((c) => selectedIds.includes(c.customerId));

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      {/* Top Banner Header */}
      <div className="p-5 flex items-center justify-between border-b border-[var(--brand-stroke)] bg-white">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[var(--brand-green)]" />
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            Customer Management Information
          </h2>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          title="Toggle view"
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <ChevronDown
            className={[
              "h-5 w-5 transition-transform duration-200",
              isCollapsed ? "-rotate-90" : "rotate-0",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Table Area */}
      {!isCollapsed && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider">
                {/* Master Checkbox */}
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                    className="h-4 w-4 rounded border-[var(--brand-stroke)] text-[var(--brand-green)] focus:ring-[var(--brand-green)] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 font-semibold text-slate-600">
                  Customer Id
                </th>
                <th className="py-3 px-4 font-bold text-[var(--brand-black-font)]">
                  First Nme
                </th>
                <th className="py-3 px-4 font-semibold text-slate-600">
                  Last Name
                </th>
                <th className="py-3 px-4 font-semibold text-slate-600">
                  Phone
                </th>
                <th className="py-3 px-4 font-bold text-[var(--brand-black-font)]">
                  Email
                </th>
                <th className="py-3 px-4 font-bold text-[var(--brand-black-font)]">
                  Address
                </th>
                <th className="py-3 px-4 font-bold text-[var(--brand-black-font)]">
                  <span className="underline underline-offset-2">Created at</span>
                </th>
                <th className="py-3 px-4 font-bold text-[var(--brand-black-font)]">
                  <span className="underline underline-offset-2">Status</span>
                </th>
                <th className="py-3 px-4 font-bold text-[var(--brand-black-font)] text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No customer records found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const isSelected = selectedIds.includes(c.customerId);

                  return (
                    <tr
                      key={c.customerId}
                      className={[
                        "hover:bg-slate-50/70 transition-colors",
                        isSelected ? "bg-emerald-50/40" : "",
                      ].join(" ")}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelectOne(c.customerId)}
                          className="h-4 w-4 rounded border-[var(--brand-stroke)] text-[var(--brand-green)] focus:ring-[var(--brand-green)] cursor-pointer"
                        />
                      </td>

                      {/* Customer ID */}
                      <td className="py-3.5 px-4 font-medium text-slate-500">
                        {c.customerId}
                      </td>

                      {/* First Name */}
                      <td className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                        {c.firstName}
                      </td>

                      {/* Last Name */}
                      <td className="py-3.5 px-4 font-medium text-slate-500">
                        {c.lastName}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {c.phone}
                      </td>

                      {/* Email (Bold) */}
                      <td className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                        {c.email}
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                        {c.address}
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 font-bold text-[var(--brand-black-font)] underline underline-offset-2">
                        {c.createdAt}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 font-bold text-[var(--brand-black-font)] underline underline-offset-2">
                        {c.status}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5 text-slate-400">
                          <button
                            type="button"
                            onClick={() => onView?.(c)}
                            title="View customer"
                            className="h-7 w-7 rounded-lg border border-[var(--brand-stroke)] hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onEdit?.(c)}
                            title="Edit customer"
                            className="h-7 w-7 rounded-lg border border-[var(--brand-stroke)] hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete?.(c)}
                            title="Delete customer"
                            className="h-7 w-7 rounded-lg border border-[var(--brand-stroke)] hover:border-red-500 hover:text-red-500 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
