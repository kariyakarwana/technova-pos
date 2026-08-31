"use client";

import { useEffect, useRef } from "react";
import { Bot, Sparkles, User } from "lucide-react";
import type { ChatMessage, ProactiveRecommendation } from "./AIIntelligenceMock";

interface AIChatConversationViewProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  onActionClick?: (rec: ProactiveRecommendation) => void;
}

export default function AIChatConversationView({
  messages,
  isProcessing,
  onActionClick,
}: AIChatConversationViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  return (
    <div className="flex-1 overflow-y-auto space-y-4 py-4 px-2 max-h-[60vh]">
      {messages.map((msg) => {
        const isAssistant = msg.sender === "assistant";

        return (
          <div
            key={msg.id}
            className={[
              "flex gap-3 max-w-2xl",
              isAssistant ? "mr-auto" : "ml-auto flex-row-reverse",
            ].join(" ")}
          >
            {/* Avatar */}
            <div
              className={[
                "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs",
                isAssistant
                  ? "bg-[var(--brand-green)] text-white"
                  : "bg-[#004532] text-white",
              ].join(" ")}
            >
              {isAssistant ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>

            {/* Content Bubble */}
            <div className="space-y-1.5 flex-1">
              <div
                className={[
                  "p-4 rounded-2xl text-xs leading-relaxed shadow-xs",
                  isAssistant
                    ? "bg-white border border-[var(--brand-stroke)] text-[var(--brand-black-font)]"
                    : "bg-[var(--brand-green)] text-white font-medium",
                ].join(" ")}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Optional embedded recommendations inside assistant bubble */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                    {msg.recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-[#F0FDF9] border border-[#CBEFE8] rounded-xl p-3 flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="font-bold text-[var(--brand-black-font)] text-[11px]">
                            {rec.title}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {rec.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onActionClick?.(rec)}
                          className="px-2.5 py-1 rounded-lg bg-[var(--brand-green)] text-white text-[10px] font-bold hover:bg-[#0B6E63] transition-colors shrink-0 cursor-pointer"
                        >
                          {rec.actionText}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span
                className={[
                  "block text-[10px] font-semibold text-slate-400 px-1",
                  isAssistant ? "text-left" : "text-right",
                ].join(" ")}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        );
      })}

      {/* Typing / Processing indicator */}
      {isProcessing && (
        <div className="flex gap-3 max-w-2xl mr-auto">
          <div className="h-8 w-8 rounded-xl bg-[var(--brand-green)] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Bot className="h-4 w-4 animate-pulse" />
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[var(--brand-stroke)] shadow-xs flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--brand-green)] animate-bounce [animation-delay:-0.3s]" />
            <span className="h-2 w-2 rounded-full bg-[var(--brand-green)] animate-bounce [animation-delay:-0.15s]" />
            <span className="h-2 w-2 rounded-full bg-[var(--brand-green)] animate-bounce" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
