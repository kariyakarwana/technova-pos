"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import type {
  SupplierPurchaseOrderItem,
  SupplierPOStatus,
} from "./SupplierPurchaseOrdersMock";

interface SupplierPurchaseOrdersTableProps {
  orders: SupplierPurchaseOrderItem[];
}

export default function SupplierPurchaseOrdersTable({
  orders,
}: SupplierPurchaseOrdersTableProps) {
  function getStatusBadge(status: SupplierPOStatus) {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-800">
            Pending
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            Approved
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Completed
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Draft
          </span>
        );
      case "Sent":
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            Sent
          </span>
        );
      case "Received":
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
            Received
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] text-slate-500 text-[11px] font-bold border-b border-[var(--brand-stroke)] tracking-wider">
              <th className="py-3.5 px-6 font-bold text-[var(--brand-black-font)]">
                PO Number
              </th>
              <th className="py-3.5 px-6 font-bold text-[var(--brand-black-font)]">
                Supplier
              </th>
              <th className="py-3.5 px-6 font-bold text-[var(--brand-black-font)]">
                Date
              </th>
              <th className="py-3.5 px-6 font-bold text-[var(--brand-black-font)]">
                Total Amount
              </th>
              <th className="py-3.5 px-6 font-bold text-[var(--brand-black-font)]">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--brand-stroke)] text-xs text-[var(--brand-black-font)]">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  No purchase orders found matching your filter criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* PO Number */}
                  <td className="py-4 px-6 font-semibold text-[var(--brand-green)]">
                    <Link
                      href={`/purchases/${order.poNumber.replace("#", "")}`}
                      className="hover:underline"
                    >
                      {order.poNumber}
                    </Link>
                  </td>

                  {/* Supplier */}
                  <td className="py-4 px-6 font-medium text-slate-700">
                    <div className="flex items-center gap-1.5">
                      {order.hasLogoBadge && (
                        <Sparkles className="h-3.5 w-3.5 text-[var(--brand-green)]" />
                      )}
                      <span>{order.supplier}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6 font-medium text-slate-500">
                    {order.date}
                  </td>

                  {/* Total Amount */}
                  <td className="py-4 px-6 font-bold text-[var(--brand-black-font)]">
                    {order.totalAmount}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {getStatusBadge(order.status)}
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
