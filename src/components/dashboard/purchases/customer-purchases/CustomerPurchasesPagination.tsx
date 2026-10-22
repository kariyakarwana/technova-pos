"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerPurchasesPaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export default function CustomerPurchasesPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: CustomerPurchasesPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 text-xs text-[var(--brand-muted-font)]">
      {/* Rows per page selector */}
      <div className="flex items-center gap-2">
        <span>Row Per Page</span>
        <Select
          value={String(rowsPerPage)}
          onValueChange={(v) => onRowsPerPageChange(Number(v))}
        >
          <SelectTrigger className="h-8 data-[size=default]:h-8 w-16 rounded-lg border border-[var(--brand-stroke)] bg-white px-2.5 text-xs text-[var(--brand-black-font)] shadow-xs focus-visible:border-[var(--brand-green)] focus-visible:ring-0 cursor-pointer">
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
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {[1, 2, 3, 4].map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={[
              "h-8 w-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
              currentPage === page
                ? "bg-[var(--brand-green)] text-white"
                : "border border-[var(--brand-stroke)] bg-white text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {page}
          </button>
        ))}

        <span className="px-1 text-slate-400 font-bold">...</span>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          className={[
            "h-8 w-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
            currentPage === totalPages
              ? "bg-[var(--brand-green)] text-white"
              : "border border-[var(--brand-stroke)] bg-white text-slate-600 hover:bg-slate-50",
            ].join(" ")}
        >
          {totalPages}
        </button>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
