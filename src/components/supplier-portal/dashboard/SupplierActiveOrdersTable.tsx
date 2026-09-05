/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  Filter,
  MoreVertical,
  Search,
} from "lucide-react";
import type { SupplierPurchaseOrder } from "./supplier-portal.mock";

interface SupplierActiveOrdersTableProps {
  orders: SupplierPurchaseOrder[];
  onFilterToggle?: () => void;
}

export default function SupplierActiveOrdersTable({
  orders,
  onFilterToggle,
}: SupplierActiveOrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // ── Column Definitions ──────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<SupplierPurchaseOrder>[]>(
    () => [
      {
        accessorKey: "poNumber",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-[var(--brand-green)] transition-colors cursor-pointer"
          >
            <span>PO Number</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3 w-3 text-[var(--brand-green)]" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3 w-3 text-[var(--brand-green)]" />
            ) : (
              <ArrowUpDown className="h-3 w-3 text-slate-400 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <Link
            href={`/supplier-dashboard/orders/${row.original.id}`}
            className="font-bold text-[var(--brand-green)] hover:underline"
          >
            {row.original.poNumber}
          </Link>
        ),
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-[var(--brand-green)] transition-colors cursor-pointer"
          >
            <span>Date</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3 w-3 text-[var(--brand-green)]" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3 w-3 text-[var(--brand-green)]" />
            ) : (
              <ArrowUpDown className="h-3 w-3 text-slate-400 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-medium text-slate-600">
            {row.original.date}
          </span>
        ),
      },
      {
        accessorKey: "totalAmount",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-[var(--brand-green)] transition-colors cursor-pointer"
          >
            <span>Total Amount</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3 w-3 text-[var(--brand-green)]" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3 w-3 text-[var(--brand-green)]" />
            ) : (
              <ArrowUpDown className="h-3 w-3 text-slate-400 opacity-60" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-bold text-[var(--brand-black-font)]">
            {row.original.totalAmount}
          </span>
        ),
      },
      {
        accessorKey: "deliveryStatus",
        header: () => <span className="font-bold text-slate-600">Delivery Status</span>,
        cell: ({ row }) => {
          const status = row.original.deliveryStatus;
          let bgClasses = "bg-amber-100 text-amber-800";
          if (status === "Dispatched") {
            bgClasses = "bg-[#092C4C] text-white";
          } else if (["Received", "Accepted"].includes(status)) {
            bgClasses = "bg-emerald-100 text-emerald-800";
          } else if (status === "Rejected") {
            bgClasses = "bg-rose-100 text-rose-800";
          } else if (status === "Changes proposed") {
            bgClasses = "bg-blue-100 text-blue-800";
          }

          return (
            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${bgClasses}`}>{status}</span>
          );
        },
      },
      {
        id: "actions",
        header: () => (
          <span className="font-bold text-slate-600 text-right block">
            Actions
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5 text-slate-400">
            <Link
              href={`/supplier-dashboard/orders/${row.original.id}`}
              title="View Details"
              className="h-7 w-7 rounded-lg hover:text-[var(--brand-green)] hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              title="More Options"
              className="h-7 w-7 rounded-lg hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // ── TanStack Table Instance ─────────────────────────────────────────────
  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageCount = table.getPageCount();
  const currentPageIndex = table.getState().pagination.pageIndex;
  const pages = Array.from({ length: Math.min(pageCount, 4) }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      {/* Header with Search & Filter */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--brand-stroke)]">
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Active Purchase Orders
        </h2>

        <div className="flex items-center gap-2">
          {/* Search Box with Global Filter */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter transfers..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-[var(--brand-stroke)] rounded-lg text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)]"
            />
          </div>

          {/* Filter Button */}
          <button
            type="button"
            onClick={onFilterToggle}
            title="Toggle filters"
            className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] hover:bg-slate-50 text-[var(--brand-green)] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider"
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-3.5 px-6 font-bold text-slate-600">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-4 px-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-slate-400 font-medium"
                >
                  No active purchase orders found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Strip */}
      <div className="p-4 border-t border-[var(--brand-stroke)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 bg-[#FAFAFC]">
        {/* Row Per Page */}
        <div className="flex items-center gap-2">
          <span>Row Per Page</span>
          <div className="relative">
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-8 pl-2.5 pr-7 bg-white border border-[var(--brand-stroke)] rounded-lg text-slate-700 font-semibold appearance-none focus:outline-none cursor-pointer"
            >
              {[10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>
          <span>Entries</span>
        </div>

        {/* Numbered Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            className="h-7 w-7 rounded-lg border border-transparent hover:bg-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          {pages.map((p) => {
            const isSelected = currentPageIndex + 1 === p;

            return (
              <button
                key={p}
                type="button"
                onClick={() => table.setPageIndex(p - 1)}
                className={[
                  "h-7 w-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer",
                  isSelected
                    ? "bg-[var(--brand-green)] text-white shadow-2xs"
                    : "bg-white border border-[var(--brand-stroke)] text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {p}
              </button>
            );
          })}

          {pageCount > 4 && (
            <>
              <span className="px-1 text-slate-400">...</span>
              <button
                type="button"
                onClick={() => table.setPageIndex(pageCount - 1)}
                className={[
                  "h-7 w-7 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer",
                  currentPageIndex === pageCount - 1
                    ? "bg-[var(--brand-green)] text-white shadow-2xs"
                    : "bg-white border border-[var(--brand-stroke)] text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {pageCount}
              </button>
            </>
          )}

          <button
            type="button"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            className="h-7 w-7 rounded-lg border border-transparent hover:bg-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
