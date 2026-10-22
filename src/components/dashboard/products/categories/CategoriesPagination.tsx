"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoriesPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function CategoriesPagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: CategoriesPaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-slate-500">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <span>Show</span>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger className="h-8 data-[size=default]:h-8 w-16 rounded-lg border border-[var(--brand-stroke)] bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-xs focus-visible:border-[var(--brand-green)] focus-visible:ring-0 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={4}
            className="w-16 min-w-[4rem] rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-0"
          >
            <SelectItem
              value="10"
              className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              10
            </SelectItem>
            <SelectItem
              value="20"
              className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              20
            </SelectItem>
            <SelectItem
              value="50"
              className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
            >
              50
            </SelectItem>
          </SelectContent>
        </Select>
        <span>entries</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={[
              "h-8 w-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer",
              currentPage === p
                ? "bg-[var(--brand-green)] text-white shadow-2xs"
                : "bg-white border border-[var(--brand-stroke)] text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {p}
          </button>
        ))}

        {totalPages > 4 && (
          <>
            <span className="px-1 text-slate-400">...</span>
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className={[
                "h-8 w-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer",
                currentPage === totalPages
                  ? "bg-[var(--brand-green)] text-white shadow-2xs"
                  : "bg-white border border-[var(--brand-stroke)] text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
