"use client";

import type { Category } from "./pos.mock";

interface CategorySidebarProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

export function CategorySidebar({
  categories,
  selected,
  onSelect,
}: CategorySidebarProps) {
  return (
    <aside className="w-24 shrink-0 bg-[#F9F9FF] border-r border-[#E6EAED] overflow-y-auto flex flex-col items-center py-4 px-2 gap-2.5">
      <p className="text-xs font-bold text-[#212B36] tracking-tight mb-1 text-center">
        Categories
      </p>

      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selected === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            aria-pressed={isActive}
            className={[
              "flex flex-col items-center justify-center gap-1.5 w-[76px] h-[76px] rounded-2xl",
              "text-[11px] font-semibold transition-all duration-150 cursor-pointer shadow-xs",
              isActive
                ? "border-2 border-[#0E9384] bg-[#EEFFFD] text-[#0E9384] shadow-sm"
                : "border border-[#E6EAED] bg-white text-[#212B36] hover:border-[#0E9384]/50 hover:bg-slate-50",
            ].join(" ")}
          >
            <Icon
              className={[
                "h-5 w-5 shrink-0 transition-colors",
                isActive ? "text-[#0E9384]" : "text-slate-600",
              ].join(" ")}
              aria-hidden="true"
            />
            <span className="text-center leading-tight">{cat.label}</span>
          </button>
        );
      })}
    </aside>
  );
}

export default CategorySidebar;
