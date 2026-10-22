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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
              <Select defaultValue="Store A">
                <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] bg-white focus:border-[var(--brand-green)] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="Store A" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Store A</SelectItem>
                  <SelectItem value="Store B" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Store B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Warehouse <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <Select defaultValue="Main Warehouse">
                <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] bg-white focus:border-[var(--brand-green)] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="Main Warehouse" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Main Warehouse</SelectItem>
                  <SelectItem value="Secondary Warehouse" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Secondary Warehouse</SelectItem>
                </SelectContent>
              </Select>
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
              <Select defaultValue="Retail">
                <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] bg-white focus:border-[var(--brand-green)] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="Retail" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Retail</SelectItem>
                  <SelectItem value="Wholesale" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Wholesale</SelectItem>
                </SelectContent>
              </Select>
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
              <Select defaultValue="Computers">
                <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] bg-white focus:border-[var(--brand-green)] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="Computers" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Computers</SelectItem>
                  <SelectItem value="Electronics" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Electronics</SelectItem>
                  <SelectItem value="Shoe" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Shoe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Sub Category <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <Select defaultValue="Laptops">
                <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] bg-white focus:border-[var(--brand-green)] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="Laptops" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Laptops</SelectItem>
                  <SelectItem value="Accessories" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 5: Brand + Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Brand <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <Select defaultValue="Lenovo">
                <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] bg-white focus:border-[var(--brand-green)] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="Lenovo" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Lenovo</SelectItem>
                  <SelectItem value="Apple" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Apple</SelectItem>
                  <SelectItem value="Dell" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Dell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1">
                Unit <span className="text-[var(--brand-red)] ml-0.5">*</span>
              </label>
              <Select defaultValue="Pc">
                <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] bg-white focus:border-[var(--brand-green)] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="Pc" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Pc</SelectItem>
                  <SelectItem value="Box" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Box</SelectItem>
                  <SelectItem value="Kg" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Kg</SelectItem>
                </SelectContent>
              </Select>
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
              <Select defaultValue="Code 128">
                <SelectTrigger className="w-full h-9 data-[size=default]:h-9 rounded-lg border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] bg-white focus:border-[var(--brand-green)] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="Code 128" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Code 128</SelectItem>
                  <SelectItem value="QR Code" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">QR Code</SelectItem>
                  <SelectItem value="EAN-13" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">EAN-13</SelectItem>
                </SelectContent>
              </Select>
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
