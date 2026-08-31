"use client";

import { Edit3, Check, Filter, Plus, Truck } from "lucide-react";
import type { AuditLogEntry } from "./TransferDetailsMock";

interface TransferAuditTrailProps {
  logs: AuditLogEntry[];
  onViewFullHistory?: () => void;
}

export default function TransferAuditTrail({
  logs,
  onViewFullHistory,
}: TransferAuditTrailProps) {
  function getLogIcon(type: AuditLogEntry["type"]) {
    switch (type) {
      case "dispatched":
        return <Truck className="h-3.5 w-3.5" />;
      case "approved":
        return <Check className="h-3.5 w-3.5 stroke-[3]" />;
      case "updated":
        return <Edit3 className="h-3.5 w-3.5" />;
      case "created":
      default:
        return <Plus className="h-3.5 w-3.5 stroke-[3]" />;
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Audit Trail
        </h2>
        <button
          type="button"
          title="Filter logs"
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {logs.map((log) => (
          <div key={log.id} className="relative">
            {/* Timeline Icon Node */}
            <div className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-[#004532] text-white flex items-center justify-center text-[10px] shadow-xs">
              {getLogIcon(log.type)}
            </div>

            {/* Log Details */}
            <div>
              <p className="text-xs font-bold text-[var(--brand-black-font)]">
                {log.title}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                {log.description}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                {log.timestamp} • {log.author}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <button
        type="button"
        onClick={onViewFullHistory}
        className="w-full h-9 rounded-xl bg-[#E6F7F5] hover:bg-[#D2F2EC] text-[var(--brand-green)] text-xs font-bold flex items-center justify-center transition-colors shadow-xs cursor-pointer"
      >
        View Full History
      </button>
    </div>
  );
}
