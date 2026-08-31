"use client";

import {
  CheckCircle2,
  FileText,
  Hourglass,
  Inbox,
  Send,
  ThumbsUp,
} from "lucide-react";
import type { SupplierOrderStatusSummary } from "./SupplierPurchaseOrdersMock";

interface SupplierOrderStatusCardsProps {
  counts: SupplierOrderStatusSummary;
  selectedStatus?: string;
  onSelectStatus?: (status: string) => void;
}

export default function SupplierOrderStatusCards({
  counts,
  selectedStatus,
  onSelectStatus,
}: SupplierOrderStatusCardsProps) {
  const cards = [
    {
      key: "Draft",
      label: "Draft",
      count: counts.draft,
      icon: FileText,
      color: "text-slate-500",
      iconColor: "text-slate-400",
    },
    {
      key: "Pending",
      label: "Pending",
      count: counts.pending,
      icon: Hourglass,
      color: "text-amber-600",
      iconColor: "text-amber-500",
    },
    {
      key: "Approved",
      label: "Approved",
      count: counts.approved,
      icon: ThumbsUp,
      color: "text-blue-600",
      iconColor: "text-blue-500",
    },
    {
      key: "Sent",
      label: "Sent",
      count: counts.sent,
      icon: Send,
      color: "text-purple-600",
      iconColor: "text-purple-500",
    },
    {
      key: "Received",
      label: "Received",
      count: counts.received,
      icon: Inbox,
      color: "text-emerald-600",
      iconColor: "text-emerald-500",
    },
    {
      key: "Completed",
      label: "Completed",
      count: counts.completed,
      icon: CheckCircle2,
      color: "text-teal-600",
      iconColor: "text-teal-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.key;

        return (
          <div
            key={card.key}
            onClick={() => onSelectStatus?.(card.key)}
            className={[
              "bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between transition-all cursor-pointer hover:border-[var(--brand-green)]",
              isSelected
                ? "border-[var(--brand-green)] ring-2 ring-[var(--brand-green)]/15"
                : "border-[var(--brand-stroke)]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${card.color}`}>
                {card.label}
              </span>
              <Icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>

            <div className="mt-3">
              <h3 className="text-2xl font-bold text-[var(--brand-black-font)] tracking-tight">
                {card.count}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
