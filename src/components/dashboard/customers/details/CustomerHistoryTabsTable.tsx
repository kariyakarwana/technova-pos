"use client";

import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import type {
  PointHistoryItem,
  PurchaseHistoryItem,
} from "./CustomerDetailsMock";

interface CustomerHistoryTabsTableProps {
  activeTab: "purchase" | "points";
  onTabChange: (tab: "purchase" | "points") => void;
  purchaseHistory: PurchaseHistoryItem[];
  pointHistory: PointHistoryItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  dateRange: string;
  onDateRangeChange: (d: string) => void;
}

export default function CustomerHistoryTabsTable({
  activeTab,
  onTabChange,
  purchaseHistory,
  pointHistory,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
}: CustomerHistoryTabsTableProps) {
  function getStatusBadge(status: "Completed" | "Returned" | "Pending") {
    if (status === "Completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          <span>Completed</span>
        </span>
      );
    }
    if (status === "Returned") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
          <span>Returned</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      {/* Top Tabs */}
      <div className="flex items-center border-b border-[var(--brand-stroke)] px-6 pt-2">
        <button
          type="button"
          onClick={() => onTabChange("purchase")}
          className={[
            "py-3.5 px-4 text-xs font-bold transition-colors relative cursor-pointer",
            activeTab === "purchase"
              ? "text-[var(--brand-green)] border-b-2 border-[var(--brand-green)] -mb-px"
              : "text-slate-500 hover:text-slate-700",
          ].join(" ")}
        >
          Purchase History
        </button>

        <button
          type="button"
          onClick={() => onTabChange("points")}
          className={[
            "py-3.5 px-4 text-xs font-bold transition-colors relative cursor-pointer",
            activeTab === "points"
              ? "text-[var(--brand-green)] border-b-2 border-[var(--brand-green)] -mb-px"
              : "text-slate-500 hover:text-slate-700",
          ].join(" ")}
        >
          Point History
        </button>
      </div>

      {/* Filter Row */}
      <div className="p-4 bg-white border-b border-[var(--brand-stroke)] flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 pl-9 pr-3 text-xs bg-slate-50 border border-[var(--brand-stroke)] rounded-lg text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:bg-white transition-colors"
          />
        </div>

        {/* Date Filter */}
        <div className="relative shrink-0">
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="h-8 pl-3 pr-7 text-xs bg-slate-50 border border-[var(--brand-stroke)] rounded-lg text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] focus:bg-white cursor-pointer"
          >
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 60 Days">Last 60 Days</option>
            <option value="This Year">This Year</option>
            <option value="All Time">All Time</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider">
              <th className="py-3 px-6 font-bold text-[var(--brand-black-font)]">
                Order ID
              </th>
              <th className="py-3 px-6 font-bold text-[var(--brand-black-font)]">
                Date
              </th>
              {activeTab === "purchase" ? (
                <th className="py-3 px-6 font-bold text-[var(--brand-black-font)]">
                  Total Amount
                </th>
              ) : (
                <th className="py-3 px-6 font-bold text-[var(--brand-black-font)]">
                  Total Points
                </th>
              )}
              <th className="py-3 px-6 font-bold text-[var(--brand-black-font)]">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {activeTab === "purchase" ? (
              purchaseHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400">
                    No purchase records found.
                  </td>
                </tr>
              ) : (
                purchaseHistory.map((item) => (
                  <tr
                    key={item.orderId}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3.5 px-6 font-semibold text-[var(--brand-green)]">
                      <Link
                        href={`/purchases/${item.orderId.replace("#", "")}`}
                        className="hover:underline"
                      >
                        {item.orderId}
                      </Link>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 font-medium">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-[var(--brand-black-font)]">
                      {item.totalAmount}
                    </td>
                    <td className="py-3.5 px-6">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))
              )
            ) : pointHistory.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-slate-400">
                  No points activity found.
                </td>
              </tr>
            ) : (
              pointHistory.map((item) => (
                <tr
                  key={item.orderId}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-3.5 px-6 font-semibold text-[var(--brand-green)]">
                    <Link
                      href={`/purchases/${item.orderId.replace("#", "")}`}
                      className="hover:underline"
                    >
                      {item.orderId}
                    </Link>
                  </td>
                  <td className="py-3.5 px-6 text-slate-500 font-medium">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-[var(--brand-black-font)]">
                    <span
                      className={
                        item.totalPoints.startsWith("+")
                          ? "text-emerald-600 font-bold"
                          : "text-red-500 font-bold"
                      }
                    >
                      {item.totalPoints}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    {getStatusBadge(item.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
