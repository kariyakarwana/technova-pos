"use client";

import Link from "next/link";
import {
  ChevronRight,
  ChevronUp,
  Download,
  FileSpreadsheet,
  FileText,
  PlusCircle,
  RotateCw,
} from "lucide-react";

interface ProductListHeaderProps {
  onRefresh?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onImport?: () => void;
}

export default function ProductListHeader({
  onRefresh,
  isCollapsed = false,
  onToggleCollapse,
  onImport,
}: ProductListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
      {/* Left: Title & Breadcrumbs */}
      <div>
        <h1 className="text-xl font-bold text-[#1D2939] tracking-tight">
          Products
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400 font-medium">
          <Link
            href="/dashboard"
            className="hover:text-[#0E9384] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-slate-500">Products</span>
        </div>
      </div>

      {/* Right Actions: Exact horizontal order from design */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* PDF Badge */}
        <button
          type="button"
          title="Export PDF"
          className="h-8 w-8 rounded-lg bg-[#D32F2F] hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <FileText className="h-4 w-4" />
        </button>

        {/* Excel Badge */}
        <button
          type="button"
          title="Export Excel"
          className="h-8 w-8 rounded-lg bg-[#0E9384] hover:bg-[#0B6E63] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4" />
        </button>

        {/* Refresh Icon Button */}
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh"
          className="h-8 w-8 rounded-lg border border-[#E4E7EC] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>

        {/* Collapse / Expand Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand Filters" : "Collapse Filters"}
          className="h-8 w-8 rounded-lg border border-[#E4E7EC] bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <ChevronUp
            className={[
              "h-4 w-4 transition-transform duration-200",
              isCollapsed ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        {/* + Add Product Button */}
        <Link
          href="/products/product-list/add-product"
          className="h-8 px-3.5 rounded-lg border border-[#0E9384] text-[#0E9384] bg-white hover:bg-[#EEFFFD] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Add Product</span>
        </Link>

        {/* ⬇ Import Product Button */}
        <button
          type="button"
          onClick={onImport}
          className="h-8 px-3.5 rounded-lg bg-[#0E9384] hover:bg-[#0B6E63] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Import Product</span>
        </button>
      </div>
    </div>
  );
}
