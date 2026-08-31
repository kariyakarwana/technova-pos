"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

interface AIAssistantPromptBarProps {
  suggestedPrompts: string[];
  onSubmitPrompt?: (prompt: string) => void;
  isProcessing?: boolean;
}

export default function AIAssistantPromptBar({
  suggestedPrompts,
  onSubmitPrompt,
  isProcessing = false,
}: AIAssistantPromptBarProps) {
  const [prompt, setPrompt] = useState("");

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!prompt.trim() || isProcessing) return;
    onSubmitPrompt?.(prompt.trim());
    setPrompt("");
  }

  function handleSelectChip(chip: string) {
    setPrompt(chip);
    onSubmitPrompt?.(chip);
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-green)] p-4 shadow-sm space-y-3">
      {/* Top Suggestion Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {suggestedPrompts.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleSelectChip(chip)}
            className="px-3 py-1 rounded-full border border-[var(--brand-green)] bg-white hover:bg-[#F0FDF9] text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Group */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 pt-1">
        <Sparkles className="h-5 w-5 text-[var(--brand-green)] shrink-0" />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI Business Assistant..."
          className="flex-1 text-xs text-[var(--brand-black-font)] placeholder:text-slate-400 font-medium bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          disabled={!prompt.trim() || isProcessing}
          aria-label="Send query to AI"
          className="h-9 w-9 rounded-xl bg-[var(--brand-green)] hover:bg-[#0B6E63] text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer disabled:opacity-40 shrink-0"
        >
          <Send className="h-4 w-4 -translate-x-0.5 translate-y-0.5" />
        </button>
      </form>
    </div>
  );
}
