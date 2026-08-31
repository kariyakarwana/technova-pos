"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, ImagePlus, SquareStack } from "lucide-react";

export default function UpdateProductImagesCard() {
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="pos-card overflow-hidden bg-white border border-[var(--brand-stroke)] rounded-2xl shadow-xs">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--brand-stroke)]">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center text-[var(--brand-green)]">
            <SquareStack className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-[var(--brand-black-font)]">
            Images
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

      {isOpen && (
        <div className="p-6">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-28 w-28 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[var(--brand-green)] hover:bg-[var(--brand-green-transparent)] transition-all group"
          >
            <ImagePlus className="h-5 w-5 text-slate-400 group-hover:text-[var(--brand-green)] transition-colors" />
            <span className="text-[11px] text-slate-400 group-hover:text-[var(--brand-green)] transition-colors">
              Add Image
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" multiple />
        </div>
      )}
    </div>
  );
}
