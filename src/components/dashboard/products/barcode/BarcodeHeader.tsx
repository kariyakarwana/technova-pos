"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

export default function BarcodeHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Barcode Operations
        </h1>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--brand-muted-font)] font-medium">
          <Link
            href="/dashboard"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <Link
            href="/products"
            className="hover:text-[var(--brand-green)] transition-colors"
          >
            Products
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-[var(--brand-black-font)] font-semibold">
            Barcode Operations
          </span>
        </div>
      </div>

      <BackButton
        href="/products"
        label="Back to Products"
        className="self-start sm:self-auto"
      />
    </header>
  );
}
