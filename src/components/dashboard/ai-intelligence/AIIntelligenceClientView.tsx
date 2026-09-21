"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, ArrowDownRight, ArrowUpRight, Bot, Boxes, BrainCircuit,
  CheckCircle2, ChevronRight, CircleDollarSign, Clock3, LoaderCircle,
  PackagePlus, RefreshCw, Sparkles, Tags, Users,
} from "lucide-react";
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { apiGet } from "@/lib/api/client";
import AIAssistantPromptBar from "./AIAssistantPromptBar";
import AIChatConversationView from "./AIChatConversationView";
import type { ChatMessage } from "./AIIntelligenceMock";
import type { AIOverview, LoyaltyResult, ProductPrediction } from "./ai-intelligence.types";

type Tab = "overview" | "inventory" | "pricing" | "loyalty" | "assistant";
const currency = new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-LK", { maximumFractionDigits: 1 });
const statusStyle = {
  reorder_now: "bg-rose-50 text-rose-700 border-rose-200",
  monitor: "bg-amber-50 text-amber-700 border-amber-200",
  healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function KpiCard({ label, value, note, icon: Icon, tone }: { label: string; value: string; note: string; icon: typeof Boxes; tone: string }) {
  return <div className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span></div><p className="mt-3 text-[11px] font-medium text-slate-500">{note}</p></div>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">{text}</div>;
}

export default function AIIntelligenceClientView() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [branchId, setBranchId] = useState("");
  const [forecastDays, setForecastDays] = useState(30);
  const [overview, setOverview] = useState<AIOverview | null>(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [loyalty, setLoyalty] = useState<LoyaltyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: "assistant-welcome", sender: "assistant", text: "The Business Assistant workspace is reserved for conversational analytics. Inventory, pricing and loyalty models are available in their dedicated tabs.", timestamp: "Just now" }]);
  const [isPromptProcessing, setIsPromptProcessing] = useState(false);

  const loadOverview = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const query = new URLSearchParams({ forecastDays: String(forecastDays) });
      if (branchId) query.set("branchId", branchId);
      const result = await apiGet<AIOverview>(`/ai-intelligence/overview?${query}`);
      setOverview(result);
      setSelectedProductId((current) => result.products.some((product) => product.id === current) ? current : (result.products[0]?.id ?? ""));
      setSelectedCustomerId((current) => result.customers.some((customer) => customer.id === current) ? current : (result.customers[0]?.id ?? ""));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load AI intelligence.");
    } finally { setLoading(false); }
  }, [branchId, forecastDays]);

  useEffect(() => { void loadOverview(); }, [loadOverview]);
  const selectedProduct = useMemo(() => overview?.products.find((product) => product.id === selectedProductId) ?? null, [overview, selectedProductId]);
  const reorderProducts = overview?.products.filter((product) => product.forecast.stock_plan.status === "reorder_now") ?? [];
  const pricingOpportunities = overview?.products.filter((product) => product.pricing && product.pricing.decision !== "keep") ?? [];
  const averageRisk = overview?.products.length ? overview.products.reduce((sum, product) => sum + product.forecast.stock_plan.stockout_risk, 0) / overview.products.length : 0;
  const orderUnits = overview?.products.reduce((sum, product) => sum + product.forecast.stock_plan.recommended_order_quantity, 0) ?? 0;

  async function loadLoyalty() {
    if (!selectedCustomerId) return;
    setLoyaltyLoading(true); setError("");
    try { setLoyalty(await apiGet<LoyaltyResult>(`/ai-intelligence/loyalty/${selectedCustomerId}?topK=5`)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load recommendations."); }
    finally { setLoyaltyLoading(false); }
  }

  function submitAssistantPrompt(prompt: string) {
    setMessages((current) => [...current, { id: `user-${Date.now()}`, sender: "user", text: prompt, timestamp: "Just now" }]);
    setIsPromptProcessing(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: `assistant-${Date.now()}`, sender: "assistant", text: "This workspace is ready for the Business Assistant model integration. Your stock, price and loyalty models are already connected in the other tabs.", timestamp: "Just now" }]);
      setIsPromptProcessing(false);
    }, 500);
  }

  const tabs: Array<{ id: Tab; label: string; icon: typeof Boxes }> = [
    { id: "overview", label: "Overview", icon: BrainCircuit }, { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "pricing", label: "Dynamic Pricing", icon: Tags }, { id: "loyalty", label: "Loyalty", icon: Users },
    { id: "assistant", label: "Business Assistant", icon: Bot },
  ];

  return <main className="min-h-[calc(100vh-4rem)] bg-[var(--brand-app-bg)] p-4 sm:p-6"><div className="mx-auto max-w-[1600px] space-y-5">
    <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-green)]"><Sparkles className="h-4 w-4" /> LIVE MODEL INTELLIGENCE</div><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">AI Intelligence</h1><div className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Link href="/dashboard" className="hover:text-[var(--brand-green)]">Dashboard</Link><ChevronRight className="h-3 w-3" /><span>AI Intelligence</span></div></div>
      <div className="flex flex-wrap items-end gap-2"><label className="grid gap-1 text-[11px] font-semibold text-slate-500">Branch<select value={branchId} onChange={(event) => setBranchId(event.target.value)} className="h-10 min-w-44 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-[var(--brand-green)]"><option value="">All branches</option>{overview?.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label><label className="grid gap-1 text-[11px] font-semibold text-slate-500">Forecast horizon<select value={forecastDays} onChange={(event) => setForecastDays(Number(event.target.value))} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-[var(--brand-green)]"><option value={30}>30 days</option><option value={90}>90 days</option><option value={180}>6 months</option><option value={365}>1 year</option></select></label><button type="button" onClick={() => void loadOverview()} disabled={loading} className="flex h-10 items-center gap-2 rounded-xl bg-[var(--brand-green)] px-4 text-xs font-bold text-white disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh predictions</button></div>
    </header>
    <div className="flex gap-1 overflow-x-auto rounded-2xl border border-[var(--brand-stroke)] bg-white p-1.5 shadow-xs">{tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeTab === id ? "bg-[#025148] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}><Icon className="h-4 w-4" /> {label}</button>)}</div>
    {error && <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-bold">AI data could not be loaded</p><p className="mt-0.5 text-xs">{error}</p></div></div>}
    {loading && !overview ? <div className="flex min-h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white"><div className="text-center"><LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[var(--brand-green)]" /><p className="mt-3 text-sm font-semibold text-slate-600">Running POS predictions…</p></div></div> : null}
    {overview && activeTab === "overview" && <div className="space-y-5"><div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><div><p className="text-sm font-bold text-emerald-900">AI model connected</p><p className="text-xs text-emerald-700">Live POS data • {overview.observedDays} observed days • refreshed {new Date(overview.generatedAt).toLocaleString()}</p></div></div><span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-emerald-700 shadow-xs">FastAPI :8000</span></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Reorder now" value={String(reorderProducts.length)} note={`${overview.products.length} products analyzed`} icon={PackagePlus} tone="bg-rose-50 text-rose-600" /><KpiCard label="Average stockout risk" value={`${Math.round(averageRisk * 100)}%`} note="Across the selected branch scope" icon={AlertTriangle} tone="bg-amber-50 text-amber-600" /><KpiCard label="Suggested order units" value={number.format(orderUnits)} note="Lead time + review period target" icon={Boxes} tone="bg-sky-50 text-sky-600" /><KpiCard label="Price opportunities" value={String(pricingOpportunities.length)} note="Within margin and ±15% guardrails" icon={CircleDollarSign} tone="bg-emerald-50 text-emerald-600" /></div><ProductForecastPanel product={selectedProduct} products={overview.products} selectedProductId={selectedProductId} onSelect={setSelectedProductId} /></div>}
    {overview && activeTab === "inventory" && <InventoryTable products={overview.products} />}
    {overview && activeTab === "pricing" && <PricingTable products={overview.products} />}
    {overview && activeTab === "loyalty" && <div className="space-y-5"><div className="flex flex-col gap-3 rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs sm:flex-row sm:items-end"><label className="grid flex-1 gap-1.5 text-xs font-bold text-slate-700">Customer<select value={selectedCustomerId} onChange={(event) => { setSelectedCustomerId(event.target.value); setLoyalty(null); }} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[var(--brand-green)]">{overview.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.customerNumber} — {customer.firstName} {customer.lastName ?? ""}</option>)}</select></label><button type="button" disabled={!selectedCustomerId || loyaltyLoading} onClick={() => void loadLoyalty()} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#025148] px-5 text-xs font-bold text-white disabled:opacity-50">{loyaltyLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate recommendations</button></div>{loyalty ? <LoyaltyPanel value={loyalty} /> : <EmptyState text="Choose a customer and generate AI loyalty recommendations." />}</div>}
    {activeTab === "assistant" && <div className="space-y-4"><div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-800"><strong>Shared AI workspace:</strong> this section remains available for the AI Business Assistant your teammate is developing.</div><AIChatConversationView messages={messages} isProcessing={isPromptProcessing} /><AIAssistantPromptBar suggestedPrompts={["Summarize today’s business", "Show critical alerts", "Explain this week’s trend"]} onSubmitPrompt={submitAssistantPrompt} isProcessing={isPromptProcessing} /></div>}
  </div></main>;
}

function ProductForecastPanel({ product, products, selectedProductId, onSelect }: { product: ProductPrediction | null; products: ProductPrediction[]; selectedProductId: string; onSelect: (id: string) => void }) {
  if (!product) return <EmptyState text="No active products are available for forecasting." />;
  const plan = product.forecast.stock_plan;
  return <div className="grid gap-5 xl:grid-cols-[1.55fr_0.8fr]"><section className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-slate-900">Demand forecast</h2><p className="text-xs text-slate-500">Daily predicted demand using your current POS history</p></div><select value={selectedProductId} onChange={(event) => onSelect(event.target.value)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold outline-none focus:border-[var(--brand-green)]">{products.map((item) => <option key={item.id} value={item.id}>{item.sku} — {item.name}</option>)}</select></div><div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={product.forecast.daily.slice(0, 90)} margin={{ left: -18, right: 12 }}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(value: string) => value.slice(5)} minTickGap={28} /><YAxis tick={{ fontSize: 10 }} /><Tooltip formatter={(value) => [number.format(Number(value)), "Demand"]} /><Line type="monotone" dataKey="predicted_demand" stroke="#0E9384" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} /></LineChart></ResponsiveContainer></div></section><section className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-slate-500">{product.sku}</p><h2 className="font-bold text-slate-900">{product.name}</h2></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle[plan.status]}`}>{plan.status.replace("_", " ")}</span></div><div className="mt-5 grid grid-cols-2 gap-3">{[["Current stock", plan.current_stock], ["7-day demand", product.forecast.summary.next_7_days_demand], ["30-day demand", product.forecast.summary.next_30_days_demand], ["Order quantity", plan.recommended_order_quantity]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-semibold text-slate-500">{label}</p><p className="mt-1 text-lg font-bold text-slate-900">{number.format(Number(value))}</p></div>)}</div><div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3"><p className="text-xs font-bold text-amber-800">Confidence: {product.forecast.data_readiness.confidence}</p><p className="mt-1 text-[11px] leading-5 text-amber-700">{product.forecast.data_readiness.recommended_action}</p></div>{plan.recommended_order_quantity > 0 && <Link href={`/purchases/create-order?productId=${product.id}`} className="mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--brand-green)] text-xs font-bold text-white"><PackagePlus className="h-4 w-4" /> Create purchase order</Link>}</section></div>;
}

