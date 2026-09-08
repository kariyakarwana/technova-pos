"use client";

import type { VisualThemeTokens } from "@/types/dashboard";

interface VisualThemePreviewProps {
  tokens: VisualThemeTokens;
  size?: "sm" | "md";
}

export function VisualThemePreview({ tokens, size = "md" }: VisualThemePreviewProps) {
  const bg = tokens.backgroundColor ?? "#F8FAFC";
  const card = tokens.cardBackground ?? "#FFFFFF";
  const primary = tokens.primaryColor ?? "#0E9384";
  const text = tokens.textColor ?? "#1D2939";
  const surface = tokens.surfaceColor ?? "#F1F5F9";

  if (size === "sm") {
    return (
      <div
        aria-hidden="true"
        className="flex h-6 w-20 shrink-0 overflow-hidden rounded-md border border-black/10"
        title="Theme color preview"
      >
        <div className="flex-1" style={{ backgroundColor: bg }} />
        <div className="flex-1" style={{ backgroundColor: card }} />
        <div className="w-3 shrink-0" style={{ backgroundColor: primary }} />
        <div className="w-2 shrink-0" style={{ backgroundColor: text }} />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="h-16 w-full overflow-hidden rounded-xl border border-black/10"
      title="Theme color preview"
      style={{ backgroundColor: bg }}
    >
      <div className="flex h-full gap-1.5 p-2">
        <div
          className="flex flex-1 flex-col gap-1 rounded-lg p-1.5"
          style={{ backgroundColor: card }}
        >
          <div className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: text, opacity: 0.25 }} />
          <div className="h-1 w-1/2 rounded-full" style={{ backgroundColor: text, opacity: 0.15 }} />
        </div>
        <div className="flex w-10 flex-col gap-1">
          <div className="h-5 w-full rounded-lg" style={{ backgroundColor: primary }} />
          <div className="flex-1 rounded-lg" style={{ backgroundColor: surface }} />
        </div>
      </div>
    </div>
  );
}
