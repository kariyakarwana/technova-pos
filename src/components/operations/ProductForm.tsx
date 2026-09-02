"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, PackagePlus, Plus, Trash2 } from "lucide-react";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";

type Lookup = { id: string; name: string };
export type EditableProduct = {
  id: string; sku: string; barcode: string | null; name: string; description: string | null;
  categoryId: string | null; brandId: string | null; costPrice: string | number;
  sellingPrice: string | number; taxRate: string | number; trackSerials: boolean;
  reorderLevel: string | number; images?: Array<{ id: string; url: string }>;
};

export default function ProductForm({ product }: { product?: EditableProduct }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Lookup[]>([]);
  const [brands, setBrands] = useState<Lookup[]>([]);
  const [imageUrls, setImageUrls] = useState(product?.images?.map((image) => image.url) ?? []);
  const [newImage, setNewImage] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    sku: product?.sku ?? "", barcode: product?.barcode ?? "", name: product?.name ?? "",
    description: product?.description ?? "", categoryId: product?.categoryId ?? "",
    brandId: product?.brandId ?? "", costPrice: Number(product?.costPrice ?? 0),
    sellingPrice: Number(product?.sellingPrice ?? 0), taxRate: Number(product?.taxRate ?? 0),
    trackSerials: product?.trackSerials ?? false, reorderLevel: Number(product?.reorderLevel ?? 0),
  });

  useEffect(() => {
    void Promise.all([apiGet<Lookup[]>("/catalog/categories"), apiGet<Lookup[]>("/catalog/brands")])
      .then(([categoryData, brandData]) => { setCategories(categoryData); setBrands(brandData); })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load catalog options."));
  }, []);

  function addImage() {
    const value = newImage.trim();
    try { new URL(value); } catch { setMessage("Enter a complete image URL beginning with http:// or https://."); return; }
    if (imageUrls.length >= 8) { setMessage("A product can contain up to eight images."); return; }
    setImageUrls((current) => [...current, value]); setNewImage(""); setMessage(null);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setMessage(null);
    const payload = { ...form, barcode: form.barcode || undefined, description: form.description || undefined, categoryId: form.categoryId || undefined, brandId: form.brandId || undefined, imageUrls };
    try {
      if (product) await apiPatch(`/catalog/products/${product.id}`, payload);
      else await apiPost("/catalog/products", payload);
      router.push("/products/product-list"); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save product."); }
    finally { setSaving(false); }
  }

  const input = "mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-[#0E9384] focus:ring-2 focus:ring-[#0E9384]/10";
  return <main className="min-h-screen bg-[#F8FAFC] p-6">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0E9384]">Products / {product ? "Update" : "Create"}</p><h1 className="mt-1 text-2xl font-bold text-slate-900">{product ? "Update Product" : "Create Product"}</h1><p className="text-sm text-slate-500">Maintain catalog, pricing, stock controls, images and serialized warranty tracking.</p></div><button type="button" onClick={() => router.back()} className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold">Back to products</button></div>
    {message && <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{message}</div>}
    <form onSubmit={save} className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b px-5 py-4"><span className="rounded-xl bg-teal-50 p-2 text-[#0E9384]"><PackagePlus className="h-5 w-5" /></span><div><h2 className="font-bold">Product information</h2><p className="text-xs text-slate-500">Identity and catalog classification</p></div></div><div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4"><label className="text-xs font-semibold">SKU *<input required disabled={Boolean(product)} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className={`${input} disabled:bg-slate-50`} /></label><label className="text-xs font-semibold">Barcode<input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} className={input} /></label><label className="text-xs font-semibold sm:col-span-2">Product name *<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} /></label><label className="text-xs font-semibold">Category<select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={input}><option value="">Uncategorized</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="text-xs font-semibold">Brand<select value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} className={input}><option value="">Unbranded</option>{brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="text-xs font-semibold sm:col-span-2">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-[#0E9384]" /></label></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b px-5 py-4"><h2 className="font-bold">Pricing & stock controls</h2><p className="text-xs text-slate-500">Values used by purchasing, POS and inventory alerts</p></div><div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4"><label className="text-xs font-semibold">Cost price *<input required type="number" min="0" step="0.01" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: Number(e.target.value) })} className={input} /></label><label className="text-xs font-semibold">Selling price *<input required type="number" min="0" step="0.01" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })} className={input} /></label><label className="text-xs font-semibold">Tax rate %<input type="number" min="0" step="0.0001" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })} className={input} /></label><label className="text-xs font-semibold">Reorder level<input type="number" min="0" step="0.001" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })} className={input} /></label><label className="flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50 p-4 text-sm font-semibold sm:col-span-2"><input type="checkbox" checked={form.trackSerials} onChange={(e) => setForm({ ...form, trackSerials: e.target.checked })} className="h-4 w-4 accent-[#0E9384]" /><span>Track each unit by serial number and secure QR<span className="mt-1 block text-xs font-normal text-slate-500">Required for one-time warranty activation and serialized traceability.</span></span></label></div></section>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b px-5 py-4"><span className="rounded-xl bg-teal-50 p-2 text-[#0E9384]"><ImagePlus className="h-5 w-5" /></span><div><h2 className="font-bold">Product images</h2><p className="text-xs text-slate-500">Add up to eight hosted image URLs. The first image is used in POS and catalog cards.</p></div></div><div className="p-5"><div className="flex max-w-3xl gap-2"><input type="url" value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="https://cdn.example.com/products/item.jpg" className={input.replace("mt-1 ", "")} /><button type="button" onClick={addImage} className="inline-flex items-center gap-2 rounded-xl bg-[#025148] px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add</button></div><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{imageUrls.map((url, index) => <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-2xl border bg-slate-50"><div className="relative aspect-[4/3]"><Image src={url} alt={`${form.name || "Product"} image ${index + 1}`} fill unoptimized className="object-cover" /></div><div className="flex items-center justify-between p-3"><span className="text-xs font-semibold">{index === 0 ? "Primary image" : `Image ${index + 1}`}</span><button type="button" onClick={() => setImageUrls((current) => current.filter((_, position) => position !== index))} className="rounded-lg p-1 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button></div></div>)}{imageUrls.length === 0 && <div className="col-span-full rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500"><ImagePlus className="mx-auto mb-2 h-7 w-7 text-slate-300" />No product images added yet.</div>}</div></div></section>
      <div className="flex justify-end gap-3"><button type="button" onClick={() => router.back()} className="rounded-xl border bg-white px-5 py-2.5 font-semibold">Cancel</button><button disabled={saving} className="rounded-xl bg-[#0E9384] px-6 py-2.5 font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : product ? "Save Product" : "Create Product"}</button></div>
    </form>
  </main>;
}
