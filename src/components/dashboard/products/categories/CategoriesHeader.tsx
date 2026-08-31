"use client";

import Link from "next/link";
import {
  ChevronRight,
  ChevronsUp,
  FileSpreadsheet,
  FileText,
  Plus,
  RefreshCw,
  Upload,
} from "lucide-react";

interface CategoriesHeaderProps {
  onRefresh?: () => void;
  onCollapseAll?: () => void;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
  onImport?: () => void;
}

export default function CategoriesHeader({
  onRefresh,
  onCollapseAll,
  onExportPdf,
  onExportExcel,
  onImport,
}: CategoriesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Category List
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--brand-muted-font)] font-medium">
          <Link
            href="/dashboard"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <Link
            href="/products/product-list"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Product
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-[var(--brand-black-font)] font-semibold">
            Category List
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onExportPdf}
          title="Export PDF"
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] flex items-center justify-center text-slate-500 hover:border-red-400 hover:text-red-500 transition-all cursor-pointer"
        >
          <FileText className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onExportExcel}
          title="Export Excel"
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] flex items-center justify-center text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-all cursor-pointer"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onImport}
          title="Import"
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] flex items-center justify-center text-slate-500 hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] transition-all cursor-pointer"
        >
          <Upload className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onRefresh}
          title="Refresh"
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] flex items-center justify-center text-slate-500 hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onCollapseAll}
          title="Collapse"
          className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] flex items-center justify-center text-slate-500 hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] transition-all cursor-pointer"
        >
          <ChevronsUp className="h-3.5 w-3.5" />
        </button>

        <Link
          href="/products/categories/create"
          className="flex items-center gap-1.5 h-8 px-3.5 rounded-xl bg-[var(--brand-green)] text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-2xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Category
        </Link>
      </div>
    </div>
  );
}
