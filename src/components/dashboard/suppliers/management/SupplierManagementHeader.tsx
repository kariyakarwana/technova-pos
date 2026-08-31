"use client";

import Link from "next/link";
import { ChevronRight, ChevronUp, Download, FileSpreadsheet, FileText, Plus, RotateCcw } from "lucide-react";

interface SupplierManagementHeaderProps {
  onAddSupplier?: () => void;
  onExport?: () => void;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
  onRefresh?: () => void;
  onToggleCollapse?: () => void;
}

export default function SupplierManagementHeader({
  onAddSupplier,
  onExport,
  onExportPdf,
  onExportExcel,
  onRefresh,
  onToggleCollapse,
}: SupplierManagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Supplier Management
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--brand-muted-font)] font-medium">
          <Link
            href="/dashboard"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-[var(--brand-black-font)] font-semibold">
            Supplier Management
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* PDF Export */}
        <button
          type="button"
          onClick={onExportPdf}
          title="Export PDF"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-red-500 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <FileText className="h-4 w-4" />
        </button>

        {/* Excel Export */}
        <button
          type="button"
          onClick={onExportExcel}
          title="Export Excel"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-emerald-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4" />
        </button>

        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Collapse Chevron */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title="Collapse / Expand Filters"
          className="h-9 w-9 rounded-xl border border-[var(--brand-stroke)] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <ChevronUp className="h-4 w-4" />
        </button>

        {/* Add Supplier Button */}
        <button
          type="button"
          onClick={onAddSupplier}
          className="h-9 px-3.5 rounded-xl border border-[var(--brand-green)] bg-white hover:bg-[#E6F7F5] text-[var(--brand-green)] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Supplier</span>
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="h-9 px-4 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
