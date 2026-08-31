"use client";

import { History } from "lucide-react";
import type { AuditLogItem } from "./PurchaseDetailsMock";

interface PurchaseAuditLogSidebarProps {
  logs: AuditLogItem[];
}

export default function PurchaseAuditLogSidebar({
  logs,
}: PurchaseAuditLogSidebarProps) {
  function getDotColor(color: AuditLogItem["statusColor"]) {
    switch (color) {
      case "yellow":
        return "bg-amber-400";
      case "green":
        return "bg-[var(--brand-green)]";
      case "red":
        return "bg-red-500";
      case "gray":
      default:
        return "bg-slate-400";
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-[var(--brand-green)]" />
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Audit Log
        </h2>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-5 space-y-5 pt-1 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {logs.map((log) => (
          <div key={log.id} className="relative">
            {/* Status Dot */}
            <div
              className={[
                "absolute -left-5 top-1 h-3 w-3 rounded-full border-2 border-white shadow-xs",
                getDotColor(log.statusColor),
              ].join(" ")}
            />

            {/* Details */}
            <div>
              <p className="text-xs font-bold text-[var(--brand-black-font)]">
                {log.title}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {log.author}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {log.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
