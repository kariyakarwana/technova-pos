"use client";

import { Search } from "lucide-react";
import type { BarcodeLabelSettings } from "./BarcodeTypes";

export default function BarcodeSettingsCard({
  branchName,
  search,
  onSearchChange,
  settings,
  onSettingsChange,
}: {
  branchName: string;
  search: string;
  onSearchChange(value: string): void;
  settings: BarcodeLabelSettings;
  onSettingsChange(value: BarcodeLabelSettings): void;
}) {
  const toggle = (key: Exclude<keyof BarcodeLabelSettings, "paperSize">) =>
    onSettingsChange({ ...settings, [key]: !settings[key] });

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
        <label className="text-xs font-semibold text-slate-700">
          Find a product
          <span className="relative mt-1.5 block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Name, SKU, or barcode"
              className="h-10 w-full rounded-xl border border-[var(--brand-stroke)] pl-9 pr-3 text-sm outline-none focus:border-[var(--brand-green)]"
            />
          </span>
        </label>
        <label className="text-xs font-semibold text-slate-700">
          Current branch
          <input
            value={branchName || "No active branch"}
            readOnly
            className="mt-1.5 h-10 w-full rounded-xl border border-[var(--brand-stroke)] bg-slate-50 px-3 text-sm text-slate-600"
          />
        </label>
        <label className="text-xs font-semibold text-slate-700">
          Label width
          <select
            value={settings.paperSize}
            onChange={(event) =>
              onSettingsChange({
                ...settings,
                paperSize: event.target.value as BarcodeLabelSettings["paperSize"],
              })
            }
            className="mt-1.5 h-10 w-full rounded-xl border border-[var(--brand-stroke)] bg-white px-3 text-sm outline-none focus:border-[var(--brand-green)]"
          >
            <option value="36mm">36 mm</option>
            <option value="50mm">50 mm</option>
            <option value="70mm">70 mm</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-4 border-t border-slate-100 pt-4">
        {(
          [
            ["showName", "Product name"],
            ["showSku", "SKU"],
            ["showPrice", "Selling price"],
            ["showValue", "Barcode text"],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="flex items-center gap-2 text-xs font-medium text-slate-600"
          >
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={() => toggle(key)}
              className="h-4 w-4 accent-[var(--brand-green)]"
            />
            {label}
          </label>
        ))}
      </div>
    </section>
  );
}
