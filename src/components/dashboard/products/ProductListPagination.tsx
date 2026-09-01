"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

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
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 border-t border-[#E4E7EC] text-xs text-slate-500">
      {/* Rows per page selector */}
      <div className="flex items-center gap-2">
        <span>Row Per Page</span>
        <div className="relative">
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="h-7 pl-2 pr-6 border border-[#E4E7EC] rounded-md bg-white text-xs text-[#1D2939] appearance-none focus:outline-none focus:border-[#0E9384] cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>
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

        {[1, 2, 3].map((page) => (
          <button
            key={page}
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
        ))}

        {totalPages > 4 && (
          <>
            <span className="px-1 text-slate-400 font-bold">...</span>
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className={[
                "h-7 w-7 rounded-md text-xs font-semibold transition-colors cursor-pointer",
                currentPage === totalPages
                  ? "bg-[#0E9384] text-white"
                  : "border border-[#E4E7EC] bg-white text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-7 w-7 rounded-md border border-[#E4E7EC] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
