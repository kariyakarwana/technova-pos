"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { SupplierManagementItem } from "./SupplierManagementMock";

interface SupplierManagementTableProps {
  items: SupplierManagementItem[];
  onView?: (item: SupplierManagementItem) => void;
  onEdit?: (item: SupplierManagementItem) => void;
  onDelete?: (item: SupplierManagementItem) => void;
}

export default function SupplierManagementTable({
  items,
  onView,
  onEdit,
  onDelete,
}: SupplierManagementTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                ID
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                SUPPLIER NAME
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                CATEGORY
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                CONTACT PERSON
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                EMAIL
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)] text-center">
                STATUS
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)] text-center">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No suppliers found matching your filter criteria.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* ID */}
                  <td className="py-4 px-4 font-medium text-slate-600">
                    {item.id}
                  </td>

                  {/* Supplier Name */}
                  <td className="py-4 px-4 font-semibold text-[var(--brand-green)]">
                    <Link
                      href={`/suppliers/${item.id}`}
                      className="hover:underline"
                    >
                      {item.supplierName}
                    </Link>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 font-medium text-slate-700">
                    {item.category}
                  </td>

                  {/* Contact Person */}
                  <td className="py-4 px-4 font-medium text-slate-700">
                    {item.contactPerson}
                  </td>

                  {/* Email */}
                  <td className="py-4 px-4 font-medium text-slate-500">
                    {item.email}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 text-center">
                    {item.status === "Active" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#16A34A] text-white">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#991B1B] text-white">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1.5 text-slate-400">
                      <button
                        type="button"
                        onClick={() => onView?.(item)}
                        title="View details"
                        className="h-7 w-7 rounded-lg border border-[var(--brand-stroke)] hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit?.(item)}
                        title="Edit supplier"
                        className="h-7 w-7 rounded-lg border border-[var(--brand-stroke)] hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(item)}
                        title="Delete supplier"
                        className="h-7 w-7 rounded-lg border border-[var(--brand-stroke)] hover:border-red-500 hover:text-red-500 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
