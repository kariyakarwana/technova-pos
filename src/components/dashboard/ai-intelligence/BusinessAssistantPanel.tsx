"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  ChevronRight,
  HelpCircle,
  Minus,
  RefreshCw,
  RotateCcw,
  Send,
  Sparkles,
  Table as TableIcon,
  User,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiSendAssistantChat } from "@/lib/api/client";
import type {
  AssistantChatRequest,
  AssistantChatResponse,
  AssistantUiMessage,
} from "./ai-intelligence.types";
import { MarkdownRenderer } from "./MarkdownRenderer";

const EXAMPLE_QUESTIONS = [
  "How were sales this month?",
  "What are the expected sales for the next 7 days?",
  "Which products are likely to have high demand next week?",
  "Which products are currently low in stock?",
  "What products are trending?",
  "Which products are commonly bought together?",
  "Which high-demand products are currently low in stock?",
  "Give me an executive business summary",
];

interface BusinessAssistantPanelProps {
  branchId?: string;
  branchName?: string;
}

export default function BusinessAssistantPanel({
  branchId,
  branchName,
}: BusinessAssistantPanelProps) {
  const [messages, setMessages] = useState<AssistantUiMessage[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setInput("");
    setError(null);
    setLastFailedPrompt(null);
    textareaRef.current?.focus();
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText ?? input).trim();
    if (!textToSend || isSending) return;

    setError(null);
    setLastFailedPrompt(null);

    const userMessageId = `user-${Date.now()}`;
    const userMsg: AssistantUiMessage = {
      id: userMessageId,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      const payload: AssistantChatRequest = {
        message: textToSend,
        conversationId: conversationId ?? undefined,
        branchId: branchId || undefined,
      };

      const response: AssistantChatResponse = await apiSendAssistantChat(payload);

      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      const assistantMsg: AssistantUiMessage = {
        id: response.message.id || `assistant-${Date.now()}`,
        sender: "assistant",
        text: response.message.answer,
        timestamp: new Date(response.message.createdAt || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        structuredOutput: response.message,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Unable to process assistant query.";
      setError(errMsg);
      setLastFailedPrompt(textToSend);

      const errorMsg: AssistantUiMessage = {
        id: `error-${Date.now()}`,
        sender: "assistant",
        text: "I was unable to complete your request. Please check your network connection or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleSelectExample = (question: string) => {
    setInput(question);
    textareaRef.current?.focus();
  };

  const handleRetry = () => {
    if (lastFailedPrompt) {
      void handleSend(lastFailedPrompt);
    }
  };

  return (
    <div className="flex flex-col h-[750px] w-full rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xs overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green)] text-white shadow-2xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-sm">Business Assistant</h2>
              <span className="flex items-center gap-1 rounded-full bg-emerald-100/70 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                <Sparkles className="h-3 w-3" /> Retail Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Scope: {branchId ? (branchName ? `${branchName}` : `Branch (${branchId})`) : "All store branches"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {conversationId && (
            <span className="text-[10px] font-mono text-slate-400">
              Session: {conversationId.slice(0, 8)}...
            </span>
          )}
          <button
            type="button"
            onClick={handleNewConversation}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            title="Start a new conversation"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto text-center py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[var(--brand-green)] border border-emerald-100 shadow-xs mb-3">
              <Bot className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">How can I assist your business today?</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-md">
              Ask natural questions about sales, inventory, product catalogs, branch performance, or future forecasts. Supports English, Sinhala, and Singlish.
            </p>

            <div className="mt-6 w-full text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" /> Suggested Queries
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSelectExample(q)}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[var(--brand-green)] hover:bg-emerald-50/30 text-left text-xs font-medium text-slate-700 transition-colors shadow-2xs group cursor-pointer"
                  >
                    <span className="truncate mr-2">{q}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[var(--brand-green)] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 shadow-2xs ${
                    isUser
                      ? "bg-slate-800 text-white"
                      : msg.isError
                      ? "bg-rose-100 text-rose-700 border border-rose-200"
                      : "bg-[var(--brand-green)] text-white"
                  }`}
                >
                  {isUser ? (
                    <User className="h-4 w-4" />
                  ) : msg.isError ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                {/* Content Bubble */}
                <div className={`space-y-1.5 flex-1 max-w-[88%] ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? "bg-[#025148] text-white font-medium rounded-tr-xs"
                        : msg.isError
                        ? "bg-rose-50 border border-rose-200 text-rose-800 rounded-tl-xs"
                        : "bg-white border border-[var(--brand-stroke)] text-slate-800 rounded-tl-xs"
                    }`}
                  >
                    {/* Main Narrative */}
                    {isUser ? (
                      <div className="whitespace-pre-line text-xs font-medium leading-relaxed">
                        {msg.text}
                      </div>
                    ) : (
                      <MarkdownRenderer content={msg.text} />
                    )}

                    {/* Structured KPI Cards */}
                    {msg.structuredOutput?.kpi_cards && msg.structuredOutput.kpi_cards.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100">
                        {msg.structuredOutput.kpi_cards.map((kpi, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-2.5"
                          >
                            <p className="text-[10px] font-semibold text-slate-500 truncate">{kpi.label}</p>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">
                              {kpi.value} {kpi.unit ? <span className="text-[10px] font-normal text-slate-500">{kpi.unit}</span> : null}
                            </p>
                            {kpi.change && (
                              <p className="text-[10px] font-medium text-emerald-600 flex items-center gap-0.5 mt-0.5">
                                {kpi.trend === "up" && <ArrowUpRight className="h-3 w-3" />}
                                {kpi.trend === "down" && <ArrowDownRight className="h-3 w-3 text-rose-600" />}
                                {kpi.trend === "neutral" && <Minus className="h-3 w-3 text-slate-400" />}
                                <span>{kpi.change}</span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Structured Table */}
                    {msg.structuredOutput?.table && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="bg-slate-50/80 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5">
                          <TableIcon className="h-3.5 w-3.5 text-slate-500" />
                          <p className="font-bold text-[11px] text-slate-800">{msg.structuredOutput.table.title}</p>
                        </div>
                        <div className="overflow-x-auto max-h-60">
                          <table className="w-full text-left text-[11px]">
                            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100 sticky top-0">
                              <tr>
                                {msg.structuredOutput.table.columns.map((col, cIdx) => (
                                  <th key={cIdx} className="px-3 py-2 whitespace-nowrap">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {msg.structuredOutput.table.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-slate-50/60">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="px-3 py-2 whitespace-nowrap text-slate-700">
                                      {String(cell)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Structured Chart */}
                    {msg.structuredOutput?.chart && msg.structuredOutput.chart.series?.[0]?.data?.length > 0 && (
                      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                        <p className="font-bold text-[11px] text-slate-800 mb-2">{msg.structuredOutput.chart.title}</p>
                        <div className="h-44 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            {msg.structuredOutput.chart.type === "bar" ? (
                              <BarChart data={msg.structuredOutput.chart.series[0].data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip
                                  contentStyle={{
                                    fontSize: "11px",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                  }}
                                />
                                <Bar dataKey="value" fill="#025148" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            ) : (
                              <LineChart data={msg.structuredOutput.chart.series[0].data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip
                                  contentStyle={{
                                    fontSize: "11px",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                  }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#025148"
                                  strokeWidth={2}
                                  dot={{ r: 3 }}
                                />
                              </LineChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Follow-up Suggestions */}
                    {msg.structuredOutput?.follow_up_suggestions && msg.structuredOutput.follow_up_suggestions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-semibold text-slate-400 mr-1">Suggested next:</span>
                        {msg.structuredOutput.follow_up_suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectExample(sug)}
                            className="rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 px-2.5 py-0.5 text-[10px] font-medium text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Evidence / Source Metadata Badge */}
                    {msg.structuredOutput?.sources && msg.structuredOutput.sources.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-500">Sources:</span>
                        {msg.structuredOutput.sources.map((src, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600"
                          >
                            {src.tool} ({src.recordCount} {src.recordCount === 1 ? "record" : "records"})
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Disclaimer */}
                    {msg.structuredOutput?.disclaimer && (
                      <p className="mt-2 text-[10px] text-slate-400 italic">
                        {msg.structuredOutput.disclaimer}
                      </p>
                    )}
                  </div>

                  <span className={`block text-[10px] font-medium text-slate-400 px-1 ${isUser ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Processing Indicator */}
        {isSending && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand-green)] text-white shrink-0 shadow-2xs">
              <Bot className="h-4 w-4 animate-pulse" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[var(--brand-stroke)] shadow-xs flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-green)] animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-[var(--brand-green)] animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-[var(--brand-green)] animate-bounce" />
              <span className="ml-2 text-xs font-medium text-slate-500">Synthesizing live store data...</span>
            </div>
          </div>
        )}

        {/* Error message with retry */}
        {error && (
          <div className="flex items-center justify-between p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            {lastFailedPrompt && (
              <button
                type="button"
                onClick={handleRetry}
                className="flex items-center gap-1 rounded-lg bg-rose-600 text-white px-2.5 py-1 text-[11px] font-bold hover:bg-rose-700 transition cursor-pointer shrink-0"
              >
                <RefreshCw className="h-3 w-3" /> Retry
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="border-t border-slate-200 bg-white p-3.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSend();
          }}
          className="flex items-end gap-2.5 rounded-2xl border border-[var(--brand-stroke)] bg-slate-50/70 p-2 focus-within:border-[var(--brand-green)] focus-within:bg-white transition-colors"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            rows={1}
            placeholder="Ask Business Assistant in English, Sinhala, or Singlish (Enter to send, Shift+Enter for newline)..."
            className="flex-1 max-h-32 min-h-[38px] resize-none bg-transparent px-2.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none leading-relaxed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            aria-label="Send message to Business Assistant"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-green)] text-white shadow-2xs hover:bg-[#025148] disabled:opacity-40 transition-colors cursor-pointer shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-slate-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Read-only analytics • Multi-tenant isolated</span>
        </div>
      </div>
    </div>
  );
}