function InventoryTable({ products }: { products: ProductPrediction[] }) {
  const sorted = [...products].sort((a, b) => b.forecast.stock_plan.stockout_risk - a.forecast.stock_plan.stockout_risk);
  return <section className="overflow-hidden rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xs"><div className="p-5"><h2 className="font-bold text-slate-900">Predictive restock plan</h2><p className="mt-1 text-xs text-slate-500">Recommendations remain approval-based until the model is retrained on sufficient TechNova history.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="border-y border-slate-200 bg-slate-50 text-slate-500"><tr>{["Product", "Stock", "Next 7 days", "Reorder point", "Suggested order", "Risk", "Status", "Action"].map((heading) => <th key={heading} className="px-5 py-3 font-bold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{sorted.map((product) => { const plan = product.forecast.stock_plan; return <tr key={product.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="font-bold text-slate-900">{product.name}</p><p className="mt-0.5 font-mono text-[10px] text-slate-500">{product.sku}</p></td><td className="px-5 py-4 font-semibold">{number.format(plan.current_stock)}</td><td className="px-5 py-4">{number.format(product.forecast.summary.next_7_days_demand)}</td><td className="px-5 py-4">{number.format(plan.reorder_point)}</td><td className="px-5 py-4 font-bold text-[var(--brand-green)]">{number.format(plan.recommended_order_quantity)}</td><td className="px-5 py-4">{Math.round(plan.stockout_risk * 100)}%</td><td className="px-5 py-4"><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle[plan.status]}`}>{plan.status.replace("_", " ")}</span></td><td className="px-5 py-4"><Link href={`/purchases/create-order?productId=${product.id}`} className="font-bold text-[var(--brand-green)] hover:underline">Create order</Link></td></tr>; })}</tbody></table></div></section>;
}

function PricingTable({ products }: { products: ProductPrediction[] }) {
  const priced = products.filter((product) => product.pricing);
  if (!priced.length) return <EmptyState text="Pricing recommendations require products with valid cost and selling prices." />;
  return <section className="overflow-hidden rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xs"><div className="flex items-start justify-between gap-4 p-5"><div><h2 className="font-bold text-slate-900">Dynamic pricing recommendations</h2><p className="mt-1 text-xs text-slate-500">Advisory only — no product price is changed automatically.</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">10% minimum margin • ±15% limit</span></div><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-xs"><thead className="border-y border-slate-200 bg-slate-50 text-slate-500"><tr>{["Product", "Current", "Recommended", "Change", "Expected demand", "Expected profit/day", "Decision", "Review"].map((heading) => <th key={heading} className="px-5 py-3 font-bold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{priced.map((product) => { const price = product.pricing!; const rising = price.price_change_rate > 0; return <tr key={product.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="font-bold text-slate-900">{product.name}</p><p className="font-mono text-[10px] text-slate-500">{product.sku}</p></td><td className="px-5 py-4">{currency.format(price.current_price)}</td><td className="px-5 py-4 font-bold text-slate-900">{currency.format(price.recommended_price)}</td><td className={`px-5 py-4 font-bold ${rising ? "text-emerald-600" : price.price_change_rate < 0 ? "text-rose-600" : "text-slate-500"}`}><span className="flex items-center gap-1">{rising ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}{(price.price_change_rate * 100).toFixed(1)}%</span></td><td className="px-5 py-4">{number.format(price.expected_daily_demand)}</td><td className="px-5 py-4">{currency.format(price.expected_daily_profit)}</td><td className="px-5 py-4 capitalize">{price.decision}</td><td className="px-5 py-4"><Link href={`/products/product-list/${product.id}`} className="font-bold text-[var(--brand-green)] hover:underline">Review product</Link></td></tr>; })}</tbody></table></div></section>;
}

function LoyaltyPanel({ value }: { value: LoyaltyResult }) {
  return <div className="grid gap-5 xl:grid-cols-[0.65fr_1.35fr]"><section className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Users className="h-5 w-5" /></span><div><p className="text-xs text-slate-500">{value.customer.customerNumber}</p><h2 className="font-bold text-slate-900">{value.customer.firstName} {value.customer.lastName ?? ""}</h2></div></div><div className="mt-5 grid grid-cols-2 gap-3">{[["Segment", value.profile.segment.replaceAll("_", " ")], ["Loyalty score", number.format(value.profile.loyalty_score)], ["Orders", number.format(value.profile.order_count)], ["Last purchase", `${value.profile.recency_days} days`]].map(([label, display]) => <div key={String(label)} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-semibold text-slate-500">{label}</p><p className="mt-1 text-sm font-bold capitalize text-slate-900">{display}</p></div>)}</div><p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] leading-5 text-amber-700"><Clock3 className="mt-0.5 h-4 w-4 shrink-0" />New POS customer IDs use the model’s popularity fallback until the model is retrained with local customer history.</p></section><section className="overflow-hidden rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xs"><div className="p-5"><h2 className="font-bold text-slate-900">Recommended products</h2><p className="mt-1 text-xs text-slate-500">Ranked by the loyalty recommendation model</p></div><div className="divide-y divide-slate-100">{value.recommendations.map((item, index) => <div key={`${item.product_id}-${index}`} className="flex items-center gap-4 px-5 py-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{item.description}</p><p className="mt-0.5 text-[10px] text-slate-500">{item.product_id} • {item.reason.replaceAll("_", " ")}</p></div><span className="text-xs font-bold text-[var(--brand-green)]">{Math.round(item.score * 100)}%</span></div>)}</div></section></div>;
}
