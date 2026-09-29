"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LoaderCircle,
  PackagePlus,
  RefreshCw,
  Sparkles,
  Tags,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiGet, apiPost } from "@/lib/api/client";
import RevenueForecastChartCard from "./RevenueForecastChartCard";
import RecommendationPanel from "./RecommendationPanel";
import BusinessAssistantPanel from "./BusinessAssistantPanel";
import type {
  AIOverview,
  DemandForecastHorizon,
  DemandForecastPayload,
  DemandForecastResponse,
  LoyaltyResult,
  ProductPrediction,
  SalesForecastHorizon,
} from "./ai-intelligence.types";

type Tab =
  | "overview"
  | "sales"
  | "demand"
  | "inventory"
  | "pricing"
  | "loyalty"
  | "recommendations"
  | "assistant";
const currency = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});
const number = new Intl.NumberFormat("en-LK", { maximumFractionDigits: 1 });
const statusStyle = {
  reorder_now: "bg-rose-50 text-rose-700 border-rose-200",
  monitor: "bg-amber-50 text-amber-700 border-amber-200",
  healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function KpiCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Boxes;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-[11px] font-medium text-slate-500">{note}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}



export default function AIIntelligenceClientView() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [salesTabVisited, setSalesTabVisited] = useState(false);
  const [demandTabVisited, setDemandTabVisited] = useState(false);
  const [recommendationsTabVisited, setRecommendationsTabVisited] =
    useState(false);
  const [branchId, setBranchId] = useState("");
  const [forecastDays, setForecastDays] = useState(30);
  const [salesForecastHorizon, setSalesForecastHorizon] =
    useState<SalesForecastHorizon>(7);
  const [demandForecast, setDemandForecast] =
    useState<DemandForecastResponse | null>(null);
  const [demandForecastLoading, setDemandForecastLoading] = useState(false);
  const [demandForecastError, setDemandForecastError] = useState<string | null>(
    null,
  );
  const [demandHorizon, setDemandHorizon] = useState<DemandForecastHorizon>(7);
  const [overview, setOverview] = useState<AIOverview | null>(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [loyalty, setLoyalty] = useState<LoyaltyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFetchedDemandKey, setLastFetchedDemandKey] = useState<string>("");

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({ forecastDays: String(forecastDays) });
      if (branchId) query.set("branchId", branchId);
      const result = await apiGet<AIOverview>(
        `/ai-intelligence/overview?${query}`,
      );
      setOverview(result);
      setSelectedProductId((current) =>
        result.products.some((product) => product.id === current)
          ? current
          : (result.products[0]?.id ?? ""),
      );
      setSelectedCustomerId((current) =>
        result.customers.some((customer) => customer.id === current)
          ? current
          : (result.customers[0]?.id ?? ""),
      );
      setLastFetchedDemandKey("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to load AI intelligence.",
      );
    } finally {
      setLoading(false);
    }
  }, [branchId, forecastDays]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);
  const selectedProduct = useMemo(
    () =>
      overview?.products.find((product) => product.id === selectedProductId) ??
      null,
    [overview, selectedProductId],
  );

  const fetchDemandForecast = useCallback(async () => {
    if (activeTab !== "demand") return;
    if (!selectedProduct) {
      setDemandForecast(null);
      setDemandForecastError(null);
      setLastFetchedDemandKey("");
      return;
    }

    // Require a real branch selection — never silently fall back to the first branch.
    if (!branchId) {
      setDemandForecast(null);
      setDemandForecastError(
        "Demand forecast unavailable. Please select a specific branch to run the forecast.",
      );
      setLastFetchedDemandKey("");
      return;
    }

    // Require a real current price — never use invented fallback values.
    const baseUnitPrice =
      selectedProduct.currentPrice > 0
        ? selectedProduct.currentPrice
        : (selectedProduct.pricing?.current_price ?? 0);

    if (!baseUnitPrice || baseUnitPrice <= 0) {
      setDemandForecast(null);
      setDemandForecastError(
        "Demand forecast unavailable. Insufficient real TechNova product or branch data.",
      );
      setLastFetchedDemandKey("");
      return;
    }

    const currentKey = `${selectedProduct.id}_${branchId}_${demandHorizon}`;
    if (lastFetchedDemandKey === currentKey && demandForecast) {
      return;
    }

    setDemandForecastLoading(true);
    setDemandForecastError(null);

    try {
      const unitPrice =
        selectedProduct.pricing?.recommended_price ?? baseUnitPrice;

      // Use only a real category value supplied by the product object.
      // Do not infer category from the product name.
      const realCategory = (
        (selectedProduct as unknown) as Record<string, unknown>
      ).category as string | undefined;

      const payload: DemandForecastPayload = {
        product_id: selectedProduct.sku || selectedProduct.id,
        productId: selectedProduct.id,
        store_id: branchId,
        storeId: branchId,
        branchId,
        base_unit_price: baseUnitPrice,
        baseUnitPrice,
        unit_price: unitPrice,
        unitPrice,
        horizon: demandHorizon,
        forecastHorizon: demandHorizon,
        ...(realCategory ? { category: realCategory } : {}),
      };

      const result = await apiPost<DemandForecastResponse>(
        "/ai-intelligence/demand-forecast/forecast",
        payload,
      );

      setDemandForecast(result);
      setLastFetchedDemandKey(currentKey);
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Unable to load demand forecast.";
      setDemandForecastError(message);
      setDemandForecast(null);
    } finally {
      setDemandForecastLoading(false);
    }
  }, [
    activeTab,
    selectedProduct,
    branchId,
    demandHorizon,
    demandForecast,
    lastFetchedDemandKey,
  ]);

  useEffect(() => {
    if (activeTab === "sales") {
      setSalesTabVisited(true);
    } else if (activeTab === "demand") {
      setDemandTabVisited(true);
      void fetchDemandForecast();
    } else if (activeTab === "recommendations") {
      setRecommendationsTabVisited(true);
    }
  }, [activeTab, fetchDemandForecast]);
  const reorderProducts =
    overview?.products.filter(
      (product) => product.forecast.stock_plan.status === "reorder_now",
    ) ?? [];
  const pricingOpportunities =
    overview?.products.filter(
      (product) => product.pricing && product.pricing.decision !== "keep",
    ) ?? [];
  const averageRisk = overview?.products.length
    ? overview.products.reduce(
        (sum, product) => sum + product.forecast.stock_plan.stockout_risk,
        0,
      ) / overview.products.length
    : 0;
  const orderUnits =
    overview?.products.reduce(
      (sum, product) =>
        sum + product.forecast.stock_plan.recommended_order_quantity,
      0,
    ) ?? 0;

  async function loadLoyalty() {
    if (!selectedCustomerId) return;
    setLoyaltyLoading(true);
    setError("");
    try {
      setLoyalty(
        await apiGet<LoyaltyResult>(
          `/ai-intelligence/loyalty/${selectedCustomerId}?topK=5`,
        ),
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to load recommendations.",
      );
    } finally {
      setLoyaltyLoading(false);
    }
  }

  const tabs: Array<{ id: Tab; label: string; icon: typeof Boxes }> = [
    { id: "overview", label: "Overview", icon: BrainCircuit },
    { id: "sales", label: "Sales Forecast", icon: CircleDollarSign },
    { id: "demand", label: "Demand Forecast", icon: TrendingUp },
    { id: "inventory", label: "Inventory", icon: Boxes },
    { id: "pricing", label: "Dynamic Pricing", icon: Tags },
    { id: "loyalty", label: "Loyalty", icon: Users },
    { id: "recommendations", label: "Recommendations", icon: Sparkles },
    { id: "assistant", label: "Business Assistant", icon: Bot },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] w-full min-w-0 bg-[var(--brand-app-bg)] p-4 transition-[width] duration-200 sm:p-6">
      <div className="w-full min-w-0 space-y-5">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-green)]">
              <Sparkles className="h-4 w-4" /> LIVE MODEL INTELLIGENCE
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              AI Intelligence
            </h1>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              <Link
                href="/dashboard"
                className="hover:text-[var(--brand-green)]"
              >
                Dashboard
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span>AI Intelligence</span>
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <label className="grid gap-1 text-[11px] font-semibold text-slate-500">
              Branch
              <select
                value={branchId}
                onChange={(event) => setBranchId(event.target.value)}
                className="h-10 min-w-44 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-[var(--brand-green)]"
              >
                <option value="">All branches</option>
                {overview?.branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-[11px] font-semibold text-slate-500">
              Forecast horizon
              <select
                value={forecastDays}
                onChange={(event) =>
                  setForecastDays(Number(event.target.value))
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-[var(--brand-green)]"
              >
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={180}>6 months</option>
                <option value={365}>1 year</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => void loadOverview()}
              disabled={loading}
              className="flex h-10 items-center gap-2 rounded-xl bg-[var(--brand-green)] px-4 text-xs font-bold text-white disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />{" "}
              Refresh predictions
            </button>
          </div>
        </header>
        <div className="flex gap-1 overflow-x-auto rounded-2xl border border-[var(--brand-stroke)] bg-white p-1.5 shadow-xs">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeTab === id ? "bg-[#025148] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">AI data could not be loaded</p>
              <p className="mt-0.5 text-xs">{error}</p>
            </div>
          </div>
        )}
        {loading && !overview ? (
          <div className="flex min-h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[var(--brand-green)]" />
              <p className="mt-3 text-sm font-semibold text-slate-600">
                Running POS predictions…
              </p>
            </div>
          </div>
        ) : null}
        {overview && activeTab === "overview" && (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-900">
                    AI Intelligence Overview
                  </p>
                  <p className="text-xs text-emerald-700">
                    Live POS intelligence • {overview.observedDays} observed
                    days across {overview.branches.length} branches • refreshed{" "}
                    {new Date(overview.generatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-emerald-700 shadow-xs">
                FastAPI :8000
              </span>
            </div>

            {/* Executive KPI Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                label="Reorder now"
                value={String(reorderProducts.length)}
                note={`${overview.products.length} products analyzed`}
                icon={PackagePlus}
                tone="bg-rose-50 text-rose-600"
              />
              <KpiCard
                label="Average stockout risk"
                value={`${Math.round(averageRisk * 100)}%`}
                note="Across the selected branch scope"
                icon={AlertTriangle}
                tone="bg-amber-50 text-amber-600"
              />
              <KpiCard
                label="Suggested order units"
                value={number.format(orderUnits)}
                note="Lead time + review period target"
                icon={Boxes}
                tone="bg-sky-50 text-sky-600"
              />
              <KpiCard
                label="Price opportunities"
                value={String(pricingOpportunities.length)}
                note="Within margin and ±15% guardrails"
                icon={CircleDollarSign}
                tone="bg-emerald-50 text-emerald-600"
              />
            </div>

            {/* Specialized Forecasting Modules Overview */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <CircleDollarSign className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Sales Revenue Forecast
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Store-level revenue predictions across 7 / 14 / 30 day
                        horizons
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("sales")}
                    className="flex items-center gap-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-bold text-[#025148] transition hover:bg-slate-100"
                  >
                    Open tab <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  Forecasting future store gross revenue in <strong>LKR</strong>{" "}
                  based on historical sales velocity, calendar cycles, and
                  promotional lift.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <TrendingUp className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Product Demand Forecast
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        SKU-level physical unit demand predictions via LightGBM
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("demand")}
                    className="flex items-center gap-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-bold text-[#025148] transition hover:bg-slate-100"
                  >
                    Open tab <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  Predicts physical <strong>units sold</strong> for individual
                  catalog items to guide procurement, replenishment, and safety
                  stock calculation.
                </p>
              </div>
            </div>

            {/* Critical Low-Stock & Reorder Alerts */}
            <div className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Critical restock alerts
                  </h3>
                  <p className="text-xs text-slate-500">
                    Items requiring immediate reordering to prevent stockout
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("inventory")}
                  className="text-xs font-bold text-[var(--brand-green)] hover:underline"
                >
                  View full inventory ({overview.products.length})
                </button>
              </div>
              {reorderProducts.length > 0 ? (
                <div className="mt-3 divide-y divide-slate-100">
                  {reorderProducts.slice(0, 4).map((product) => {
                    const plan = product.forecast.stock_plan;
                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {product.sku} • Stock:{" "}
                            {number.format(plan.current_stock)} units
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-rose-700">
                            {Math.round(plan.stockout_risk * 100)}% risk
                          </span>
                          <Link
                            href={`/purchases/create-order?productId=${product.id}`}
                            className="rounded-lg bg-[var(--brand-green)] px-2.5 py-1 text-[11px] font-bold text-white hover:opacity-90"
                          >
                            Order{" "}
                            {number.format(plan.recommended_order_quantity)}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-500">
                  All products currently have healthy stock levels.
                </p>
              )}
            </div>
          </div>
        )}
        {salesTabVisited && overview && (
          <div className={activeTab === "sales" ? "space-y-5" : "hidden"}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Sales Forecast
                </h2>
                <p className="text-xs text-slate-500">
                  Future store sales revenue prediction across horizons (LKR)
                </p>
              </div>
            </div>
            <RevenueForecastChartCard
              branchId={branchId || overview?.branches?.[0]?.id}
              forecastHorizon={salesForecastHorizon}
              onForecastHorizonChange={setSalesForecastHorizon}
            />
          </div>
        )}
        {demandTabVisited && overview && (
          <div className={activeTab === "demand" ? "space-y-5" : "hidden"}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Demand Forecast
                </h2>
                <p className="text-xs text-slate-500">
                  AI-powered product physical unit demand prediction
                </p>
              </div>
            </div>
            <ProductForecastPanel
              product={selectedProduct}
              products={overview.products}
              selectedProductId={selectedProductId}
              onSelect={setSelectedProductId}
              demandForecast={demandForecast}
              demandForecastLoading={demandForecastLoading}
              demandForecastError={demandForecastError}
              demandHorizon={demandHorizon}
              onDemandHorizonChange={setDemandHorizon}
            />
          </div>
        )}
        {overview && activeTab === "inventory" && (
          <InventoryTable products={overview.products} />
        )}
        {overview && activeTab === "pricing" && (
          <PricingTable products={overview.products} />
        )}
        {overview && activeTab === "loyalty" && (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs sm:flex-row sm:items-end">
              <label className="grid flex-1 gap-1.5 text-xs font-bold text-slate-700">
                Customer
                <select
                  value={selectedCustomerId}
                  onChange={(event) => {
                    setSelectedCustomerId(event.target.value);
                    setLoyalty(null);
                  }}
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[var(--brand-green)]"
                >
                  {overview.customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customerNumber} — {customer.firstName}{" "}
                      {customer.lastName ?? ""}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                disabled={!selectedCustomerId || loyaltyLoading}
                onClick={() => void loadLoyalty()}
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#025148] px-5 text-xs font-bold text-white disabled:opacity-50"
              >
                {loyaltyLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}{" "}
                Generate recommendations
              </button>
            </div>
            {loyalty ? (
              <LoyaltyPanel value={loyalty} />
            ) : (
              <EmptyState text="Choose a customer and generate AI loyalty recommendations." />
            )}
          </div>
        )}
        {recommendationsTabVisited && (
          <div
            className={activeTab === "recommendations" ? "space-y-5" : "hidden"}
          >
            <RecommendationPanel
              overview={overview}
              selectedBranchId={branchId}
            />
          </div>
        )}
        {activeTab === "assistant" && (
          <BusinessAssistantPanel
            branchId={branchId}
            branchName={overview?.branches.find((b) => b.id === branchId)?.name}
          />
        )}
      </div>
    </main>
  );
}

function ProductForecastPanel({
  product,
  products,
  selectedProductId,
  onSelect,
  demandForecast,
  demandForecastLoading,
  demandForecastError,
  demandHorizon = 7,
  onDemandHorizonChange,
}: {
  product: ProductPrediction | null;
  products: ProductPrediction[];
  selectedProductId: string;
  onSelect: (id: string) => void;
  demandForecast?: DemandForecastResponse | null;
  demandForecastLoading?: boolean;
  demandForecastError?: string | null;
  demandHorizon?: DemandForecastHorizon;
  onDemandHorizonChange?: (horizon: DemandForecastHorizon) => void;
}) {
  const chartData = useMemo(() => {
    if (!demandForecast?.predictions?.length) return [];
    return demandForecast.predictions.map((p) => {
      const [year, month, day] = p.forecast_date.split("-").map(Number);
      const dateObj = new Date(year, (month || 1) - 1, day || 1);
      const isValid = !isNaN(dateObj.getTime());
      const dateLabel = isValid
        ? dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : p.forecast_date.slice(5);
      const fullDate = isValid
        ? dateObj.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : p.forecast_date;
      return {
        ...p,
        dateLabel,
        fullDate,
      };
    });
  }, [demandForecast]);

  if (!product)
    return (
      <EmptyState text="No active products are available for forecasting." />
    );
  const plan = product.forecast.stock_plan;

  const totalDemand =
    demandForecast?.total_predicted_units != null
      ? demandForecast.total_predicted_units
      : (demandForecast?.predicted_units ?? 0);
  const avgDailyDemand =
    demandHorizon > 0 && demandForecast ? totalDemand / demandHorizon : 0;

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,0.8fr)]">
      <section className="min-w-0 rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900">Demand forecast</h2>
              {demandForecastLoading && (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[var(--brand-green)]" />
              )}
            </div>
            <p className="text-xs text-slate-500">
              Physical unit demand predicted by trained LightGBM model
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedProductId}
              onChange={(event) => onSelect(event.target.value)}
              className="h-9 min-w-0 max-w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold outline-none focus:border-[var(--brand-green)]"
            >
              {products.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.sku} — {item.name}
                </option>
              ))}
            </select>
            {onDemandHorizonChange && (
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-0.5">
                {([7, 14, 30] as const).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => onDemandHorizonChange(h)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      demandHorizon === h
                        ? "bg-white text-[#025148] shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {h} Days
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {demandForecast?.model_metadata && chartData.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-bold uppercase text-emerald-800">
              {demandForecast.model_metadata.model_type}
            </span>
            <span>•</span>
            <span>
              Target:{" "}
              <strong className="text-slate-800">
                {demandForecast.model_metadata.target}
              </strong>
            </span>
            {demandForecast.model_metadata.feature_count != null && (
              <>
                <span>•</span>
                <span>
                  Features:{" "}
                  <strong className="text-slate-800">
                    {demandForecast.model_metadata.feature_count}
                  </strong>
                </span>
              </>
            )}
            <span>•</span>
            <span>
              Horizon:{" "}
              <strong className="text-slate-800">
                {demandForecast.horizon} days
              </strong>
            </span>
            <span>•</span>
            <span>
              Total:{" "}
              <strong className="text-[#025148]">
                {number.format(totalDemand)} units
              </strong>
            </span>
          </div>
        )}

        {demandForecastError && (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
            <div>
              <p className="font-bold">Demand forecast unavailable</p>
              <p className="mt-0.5 text-[11px]">{demandForecastError}</p>
            </div>
          </div>
        )}

        <div className="mt-5 h-72 min-w-0">
          {demandForecastLoading ? (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-center">
              <LoaderCircle className="h-7 w-7 animate-spin text-[var(--brand-green)]" />
              <p className="mt-2 text-xs font-semibold text-slate-600">
                Calculating {demandHorizon}-day demand forecast…
              </p>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ left: -18, right: 12, top: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  minTickGap={20}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  allowDecimals={true}
                />
                <Tooltip
                  formatter={(value) => [
                    `${number.format(Number(value))} units`,
                    "Predicted Demand",
                  ]}
                  labelFormatter={(_, payload) => {
                    const item = payload?.[0]?.payload;
                    return item?.fullDate ?? "";
                  }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "0.75rem",
                    border: "1px solid var(--brand-stroke, #e2e8f0)",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted_units"
                  stroke="#0E9384"
                  strokeWidth={2.5}
                  dot={{
                    r: demandHorizon <= 7 ? 3.5 : 2,
                    fill: "#0E9384",
                    stroke: "#ffffff",
                    strokeWidth: 1.5,
                  }}
                  activeDot={{
                    r: 5,
                    fill: "#0E9384",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
              <Boxes className="h-6 w-6 text-slate-400" />
              <p className="mt-2 text-xs font-semibold text-slate-600">
                No demand predictions available
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Select a product and branch to load the {demandHorizon}-day
                demand forecast.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="min-w-0 rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">
              {product.sku}
            </p>
            <h2 className="truncate font-bold text-slate-900">
              {product.name}
            </h2>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle[plan.status]}`}
          >
            {plan.status.replace("_", " ")}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            ["Current stock", number.format(plan.current_stock)],
            [
              `${demandHorizon}-day demand`,
              chartData.length > 0 ? `${number.format(totalDemand)} units` : "—",
            ],
            [
              "Daily avg demand",
              chartData.length > 0 ? `${number.format(avgDailyDemand)} units` : "—",
            ],
            ["Order quantity", number.format(plan.recommended_order_quantity)],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="min-w-0 rounded-xl bg-slate-50 p-3"
            >
              <p className="text-[10px] font-semibold text-slate-500">
                {label}
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        {chartData.length > 0 && demandForecast?.model_metadata && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                {demandForecast.model_metadata.model_type} •{" "}
                {demandForecast.model_metadata.target}
              </p>
              <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-emerald-700 shadow-2xs border border-emerald-200">
                Live Inference
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-5 text-emerald-700">
              Product demand predicted using{" "}
              {demandForecast.model_metadata.feature_count ?? ""} retail
              features across a {demandHorizon}-day horizon.
            </p>
          </div>
        )}

        {plan.recommended_order_quantity > 0 && (
          <Link
            href={`/purchases/create-order?productId=${product.id}`}
            className="mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--brand-green)] text-xs font-bold text-white"
          >
            <PackagePlus className="h-4 w-4" /> Create purchase order
          </Link>
        )}
      </section>
    </div>
  );
}

function InventoryTable({ products }: { products: ProductPrediction[] }) {
  const sorted = [...products].sort(
    (a, b) =>
      b.forecast.stock_plan.stockout_risk - a.forecast.stock_plan.stockout_risk,
  );
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xs">
      <div className="p-5">
        <h2 className="font-bold text-slate-900">Predictive restock plan</h2>
        <p className="mt-1 text-xs text-slate-500">
          Recommendations remain approval-based until the model is retrained on
          sufficient TechNova history.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-xs">
          <thead className="border-y border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              {[
                "Product",
                "Stock",
                "Next 7 days",
                "Reorder point",
                "Suggested order",
                "Risk",
                "Status",
                "Action",
              ].map((heading) => (
                <th key={heading} className="px-5 py-3 font-bold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((product) => {
              const plan = product.forecast.stock_plan;
              return (
                <tr key={product.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{product.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                      {product.sku}
                    </p>
                  </td>
                  <td className="px-5 py-4 font-semibold">
                    {number.format(plan.current_stock)}
                  </td>
                  <td className="px-5 py-4">
                    {number.format(product.forecast.summary.next_7_days_demand)}
                  </td>
                  <td className="px-5 py-4">
                    {number.format(plan.reorder_point)}
                  </td>
                  <td className="px-5 py-4 font-bold text-[var(--brand-green)]">
                    {number.format(plan.recommended_order_quantity)}
                  </td>
                  <td className="px-5 py-4">
                    {Math.round(plan.stockout_risk * 100)}%
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyle[plan.status]}`}
                    >
                      {plan.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/purchases/create-order?productId=${product.id}`}
                      className="font-bold text-[var(--brand-green)] hover:underline"
                    >
                      Create order
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PricingTable({ products }: { products: ProductPrediction[] }) {
  const priced = products.filter((product) => product.pricing);
  if (!priced.length)
    return (
      <EmptyState text="Pricing recommendations require products with valid cost and selling prices." />
    );
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xs">
      <div className="flex items-start justify-between gap-4 p-5">
        <div>
          <h2 className="font-bold text-slate-900">
            Dynamic pricing recommendations
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Advisory only — no product price is changed automatically.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
          10% minimum margin • ±15% limit
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-xs">
          <thead className="border-y border-slate-200 bg-slate-50 text-slate-500">
            <tr>
              {[
                "Product",
                "Current",
                "Recommended",
                "Change",
                "Expected demand",
                "Expected profit/day",
                "Decision",
                "Review",
              ].map((heading) => (
                <th key={heading} className="px-5 py-3 font-bold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {priced.map((product) => {
              const price = product.pricing!;
              const rising = price.price_change_rate > 0;
              return (
                <tr key={product.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{product.name}</p>
                    <p className="font-mono text-[10px] text-slate-500">
                      {product.sku}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    {currency.format(price.current_price)}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900">
                    {currency.format(price.recommended_price)}
                  </td>
                  <td
                    className={`px-5 py-4 font-bold ${rising ? "text-emerald-600" : price.price_change_rate < 0 ? "text-rose-600" : "text-slate-500"}`}
                  >
                    <span className="flex items-center gap-1">
                      {rising ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                      {(price.price_change_rate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {number.format(price.expected_daily_demand)}
                  </td>
                  <td className="px-5 py-4">
                    {currency.format(price.expected_daily_profit)}
                  </td>
                  <td className="px-5 py-4 capitalize">{price.decision}</td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/products/product-list/${product.id}`}
                      className="font-bold text-[var(--brand-green)] hover:underline"
                    >
                      Review product
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function LoyaltyPanel({ value }: { value: LoyaltyResult }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.65fr_1.35fr]">
      <section className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-slate-500">
              {value.customer.customerNumber}
            </p>
            <h2 className="font-bold text-slate-900">
              {value.customer.firstName} {value.customer.lastName ?? ""}
            </h2>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            ["Segment", value.profile.segment.replaceAll("_", " ")],
            ["Loyalty score", number.format(value.profile.loyalty_score)],
            ["Orders", number.format(value.profile.order_count)],
            ["Last purchase", `${value.profile.recency_days} days`],
          ].map(([label, display]) => (
            <div key={String(label)} className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-semibold text-slate-500">
                {label}
              </p>
              <p className="mt-1 text-sm font-bold capitalize text-slate-900">
                {display}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] leading-5 text-amber-700">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
          New POS customer IDs use the model’s popularity fallback until the
          model is retrained with local customer history.
        </p>
      </section>
      <section className="overflow-hidden rounded-2xl border border-[var(--brand-stroke)] bg-white shadow-xs">
        <div className="p-5">
          <h2 className="font-bold text-slate-900">Recommended products</h2>
          <p className="mt-1 text-xs text-slate-500">
            Ranked by the loyalty recommendation model
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {value.recommendations.map((item, index) => (
            <div
              key={`${item.product_id}-${index}`}
              className="flex items-center gap-4 px-5 py-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">
                  {item.description}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  {item.product_id} • {item.reason.replaceAll("_", " ")}
                </p>
              </div>
              <span className="text-xs font-bold text-[var(--brand-green)]">
                {Math.round(item.score * 100)}%
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
