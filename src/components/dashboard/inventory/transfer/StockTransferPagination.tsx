"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface StockTransferPaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export default function StockTransferPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: StockTransferPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 text-xs text-[var(--brand-muted-font)]">
      {/* Rows per page selector */}
      <div className="flex items-center gap-2">
        <span>Row Per Page</span>
        <div className="relative">
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="h-8 pl-2.5 pr-7 border border-[var(--brand-stroke)] rounded-lg bg-white text-xs text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer shadow-xs"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
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
