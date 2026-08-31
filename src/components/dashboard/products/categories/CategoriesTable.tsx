"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react";
import type { CategoryItem } from "./CategoriesMock";

interface CategoriesTableProps {
  categories: CategoryItem[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
}

export default function CategoriesTable({
  categories,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onDelete,
}: CategoriesTableProps) {
  const allSelected =
    categories.length > 0 && categories.every((c) => selectedIds.includes(c.id));
  const someSelected =
    categories.some((c) => selectedIds.includes(c.id)) && !allSelected;

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="accent-[var(--brand-green)] h-4 w-4 rounded cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-[var(--brand-green)]">
                  <span>Category</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                Category slug
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                Created On
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)]">
                Status
              </th>
              <th className="py-3.5 px-4 font-bold text-[var(--brand-black-font)] text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {categories.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <tr
                  key={item.id}
                  className={[
                    "hover:bg-slate-50/70 transition-colors",
                    isSelected ? "bg-emerald-50/30" : "",
                  ].join(" ")}
                >
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectRow(item.id, e.target.checked)}
                      className="accent-[var(--brand-green)] h-4 w-4 rounded cursor-pointer"
                    />
                  </td>

                  {/* Category Name & CID */}
                  <td className="py-4 px-4 font-bold text-[var(--brand-black-font)]">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[11px]">
                        {item.cid}
                      </span>
                      <span>{item.category}</span>
                    </div>
                  </td>

                  {/* Category Slug / Description */}
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    {item.description}
                  </td>

                  {/* Created By & Avatar */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full overflow-hidden relative shrink-0">
                        <Image
                          src={item.avatarImage}
                          alt={item.createdBy}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                      <span className="text-slate-700 font-medium">
                        {item.createdBy}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[var(--brand-green)]">
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 text-slate-400">
                      <Link
                        href={`/products/categories/${item.id}`}
                        title="View Category"
                        className="h-7 w-7 rounded-lg hover:text-[var(--brand-green)] hover:bg-slate-100 flex items-center justify-center transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/products/categories/${item.id}`}
                        title="Edit Category"
                        className="h-7 w-7 rounded-lg hover:text-[var(--brand-green)] hover:bg-slate-100 flex items-center justify-center transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        title="Delete Category"
                        className="h-7 w-7 rounded-lg hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
