"use client";

import Link from "next/link";
import { Filter, MoreVertical } from "lucide-react";
import type { ReturnRequestItem, ReturnStatus } from "./ReturnsManagementMock";

interface RecentReturnsTableCardProps {
  returns: ReturnRequestItem[];
  onFilterClick?: () => void;
  onMoreClick?: () => void;
  onViewAll?: () => void;
}

export default function RecentReturnsTableCard({
  returns,
  onFilterClick,
  onMoreClick,
  onViewAll,
}: RecentReturnsTableCardProps) {
  function getStatusBadge(status: ReturnStatus) {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded text-[11px] font-bold bg-[#092C4C] text-white">
            Pending
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded text-[11px] font-bold bg-[var(--brand-green)] text-white">
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded text-[11px] font-bold bg-[#DC2626] text-white">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-[var(--brand-stroke)]">
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Recent Return Requests
        </h2>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onFilterClick}
            title="Filter requests"
            className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] hover:bg-slate-50 text-[var(--brand-green)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onMoreClick}
            title="More actions"
            className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] hover:bg-slate-50 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider uppercase">
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                RETURN ID
              </th>
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                DATE
              </th>
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                CUSTOMER
              </th>
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                AMOUNT
              </th>
              <th className="py-3 px-5 font-bold text-[var(--brand-black-font)]">
                STATUS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {returns.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {/* Return ID */}
                <td className="py-3.5 px-5 font-semibold text-[var(--brand-green)]">
                  <Link
                    href={`/returns-refunds/${item.returnId.replace("#", "")}`}
                    className="hover:underline"
                  >
                    {item.returnId}
                  </Link>
                </td>

                {/* Date */}
                <td className="py-3.5 px-5 text-slate-500 font-medium">
                  {item.date}
                </td>

                {/* Customer */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                      {item.avatarInitials}
                    </div>
                    <span className="font-semibold text-[var(--brand-black-font)]">
                      {item.customerName}
                    </span>
                  </div>
                </td>

                {/* Amount */}
                <td className="py-3.5 px-5 font-bold text-[var(--brand-black-font)]">
                  {item.amount}
                </td>

                {/* Status */}
                <td className="py-3.5 px-5">
                  {getStatusBadge(item.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Banner */}
      <Link
        href="/returns-refunds/history"
        onClick={onViewAll}
        className="py-3.5 bg-[#F0FDF9] hover:bg-[#E6F7F5] border-t border-[var(--brand-stroke)] text-[var(--brand-green)] text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
      >
        View All Requests
      </Link>
    </div>
  );
}
