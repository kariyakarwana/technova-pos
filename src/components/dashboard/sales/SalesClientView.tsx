"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Printer,
} from "lucide-react";
import { salesReportMockData } from "./sales.mock";

type SortField = "sku" | "name" | "brand" | "category" | "soldQty" | "soldAmount" | "instockQty";
type SortOrder = "asc" | "desc";

export default function SalesClientView() {
  // ── Filter states ────────────────────────────────
  const [dateRange, setDateRange] = useState("01-Aug-2026 - 12-Dec-2026");
  const [selectedBranch, setSelectedBranch] = useState("Branch 1");
  const [selectedProductCategory, setSelectedProductCategory] = useState("All");

  // ── Sorting & pagination states ──────────────────
  const [sortField, setSortField] = useState<SortField>("sku");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(4);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  // Filtered & sorted data
  const filteredData = useMemo(() => {
    let list = [...salesReportMockData];

    if (selectedProductCategory !== "All") {
      list = list.filter(
        (item) => item.category.toLowerCase() === selectedProductCategory.toLowerCase()
      );
    }

    list.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      return sortOrder === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return list;
  }, [selectedProductCategory, sortField, sortOrder]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-6 bg-[#F8FAFC]">
      {/* ── Top Filter Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-6">
        {/* Choose Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#1D2939]">
            Choose Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-[#E4E7EC] rounded-lg text-[#1D2939] focus:outline-none focus:border-[#0E9384] shadow-xs"
            />
          </div>
        </div>

        {/* Branch */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#1D2939]">
            Branch
          </label>
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full h-10 pl-3 pr-8 text-xs bg-white border border-[#E4E7EC] rounded-lg text-[#1D2939] appearance-none focus:outline-none focus:border-[#0E9384] cursor-pointer shadow-xs"
            >
              <option>Branch 1</option>
              <option>Branch 2</option>
              <option>Branch 3</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Products */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#1D2939]">
            Products
          </label>
          <div className="relative">
            <select
              value={selectedProductCategory}
              onChange={(e) => setSelectedProductCategory(e.target.value)}
              className="w-full h-10 pl-3 pr-8 text-xs bg-white border border-[#E4E7EC] rounded-lg text-[#1D2939] appearance-none focus:outline-none focus:border-[#0E9384] cursor-pointer shadow-xs"
            >
              <option value="All">All</option>
              <option value="Computers">Computers</option>
              <option value="Electronics">Electronics</option>
              <option value="Shoe">Shoe</option>
              <option value="Furniture">Furniture</option>
              <option value="Bags">Bags</option>
              <option value="Phone">Phone</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Generate Report Button */}
        <div>
          <button
            type="button"
            className="w-full h-10 rounded-lg bg-[#0E9384] hover:bg-[#0B6E63] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* ── Sales Report Card ── */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs flex-1 flex flex-col justify-between">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
            <h2 className="text-base font-bold text-[#1D2939]">
              Sales Report
            </h2>

            {/* Export action icons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Export PDF"
                className="h-8 px-2.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileText className="h-4 w-4 text-red-600" />
                <span className="text-[10px]">PDF</span>
              </button>

              <button
                type="button"
                title="Export Excel"
                className="h-8 px-2.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px]">XLS</span>
              </button>

              <button
                type="button"
                title="Print Report"
                className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Printer className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB] text-slate-600 text-xs font-semibold border-b border-[#E4E7EC]">
                  <th
                    onClick={() => handleSort("sku")}
                    className="py-3 px-4 cursor-pointer hover:text-[#0E9384] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>SKU</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>

                  <th className="py-3 px-4">
                    Product Name
                  </th>

                  <th className="py-3 px-4">
                    Brand
                  </th>

                  <th className="py-3 px-4">
                    Category
                  </th>

                  <th
                    onClick={() => handleSort("soldQty")}
                    className="py-3 px-4 cursor-pointer hover:text-[#0E9384] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Sold Qty</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("soldAmount")}
                    className="py-3 px-4 cursor-pointer hover:text-[#0E9384] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Sold Amount</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("instockQty")}
                    className="py-3 px-4 cursor-pointer hover:text-[#0E9384] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Instock Qty</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E4E7EC] text-xs text-[#1D2939]">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {item.sku}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative h-7 w-7 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="28px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <span className="font-semibold text-[#1D2939] truncate">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {item.brand}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {item.category}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {item.soldQtyFormatted}
                    </td>

                    <td className="py-3 px-4 font-medium text-[#1D2939]">
                      {item.soldAmountFormatted}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {item.instockQtyFormatted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Pagination & Rows Per Page Footer ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2 border-t border-[#E4E7EC] text-xs text-slate-500">
          {/* Left: Row Per Page */}
          <div className="flex items-center gap-2">
            <span>Row Per Page</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
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

          {/* Right: Pagination */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 rounded-md border border-[#E4E7EC] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
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

            <button
              type="button"
              onClick={() => setCurrentPage(4)}
              className={[
                "h-7 w-7 rounded-md text-xs font-semibold transition-colors cursor-pointer",
                currentPage === 4
                  ? "bg-[#0E9384] text-white"
                  : "border border-[#E4E7EC] bg-white text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              4
            </button>

            <span className="px-1 text-slate-400 font-bold">...</span>

            <button
              type="button"
              onClick={() => setCurrentPage(15)}
              className={[
                "h-7 w-7 rounded-md text-xs font-semibold transition-colors cursor-pointer",
                currentPage === 15
                  ? "bg-[#0E9384] text-white"
                  : "border border-[#E4E7EC] bg-white text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              15
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(15, p + 1))}
              className="h-7 w-7 rounded-md border border-[#E4E7EC] bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Page Footer ── */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-6 px-1 mt-auto">
        <p>2026 © TechNova. All Right Reserved</p>
        <p>
          Designed &amp; Developed By{" "}
          <span className="text-slate-600 font-medium">ConnexInterns</span>
        </p>
      </footer>
    </div>
  );
}
