"use client";

export type PageMeta = { page: number; pageSize: number; total: number; pageCount: number };

export default function PaginationControls({ meta, onPageChange, onPageSizeChange }: { meta: PageMeta; onPageChange: (page: number) => void; onPageSizeChange?: (size: number) => void }) {
  const first = meta.total ? (meta.page - 1) * meta.pageSize + 1 : 0;
  const last = Math.min(meta.page * meta.pageSize, meta.total);
  return <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-slate-600"><span>Showing {first}–{last} of {meta.total}</span><div className="flex items-center gap-2">{onPageSizeChange && <select aria-label="Rows per page" value={meta.pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))} className="rounded-lg border px-2 py-1.5"><option value={10}>10 rows</option><option value={20}>20 rows</option><option value={50}>50 rows</option></select>}<button type="button" disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-40">Previous</button><span>Page {meta.page} of {Math.max(1, meta.pageCount)}</span><button type="button" disabled={meta.page >= meta.pageCount} onClick={() => onPageChange(meta.page + 1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-40">Next</button></div></div>;
}
