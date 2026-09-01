"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bold,
  ChevronDown,
  ChevronUp,
  ChevronsUp,
  Info,
  Italic,
  AlignLeft,
  List,
  AlignCenter,
  MinusCircle,
  PlusCircle,
  RefreshCw,
  Send,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components & Helpers
// ─────────────────────────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">
      {children}
      {required && <span className="text-[var(--brand-red)] ml-0.5">*</span>}
    </label>
  );
}

function Input({
  placeholder = "",
  type = "text",
  className = "",
  value,
  onChange,
}: {
  placeholder?: string;
  type?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full h-10 rounded-xl border border-[var(--brand-stroke)] px-3 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 bg-white focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 transition-all ${className}`}
    />
  );
}

function Select({
  defaultValue = "",
  children,
}: {
  defaultValue?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        defaultValue={defaultValue}
        className="w-full h-10 rounded-xl border border-[var(--brand-stroke)] px-3 pr-8 text-xs text-[var(--brand-black-font)] bg-white focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 transition-all appearance-none cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Update Category Page
// ─────────────────────────────────────────────────────────────────────────────

export default function UpdateCategoryPage() {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [sku, setSku] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>(["Nokia", ""]);
  const [description, setDescription] = useState("");
  const [wordCount, setWordCount] = useState(0);

  function handleGenerateSku() {
    const randomSku = `CAT-${Math.floor(1000 + Math.random() * 9000)}`;
    setSku(randomSku);
  }

  function handleSubCategoryChange(index: number, val: string) {
    const updated = [...subCategories];
    updated[index] = val;
    setSubCategories(updated);
  }

  function handleAddSubCategory() {
    setSubCategories([...subCategories, ""]);
  }

  function handleRemoveSubCategory(index: number) {
    if (subCategories.length <= 1) {
      setSubCategories([""]);
      return;
    }
    setSubCategories(subCategories.filter((_, i) => i !== index));
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value;
    setDescription(text);
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }

  // Header Actions
  const headerActions = (
    <div className="flex items-center gap-2">
      {/* Refresh */}
      <button
        type="button"
        title="Refresh"
        className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] flex items-center justify-center text-slate-500 hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] transition-all"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </button>

      {/* Collapse all */}
      <button
        type="button"
        title="Collapse"
        onClick={() => setIsSectionOpen((prev) => !prev)}
        className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] flex items-center justify-center text-slate-500 hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] transition-all"
      >
        <ChevronsUp className="h-3.5 w-3.5" />
      </button>

      {/* Back to Products — solid dark teal */}
      <Link
        href="/products/categories"
        className="flex items-center gap-1.5 h-8 px-4 rounded-xl bg-[#1E5D57] text-white text-xs font-medium hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Products
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--brand-app-bg)]">
      {/* Page Header */}
      <PageHeader
        title="Update Category"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Update Category" },
        ]}
        actions={headerActions}
      />

      <div className="px-6 pb-20">
        {/* Main Card */}
        <div className="pos-card overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--brand-stroke)]">
            <div className="flex items-center gap-2">
              <span className="text-[var(--brand-green)] flex items-center justify-center">
                <Info className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-semibold text-[var(--brand-black-font)]">
                Category Information
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsSectionOpen((prev) => !prev)}
              aria-label={isSectionOpen ? "Collapse section" : "Expand section"}
              className="text-slate-400 hover:text-[var(--brand-green)] transition-colors p-1"
            >
              {isSectionOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Card Body */}
          {isSectionOpen && (
            <div className="p-6 space-y-5">
              {/* Row 1: Store & Warehouse */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label required>Store</Label>
                  <Select defaultValue="Branch 1">
                    <option value="Branch 1">Branch 1</option>
                    <option value="Branch 2">Branch 2</option>
                  </Select>
                </div>
                <div>
                  <Label required>Warehouse</Label>
                  <Select defaultValue="Warehouse 1">
                    <option value="Warehouse 1">Warehouse 1</option>
                    <option value="Warehouse 2">Warehouse 2</option>
                  </Select>
                </div>
              </div>

              {/* Row 2: Update Category Name (Left Column) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label required>Update Category Name</Label>
                  <Input
                    placeholder=""
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 3: SKU & Selling Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label required>SKU</Label>
                  <div className="relative flex items-center">
                    <Input
                      placeholder=""
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="pr-24"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateSku}
                      className="absolute right-1.5 h-7 px-3 rounded-lg bg-[var(--brand-green)] text-white text-[11px] font-semibold hover:opacity-90 transition-opacity"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <Label required>Selling Type</Label>
                  <Select defaultValue="">
                    <option value="">Select</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                  </Select>
                </div>
              </div>

              {/* Row 4: Dynamic Sub Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label required>Sub Categories</Label>
                  {subCategories.map((subCat, index) => {
                    const isLast = index === subCategories.length - 1;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder=""
                          value={subCat}
                          onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                          className="flex-1"
                        />
                        {isLast ? (
                          <button
                            type="button"
                            onClick={handleAddSubCategory}
                            title="Add Sub Category"
                            className="text-[var(--brand-green)] hover:opacity-80 transition-opacity shrink-0"
                          >
                            <PlusCircle className="h-6 w-6" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubCategory(index)}
                            title="Remove Sub Category"
                            className="text-[var(--brand-green)] hover:opacity-80 transition-opacity shrink-0"
                          >
                            <MinusCircle className="h-6 w-6" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: Description Box */}
              <div>
                <Label>Description</Label>
                <div className="rounded-xl border border-[var(--brand-stroke)] overflow-hidden">
                  {/* Rich Text Toolbar Mockup Header */}
                  <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--brand-stroke)] bg-slate-50/60 flex-wrap">
                    {[Bold, Italic, AlignLeft, List, AlignCenter].map((Icon, i) => (
                      <button
                        key={i}
                        type="button"
                        className="h-6 w-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-[var(--brand-black-font)] transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    ))}
                    <div className="h-4 w-px bg-slate-200 mx-1" />
                    {[Bold, Bold, Bold, Bold].map((Icon, i) => (
                      <button
                        key={`extra-${i}`}
                        type="button"
                        className="h-6 w-6 flex items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-[var(--brand-black-font)] transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>

                  {/* Textarea */}
                  <textarea
                    placeholder="Type your message"
                    rows={4}
                    value={description}
                    onChange={handleDescriptionChange}
                    className="w-full resize-none px-4 py-3 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none bg-white"
                  />

                  {/* Bottom Counter & Icons Toolbar */}
                  <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--brand-stroke)] bg-slate-50/60">
                    <div className="flex items-center gap-2">
                      {[Bold, Bold, Bold].map((Icon, i) => (
                        <button
                          key={`bottom-${i}`}
                          type="button"
                          className="h-5 w-5 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <Icon className="h-3 w-3" />
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        title="Send"
                        className="text-slate-400 hover:text-[var(--brand-green)] transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Maximum 60 Words ({wordCount} / 60)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom Action Buttons ── */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Link
            href="/products/categories"
            className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-[var(--brand-blue-pending)] text-white text-xs font-semibold hover:bg-[#071F36] active:scale-[0.98] transition-all"
          >
            Cancel
          </Link>
          <button
            type="button"
            className="h-10 px-6 rounded-xl bg-[var(--brand-green)] text-white text-xs font-semibold hover:bg-[#0C7B6F] active:scale-[0.98] transition-all shadow-sm"
          >
            Update Category
          </button>
        </div>
      </div>
    </div>
  );
}
