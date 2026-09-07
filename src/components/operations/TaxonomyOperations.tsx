"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, FileUp, Pencil, RefreshCw } from "lucide-react";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import PaginationControls, { type PageMeta } from "./PaginationControls";

type TaxonomyItem = { id: string; name: string; description: string | null; status: "ACTIVE" | "INACTIVE"; parent?: { id: string; name: string } | null; _count: { products: number; children?: number } };
function parseCsvLine(line: string) { const cells: string[] = []; let value = "", quoted = false; for (let index = 0; index < line.length; index += 1) { const char = line[index]; if (char === '"' && quoted && line[index + 1] === '"') { value += '"'; index += 1; } else if (char === '"') quoted = !quoted; else if (char === "," && !quoted) { cells.push(value.trim()); value = ""; } else value += char; } cells.push(value.trim()); return cells; }

export default function TaxonomyOperations({ kind }: { kind: "categories" | "brands" }) {
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<TaxonomyItem | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const label = kind === "categories" ? "Category" : "Brand";
  const load = useCallback(async () => { try { setItems(await apiGet<TaxonomyItem[]>(`/catalog/${kind}`)); } catch (error) { setMessage(error instanceof Error ? error.message : `Unable to load ${kind}.`); } }, [kind]);
  useEffect(() => { void load(); }, [load]);
  const visible = useMemo(() => items.filter((item) => `${item.name} ${item.description ?? ""}`.toLowerCase().includes(search.toLowerCase())), [items, search]);
  const pageCount = Math.ceil(visible.length / pageSize);
  const rows = visible.slice((page - 1) * pageSize, page * pageSize);
  const meta: PageMeta = { page, pageSize, total: visible.length, pageCount };
  useEffect(() => setPage(1), [search, pageSize, kind]);
  function reset() { setEditing(null); setName(""); setDescription(""); setParentId(""); }
  function beginEdit(item: TaxonomyItem) { setEditing(item); setName(item.name); setDescription(item.description ?? ""); setParentId(item.parent?.id ?? ""); setMessage(null); }
  async function save(event: React.FormEvent) { event.preventDefault(); const payload = { name, description: description || undefined, ...(kind === "categories" ? { parentId: parentId || undefined } : {}) }; try { if (editing) await apiPatch(`/catalog/${kind}/${editing.id}`, payload); else await apiPost(`/catalog/${kind}`, payload); reset(); setMessage(`${label} saved.`); await load(); } catch (error) { setMessage(error instanceof Error ? error.message : `Unable to save ${label.toLowerCase()}.`); } }
  async function toggle(item: TaxonomyItem) { try { await apiPatch(`/catalog/${kind}/${item.id}`, { status: item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }); await load(); } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update status."); } }
  async function importCsv(file: File) {
    setImporting(true);
    try {
      const lines = (await file.text()).replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
      const headers = lines.length ? parseCsvLine(lines.shift()!).map((value) => value.toLowerCase()) : [];
      const nameIndex = headers.indexOf("name"), descriptionIndex = headers.indexOf("description"), parentIndex = headers.indexOf("parent");
      if (nameIndex < 0) throw new Error('CSV must contain a "name" column.');
      let imported = 0, skipped = 0;
      const known = new Map(items.map((item) => [item.name.toLowerCase(), item.id]));
      for (const line of lines) {
        const values = parseCsvLine(line);
        const rowName = values[nameIndex];
        if (!rowName) continue;
        try {
          const parentName = parentIndex >= 0 ? values[parentIndex] : "";
          const parent = parentName ? known.get(parentName.toLowerCase()) : undefined;
          if (kind === "categories" && parentName && !parent) throw new Error("Parent not found");
          const created = await apiPost<{ id: string }>(`/catalog/${kind}`, { name: rowName, description: descriptionIndex >= 0 ? values[descriptionIndex] || undefined : undefined, ...(kind === "categories" && parent ? { parentId: parent } : {}) });
          known.set(rowName.toLowerCase(), created.id); imported += 1;
        } catch { skipped += 1; }
      }
      await load();
      setMessage(`${imported} ${kind} imported${skipped ? `; ${skipped} skipped (duplicate or invalid).` : "."}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to import CSV."); }
    finally { setImporting(false); if (fileRef.current) fileRef.current.value = ""; }
  }
  function downloadTemplate() { const content = kind === "categories" ? "name,description,parent\nComputers,Desktop and laptop computers,\nLaptops,Portable computers,Computers\n" : "name,description\nLenovo,Computer manufacturer\nApple,Consumer electronics\n"; const url = URL.createObjectURL(new Blob([content], { type: "text/csv" })); const link = document.createElement("a"); link.href = url; link.download = `${kind}-import-template.csv`; link.click(); URL.revokeObjectURL(url); }

  return <main className="space-y-6 p-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">Product catalog</p><h1 className="text-2xl font-bold">{label} Management</h1><p className="text-sm text-slate-500">Maintain the classifications used by products, purchasing and reports.</p></div><div className="flex gap-2"><button type="button" onClick={downloadTemplate} className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs font-semibold"><Download className="h-4 w-4"/>CSV template</button><button type="button" disabled={importing} onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-[#0E9384] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"><FileUp className="h-4 w-4"/>{importing ? "Importing…" : `Import ${kind}`}</button><input ref={fileRef} hidden type="file" accept=".csv,text/csv" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importCsv(file); }}/></div></div>
    {message && <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">{message}</div>}
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={save} className="h-fit space-y-4 rounded-2xl border bg-white p-5 shadow-sm"><h2 className="font-bold">{editing ? `Edit ${label}` : `New ${label}`}</h2><label className="block text-xs font-semibold">Name<input required minLength={2} value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-10 w-full rounded-xl border px-3" /></label>{kind === "categories" && <label className="block text-xs font-semibold">Parent category<select value={parentId} onChange={(e) => setParentId(e.target.value)} className="mt-1 h-10 w-full rounded-xl border px-3"><option value="">None (top level)</option>{items.filter((item) => item.id !== editing?.id).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}<label className="block text-xs font-semibold">Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 min-h-24 w-full rounded-xl border p-3" /></label><div className="flex gap-2"><button className="rounded-xl bg-[#0E9384] px-4 py-2 font-semibold text-white">Save</button>{editing && <button type="button" onClick={reset} className="rounded-xl border px-4 py-2">Cancel</button>}</div></form>
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="flex items-center justify-between gap-3 border-b p-4"><div><h2 className="font-bold">All {kind}</h2><p className="text-xs text-slate-400">{visible.length} matching records</p></div><div className="flex gap-2"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="h-10 rounded-xl border px-3" /><button type="button" onClick={() => void load()} className="rounded-xl border px-3 text-[#0E9384]" aria-label="Refresh"><RefreshCw className="h-4 w-4"/></button></div></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Name</th><th className="p-4">Description</th>{kind === "categories" && <th className="p-4">Parent</th>}<th className="p-4">Products</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="border-t hover:bg-teal-50/30"><td className="p-4 font-semibold">{item.name}</td><td className="max-w-xs p-4 text-slate-500">{item.description || "—"}</td>{kind === "categories" && <td className="p-4">{item.parent?.name ?? "—"}</td>}<td className="p-4">{item._count.products}</td><td className="p-4"><span className={`rounded-full px-2 py-1 text-xs ${item.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{item.status}</span></td><td className="space-x-3 whitespace-nowrap p-4"><button type="button" onClick={() => beginEdit(item)} className="inline-flex items-center gap-1 font-semibold text-[#0E9384]"><Pencil className="h-3.5 w-3.5"/>Edit</button><button type="button" onClick={() => void toggle(item)} className="font-semibold text-slate-600">{item.status === "ACTIVE" ? "Deactivate" : "Activate"}</button></td></tr>)}</tbody></table></div>{!rows.length && <p className="p-8 text-center text-sm text-slate-500">No {kind} found.</p>}<PaginationControls meta={meta} onPageChange={setPage} onPageSizeChange={setPageSize}/></section>
    </div>
  </main>;
}
