"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlignCenter,
  AlignLeft,
  Bold,
  ChevronDown,
  ChevronUp,
  Info,
  Italic,
  List,
} from "lucide-react";

interface AddProductInfoCardProps {
  productName: string;
  onProductNameChange: (val: string) => void;
  slug: string;
  onSlugChange: (val: string) => void;
  sku: string;
  onSkuChange: (val: string) => void;
  onGenerateSku: () => void;
  itemCode: string;
  onItemCodeChange: (val: string) => void;
  onGenerateItemCode: () => void;
  description: string;
  onDescriptionChange: (val: string) => void;
}

export default function AddProductInfoCard({
  productName,
  onProductNameChange,
  slug,
  onSlugChange,
  sku,
  onSkuChange,
  onGenerateSku,
  itemCode,
  onItemCodeChange,
  onGenerateItemCode,
  description,
  onDescriptionChange,
}: AddProductInfoCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  return (
    <div className="pos-card overflow-hidden bg-white border border-[var(--brand-stroke)] rounded-2xl shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--brand-stroke)]">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center text-[var(--brand-green)]">
            <Info className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-[var(--brand-black-font)]">
            Product Information
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="text-slate-400 hover:text-[var(--brand-green)] transition-colors p-1 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="p-6 space-y-4">
          {/* Row 1: Store + Warehouse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Store <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <div className="relative">
                <select
                  defaultValue="Store A"
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
                >
                  <option value="Store A">Store A</option>
                  <option value="Store B">Store B</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Warehouse <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <div className="relative">
                <select
                  defaultValue="Main Warehouse"
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
                >
                  <option value="Main Warehouse">Main Warehouse</option>
                  <option value="Secondary Warehouse">Secondary Warehouse</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: Product Name + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Product Name <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => onProductNameChange(e.target.value)}
                placeholder="Enter product name"
                className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 bg-white focus:outline-none focus:border-[var(--brand-green)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Slug <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => onSlugChange(e.target.value)}
                placeholder="product-slug"
                className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 bg-white focus:outline-none focus:border-[var(--brand-green)]"
              />
            </div>
          </div>

          {/* Row 3: SKU + Selling Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                SKU <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => onSkuChange(e.target.value)}
                  placeholder="Enter SKU"
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] pl-3 pr-24 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 bg-white focus:outline-none focus:border-[var(--brand-green)]"
                />
                <button
                  type="button"
                  onClick={onGenerateSku}
                  className="absolute right-1 h-7 px-3 rounded-md bg-[var(--brand-green)] text-white text-[11px] font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Selling Type <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <div className="relative">
                <select
                  defaultValue="Retail"
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
                >
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 4: Category + Sub Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[var(--brand-black-font)]">
                  Category <span className="text-[var(--brand-red)] ml-0.5">*</span>
                </label>
                <Link
                  href="/products/categories/create"
                  className="flex items-center gap-0.5 text-[11px] text-[var(--brand-green)] font-medium hover:underline"
                >
                  <span className="text-sm leading-none">⊕</span> Add New
                </Link>
              </div>
              <div className="relative">
                <select
                  defaultValue="Computers"
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
                >
                  <option value="Computers">Computers</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Shoe">Shoe</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Sub Category <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <div className="relative">
                <select
                  defaultValue="Laptops"
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
                >
                  <option value="Laptops">Laptops</option>
                  <option value="Accessories">Accessories</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 5: Brand + Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Brand <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <div className="relative">
                <select
                  defaultValue="Lenovo"
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
                >
                  <option value="Lenovo">Lenovo</option>
                  <option value="Apple">Apple</option>
                  <option value="Dell">Dell</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Unit <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <div className="relative">
                <select
                  defaultValue="Pc"
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
                >
                  <option value="Pc">Pc</option>
                  <option value="Box">Box</option>
                  <option value="Kg">Kg</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 6: Item Code + Barcode Symbology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Item Code <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={itemCode}
                  onChange={(e) => onItemCodeChange(e.target.value)}
                  placeholder="Enter item code"
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] pl-3 pr-24 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 bg-white focus:outline-none focus:border-[var(--brand-green)]"
                />
                <button
                  type="button"
                  onClick={onGenerateItemCode}
                  className="absolute right-1 h-7 px-3 rounded-md bg-[var(--brand-green)] text-white text-[11px] font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Barcode Symbology <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <div className="relative">
                <select
                  defaultValue="Code 128"
                  className="w-full h-9 rounded-lg border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] appearance-none cursor-pointer"
                >
                  <option value="Code 128">Code 128</option>
                  <option value="QR Code">QR Code</option>
                  <option value="EAN-13">EAN-13</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
              Description
            </label>
            <div className="rounded-xl border border-[var(--brand-stroke)] overflow-hidden">
              <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--brand-stroke)] bg-slate-50/60 flex-wrap">
                {[Bold, Italic, AlignLeft, List, AlignCenter].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="h-6 w-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Type your message"
                rows={4}
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="w-full resize-none px-4 py-3 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none bg-white"
              />
              <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--brand-stroke)] bg-slate-50/60">
                <span className="text-[11px] text-slate-400">Maximum 60 Words</span>
                <span className="text-[11px] text-slate-400">{wordCount} / 60</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
