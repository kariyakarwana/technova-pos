"use client";

import {
  AlignLeft,
  Bold,
  ChevronDown,
  Info,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Send,
  Strikethrough,
  Underline,
} from "lucide-react";

interface PromotionInformationCardProps {
  name: string;
  onNameChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function PromotionInformationCard({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  isCollapsed = false,
  onToggleCollapse,
}: PromotionInformationCardProps) {
  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      {/* Top Banner */}
      <div className="p-5 flex items-center justify-between border-b border-[var(--brand-stroke)] bg-white">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[var(--brand-green)]" />
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            Create Promotion Information
          </h2>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          title="Toggle view"
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <ChevronDown
            className={[
              "h-5 w-5 transition-transform duration-200",
              isCollapsed ? "-rotate-90" : "rotate-0",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Form Body */}
      {!isCollapsed && (
        <div className="p-6 space-y-5">
          {/* Promotion Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Promotion Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g. Summer Sale 2024"
              className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
            />
          </div>

          {/* Description / Rich Text Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Description
            </label>

            <div className="border border-[var(--brand-stroke)] rounded-xl overflow-hidden shadow-xs focus-within:border-[var(--brand-green)]">
              {/* Top Formatting Toolbar */}
              <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50 text-slate-500 flex-wrap">
                <button
                  type="button"
                  title="Bold"
                  className="h-7 w-7 rounded hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer font-bold text-xs"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Italic"
                  className="h-7 w-7 rounded hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Underline"
                  className="h-7 w-7 rounded hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Underline className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Strikethrough"
                  className="h-7 w-7 rounded hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Strikethrough className="h-3.5 w-3.5" />
                </button>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <button
                  type="button"
                  title="Align Left"
                  className="h-7 w-7 rounded hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <AlignLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Bullet List"
                  className="h-7 w-7 rounded hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Numbered List"
                  className="h-7 w-7 rounded hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Quote"
                  className="h-7 w-7 rounded hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Quote className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Link"
                  className="h-7 w-7 rounded hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Link2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Textarea */}
              <textarea
                rows={4}
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="Type your message"
                className="w-full p-3.5 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none resize-none"
              />

              {/* Bottom Bar */}
              <div className="flex items-center justify-between p-2.5 border-t border-slate-100 bg-slate-50/30">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <button
                    type="button"
                    className="h-6 w-6 rounded hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Bold className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="h-6 w-6 rounded hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Italic className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="h-6 w-6 rounded hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Underline className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <button
                    type="button"
                    title="Send"
                    className="hover:text-[var(--brand-green)] transition-colors cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Options"
                    className="hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Word Counter */}
            <span className="block text-[11px] text-slate-400 font-medium pt-1">
              Maximum 60 Words ({wordCount}/60)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
