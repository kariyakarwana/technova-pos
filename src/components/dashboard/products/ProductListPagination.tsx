"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductListPaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export default function ProductListPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: ProductListPaginationProps) {
  const safeTotal = Math.max(1, totalPages);
  const pages = Array.from(
    new Set([1, currentPage - 1, currentPage, currentPage + 1, safeTotal]),
  )
    .filter((page) => page >= 1 && page <= safeTotal)
    .sort((a, b) => a - b);
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 border-t border-[#E4E7EC] text-xs text-slate-500">
      {/* Rows per page selector */}
      <div className="flex items-center gap-2">
        <span>Row Per Page</span>
        <Select
          value={String(rowsPerPage)}
          onValueChange={(v) => onRowsPerPageChange(Number(v))}
        >
          <SelectTrigger className="h-7 data-[size=default]:h-7 w-16 rounded-md border border-[#E4E7EC] bg-white px-2 text-xs text-[#1D2939] shadow-xs focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer">
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
        <span>Entries</span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-7 w-7 rounded-md border border-[#E4E7EC] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {pages.map((page, index) => (
          <span key={page} className="contents">
            {index > 0 && page - pages[index - 1] > 1 && (
              <span className="px-1 font-bold text-slate-400">...</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className={[
                "h-7 w-7 rounded-md text-xs font-semibold transition-colors cursor-pointer",
                currentPage === page
                  ? "bg-[#0E9384] text-white"
                  : "border border-[#E4E7EC] bg-white text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {page}
            </button>
          </span>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(safeTotal, currentPage + 1))}
          disabled={currentPage >= safeTotal}
          className="h-7 w-7 rounded-md border border-[#E4E7EC] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
