"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PageMeta = {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

export default function PaginationControls({
  meta,
  onPageChange,
  onPageSizeChange,
}: {
  meta: PageMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}) {
  const first = meta.total ? (meta.page - 1) * meta.pageSize + 1 : 0;
  const last = Math.min(meta.page * meta.pageSize, meta.total);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-slate-600">
      <span>
        Showing {first}–{last} of {meta.total}
      </span>
      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <Select
            value={String(meta.pageSize)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger
              aria-label="Rows per page"
              className="h-8 data-[size=default]:h-8 w-24 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 shadow-xs focus-visible:border-[#0E9384] focus-visible:ring-0 cursor-pointer"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-24 min-w-[6rem] rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-0"
            >
              <SelectItem
                value="10"
                className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
              >
                10 rows
              </SelectItem>
              <SelectItem
                value="20"
                className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
              >
                20 rows
              </SelectItem>
              <SelectItem
                value="50"
                className="cursor-pointer text-xs text-slate-700 focus:bg-[#0e9f90]/10 focus:text-[#0c877a] data-[state=checked]:font-medium data-[state=checked]:text-[#0c877a] [&_svg]:text-[#0e9f90]"
              >
                50 rows
              </SelectItem>
            </SelectContent>
          </Select>
        )}
        <button
          type="button"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
        >
          Previous
        </button>
        <span>
          Page {meta.page} of {Math.max(1, meta.pageCount)}
        </span>
        <button
          type="button"
          disabled={meta.page >= meta.pageCount}
          onClick={() => onPageChange(meta.page + 1)}
          className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
