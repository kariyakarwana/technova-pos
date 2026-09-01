"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

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
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 pl-2.5 pr-7 bg-white border border-[var(--brand-stroke)] rounded-lg text-slate-700 font-semibold appearance-none focus:outline-none cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>
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
