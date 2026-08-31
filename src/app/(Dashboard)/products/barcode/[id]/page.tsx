"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronsUp,
  Info,
  LayoutGrid,
  Printer,
  RefreshCw,
  RotateCcw,
  Save,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

// ─────────────────────────────────────────────────────────────────────────────
// Barcode Visual SVG Component
// ─────────────────────────────────────────────────────────────────────────────

function LargeBarcodeDisplay({ code }: { code: string }) {
  return (
    <div className="bg-white border border-[var(--brand-stroke)] rounded-xl p-4 flex flex-col items-center justify-center w-full shadow-xs">
      {/* SVG Barcode Stripes */}
      <svg
        className="w-48 h-16"
        viewBox="0 0 160 48"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="0" width="3" height="48" fill="#151C27" />
        <rect x="5" y="0" width="1.5" height="48" fill="#151C27" />
        <rect x="9" y="0" width="4" height="48" fill="#151C27" />
        <rect x="16" y="0" width="2" height="48" fill="#151C27" />
        <rect x="20" y="0" width="1" height="48" fill="#151C27" />
        <rect x="24" y="0" width="3" height="48" fill="#151C27" />
        <rect x="30" y="0" width="5" height="48" fill="#151C27" />
        <rect x="38" y="0" width="1.5" height="48" fill="#151C27" />
        <rect x="42" y="0" width="3" height="48" fill="#151C27" />
        <rect x="48" y="0" width="2" height="48" fill="#151C27" />
        <rect x="53" y="0" width="4" height="48" fill="#151C27" />
        <rect x="60" y="0" width="1.5" height="48" fill="#151C27" />
        <rect x="64" y="0" width="3" height="48" fill="#151C27" />
        <rect x="70" y="0" width="2" height="48" fill="#151C27" />
        <rect x="75" y="0" width="5" height="48" fill="#151C27" />
        <rect x="83" y="0" width="1.5" height="48" fill="#151C27" />
        <rect x="87" y="0" width="3" height="48" fill="#151C27" />
        <rect x="93" y="0" width="2" height="48" fill="#151C27" />
        <rect x="98" y="0" width="4" height="48" fill="#151C27" />
        <rect x="105" y="0" width="1.5" height="48" fill="#151C27" />
        <rect x="109" y="0" width="3" height="48" fill="#151C27" />
        <rect x="115" y="0" width="2" height="48" fill="#151C27" />
        <rect x="120" y="0" width="5" height="48" fill="#151C27" />
        <rect x="128" y="0" width="1.5" height="48" fill="#151C27" />
        <rect x="132" y="0" width="3" height="48" fill="#151C27" />
        <rect x="138" y="0" width="2" height="48" fill="#151C27" />
        <rect x="143" y="0" width="4" height="48" fill="#151C27" />
        <rect x="150" y="0" width="2" height="48" fill="#151C27" />
        <rect x="155" y="0" width="3" height="48" fill="#151C27" />
      </svg>
      <span className="text-xs font-mono font-medium text-[var(--brand-black-font)] tracking-wider mt-2">
        {code}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Update Barcode Page Component
// ─────────────────────────────────────────────────────────────────────────────

export default function UpdateBarcodePage() {
  const [barcodeCode, setBarcodeCode] = useState("8 012345 67890 2");
  const [productName] = useState("Lenovo IdeaPad 3");
  const [price] = useState("");

  function handleRegenerateBarcode() {
    const randomCode = `8 ${Math.floor(100000 + Math.random() * 900000)} ${Math.floor(10000 + Math.random() * 90000)} ${Math.floor(1 + Math.random() * 9)}`;
    setBarcodeCode(randomCode);
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
        className="h-8 w-8 rounded-lg border border-[var(--brand-stroke)] flex items-center justify-center text-slate-500 hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] transition-all"
      >
        <ChevronsUp className="h-3.5 w-3.5" />
      </button>

      {/* Back to Barcode — solid dark teal */}
      <Link
        href="/products/barcode"
        className="flex items-center gap-1.5 h-8 px-4 rounded-xl bg-[#1E5D57] text-white text-xs font-medium hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Barcode
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--brand-app-bg)]">
      {/* Page Header */}
      <PageHeader
        title="Update Barcode Management"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Update Barcode Information" },
        ]}
        actions={headerActions}
      />

      <div className="px-6 pb-20 space-y-6">
        {/* ── Subheader & Action Bar ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Generate</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Update details and manage barcodes for this inventory item.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products/barcode"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleRegenerateBarcode}
              className="flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-800 text-slate-800 text-xs font-medium hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Generate
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 h-9 px-5 rounded-xl bg-[var(--brand-green)] text-white text-xs font-semibold hover:bg-[#0C7B6F] active:scale-[0.98] transition-all shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              Update
            </button>
          </div>
        </div>

        {/* ── Main 2-Column Grid Layout ── */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Left Column: Product Information Card */}
          <div className="pos-card p-6 space-y-6 flex-1 w-full">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--brand-stroke)]">
              <span className="text-[var(--brand-green)]">
                <Info className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-semibold text-slate-800">
                Product Information
              </h2>
            </div>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={productName}
                  className="w-full h-10 rounded-xl bg-slate-100 text-slate-700 text-xs px-3.5 border-none focus:outline-none cursor-default"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Price
                </label>
                <input
                  type="text"
                  readOnly
                  value={price}
                  placeholder=""
                  className="w-full md:w-1/2 h-10 rounded-xl bg-slate-100 text-slate-700 text-xs px-3.5 border-none focus:outline-none cursor-default"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Barcode Details Card */}
          <div className="pos-card p-6 space-y-4 w-full md:w-80 flex flex-col items-center">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--brand-stroke)] w-full">
              <div className="flex items-center gap-0.5 text-[var(--brand-green)]">
                <span className="w-1 h-3.5 bg-[var(--brand-green)] rounded-xs inline-block" />
                <span className="w-0.5 h-3.5 bg-[var(--brand-green)] rounded-xs inline-block" />
                <span className="w-1 h-3.5 bg-[var(--brand-green)] rounded-xs inline-block" />
              </div>
              <h2 className="text-sm font-semibold text-slate-800">
                Barcode Details
              </h2>
            </div>

            {/* Barcode Display Box */}
            <LargeBarcodeDisplay code={barcodeCode} />

            {/* Action Buttons */}
            <div className="w-full space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleRegenerateBarcode}
                className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-[var(--brand-green)] text-white text-xs font-semibold hover:bg-[#0C7B6F] active:scale-[0.98] transition-all shadow-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Regenerate Barcode
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-[var(--brand-green)] text-white text-xs font-semibold hover:bg-[#0C7B6F] active:scale-[0.98] transition-all shadow-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Label
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
