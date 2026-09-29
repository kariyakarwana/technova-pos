"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Compass,
  Flame,
  LoaderCircle,
  Package,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Users,
} from "lucide-react";
import { apiGetRecommendations } from "@/lib/api/client";
import type {
  AIOverview,
  RecommendationContext,
  RecommendationRequest,
  RecommendationResponse,
} from "./ai-intelligence.types";

const currency = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("en-LK", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const REASON_LABELS: Record<string, string> = {
  FREQUENTLY_BOUGHT_TOGETHER: "Frequently bought together",
  BRANCH_POPULAR: "Popular at this branch",
  CUSTOMER_HISTORY_AFFINITY: "Based on customer purchase history",
  SIMILAR_PRODUCT: "Similar product",
  TRENDING_ACCELERATION: "Trending recently",
  COMPATIBLE_ACCESSORY: "Compatible accessory",
  POPULAR_FALLBACK: "Popular choice",
};

const CONTEXT_OPTIONS: Array<{
  id: RecommendationContext;
  label: string;
  shortLabel: string;
  icon: typeof Sparkles;
  description: string;
}> = [
  {
    id: "PRODUCT",
    label: "Product Recommendations",
    shortLabel: "Product",
    icon: ShoppingBag,
    description: "Frequently Bought Together, similar products, and compatible accessories",
  },
  {
    id: "CUSTOMER",
    label: "Customer Recommendations",
    shortLabel: "Customer",
    icon: Users,
    description: "Personalized recommendations driven by customer purchase affinity",
  },
  {
    id: "TRENDING",
    label: "Trending Products",
    shortLabel: "Trending",
    icon: Flame,
    description: "High-velocity sales acceleration across recent transaction windows",
  },
  {
    id: "COLD_START",
    label: "Popular Products",
    shortLabel: "Popular",
    icon: Compass,
    description: "Top-performing items across branches for new customers or cold start",
  },
  {
    id: "BRANCH",
    label: "Branch Recommendations",
    shortLabel: "Branch",
    icon: Boxes,
    description: "Branch inventory-aware popular products tailored to local store demand",
  },
  {
    id: "CART_READY",
    label: "Cart Recommendations",
    shortLabel: "Cart Ready",
    icon: ShoppingCart,
    description: "Cart-ready cross-sell recommendations tailored to multi-item baskets",
  },
];

interface RecommendationPanelProps {
  overview: AIOverview | null;
  selectedBranchId?: string;
}

export default function RecommendationPanel({
  overview,
  selectedBranchId,
}: RecommendationPanelProps) {
  const [context, setContext] = useState<RecommendationContext>("PRODUCT");
  const [topN, setTopN] = useState<number>(5);
  const [includeSubstitutes, setIncludeSubstitutes] = useState<boolean>(false);

  // Entities initialized from real overview data or empty
  const [productId, setProductId] = useState<string>(
    () => overview?.products?.[0]?.sku || overview?.products?.[0]?.id || "",
  );
  const [customerId, setCustomerId] = useState<string>(
    () => overview?.customers?.[0]?.customerNumber || overview?.customers?.[0]?.id || "",
  );
  const [branchId, setBranchId] = useState<string>(
    () => selectedBranchId || overview?.branches?.[0]?.id || "",
  );
  const [cartProductIds, setCartProductIds] = useState<string[]>([]);

  // Request State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<RecommendationResponse | null>(null);
  const [lastFetchedKey, setLastFetchedKey] = useState<string>("");

  // Keep branch in sync if parent changes
  useEffect(() => {
    if (selectedBranchId) {
      setBranchId(selectedBranchId);
    } else if (!branchId && overview?.branches?.length) {
      setBranchId(overview.branches[0].id);
    }
  }, [selectedBranchId, overview?.branches, branchId]);

  // Keep product in sync when overview loads
  useEffect(() => {
    if (!productId && overview?.products?.length) {
      setProductId(overview.products[0].sku || overview.products[0].id);
    }
  }, [overview?.products, productId]);

  // Keep customer in sync when overview loads
  useEffect(() => {
    if (!customerId && overview?.customers?.length) {
      setCustomerId(overview.customers[0].customerNumber || overview.customers[0].id);
    }
  }, [overview?.customers, customerId]);

  const buildRequestKey = useCallback(
    (req: RecommendationRequest): string => {
      return `${req.context}_${req.product_id || ""}_${req.customer_id || ""}_${req.branch_id || ""}_${(req.product_ids || []).join(",")}_${req.top_n}_${req.include_substitutes}`;
    },
    [],
  );

  const fetchRecommendations = useCallback(
    async (force: boolean = false) => {
      const activeBranch = branchId || selectedBranchId || "";

      const payload: RecommendationRequest = {
        context,
        top_n: topN,
        include_substitutes: includeSubstitutes,
      };

      if (context === "PRODUCT") {
        if (!productId.trim()) {
          setError("No product selected. Please select a valid product from the catalog.");
          setResponse(null);
          return;
        }
        payload.product_id = productId.trim();
        if (activeBranch) {
          payload.branch_id = activeBranch;
        }
      } else if (context === "CUSTOMER") {
        if (!customerId.trim()) {
          setError("No customer selected. Please select a valid customer.");
          setResponse(null);
          return;
        }
        payload.customer_id = customerId.trim();
        if (activeBranch) {
          payload.branch_id = activeBranch;
        }
      } else if (context === "BRANCH") {
        if (!activeBranch) {
          setError("No branch selected. Please select a branch scope.");
          setResponse(null);
          return;
        }
        payload.branch_id = activeBranch;
      } else if (context === "CART_READY") {
        if (!cartProductIds || cartProductIds.length === 0) {
          setError("Please select at least one product for cart cross-sell recommendations.");
          setResponse(null);
          return;
        }
        payload.product_ids = cartProductIds;
        if (activeBranch) {
          payload.branch_id = activeBranch;
        }
      } else if (context === "TRENDING" || context === "COLD_START") {
        if (activeBranch) {
          payload.branch_id = activeBranch;
        }
      }

      const key = buildRequestKey(payload);
      if (!force && lastFetchedKey === key && response) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await apiGetRecommendations(payload);
        setResponse(result);
        setLastFetchedKey(key);
      } catch (cause) {
        const message =
          cause instanceof Error
            ? cause.message
            : "Unable to load recommendations. Please check service connection and try again.";
        setError(message);
        setResponse(null);
      } finally {
        setLoading(false);
      }
    },
    [
      context,
      productId,
      customerId,
      branchId,
      selectedBranchId,
      cartProductIds,
      topN,
      includeSubstitutes,
      buildRequestKey,
      lastFetchedKey,
      response,
    ],
  );

  // Auto-fetch on context or core parameter changes
  useEffect(() => {
    void fetchRecommendations(false);
  }, [fetchRecommendations]);

  const toggleCartProduct = (id: string) => {
    setCartProductIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  };

  const activeOption = useMemo(
    () => CONTEXT_OPTIONS.find((opt) => opt.id === context) ?? CONTEXT_OPTIONS[0],
    [context],
  );

  return (
    <div className="space-y-6">
      {/* Header Banner & Model Provenance Notice */}
      <section className="flex flex-col gap-3 rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#025148]">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                AI Product Recommendation Engine
              </h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                Hybrid 7-Algorithm Pipeline
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              POS cashier and customer decision support powered by association rules, collaborative filtering, and stock-aware ranking.
            </p>
          </div>
        </div>
      </section>

      {/* Context Selector Grid */}
      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {CONTEXT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = context === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setContext(opt.id);
                setError(null);
              }}
              className={`flex flex-col items-start gap-1 rounded-2xl border p-3.5 text-left transition ${
                isActive
                  ? "border-[#025148] bg-[#025148]/5 text-[#025148] shadow-xs ring-1 ring-[#025148]"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  isActive ? "bg-[#025148] text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-1 text-xs font-bold text-slate-900">{opt.label}</p>
              <p className="line-clamp-2 text-[10px] text-slate-500 leading-tight">
                {opt.description}
              </p>
            </button>
          );
        })}
      </section>

      {/* Interactive Controls & Parameter Bar */}
      <section className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-end gap-3 flex-1">
            {/* Context-Specific Inputs */}
            {context === "PRODUCT" && (
              <label className="grid gap-1 text-[11px] font-semibold text-slate-600 min-w-56 flex-1">
                Target Product SKU / ID
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter product SKU or ID"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:border-[#025148]"
                  />
                  {overview?.products && overview.products.length > 0 && (
                    <select
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      className="h-10 rounded-xl border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-[#025148]"
                      title="Select Product from Catalog"
                    >
                      <option value="">Select a product...</option>
                      {overview.products.map((p) => (
                        <option key={p.id} value={p.sku || p.id}>
                          {p.sku} — {p.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </label>
            )}

            {context === "CUSTOMER" && (
              <label className="grid gap-1 text-[11px] font-semibold text-slate-600 min-w-56 flex-1">
                Customer Identifier
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="Enter customer number or ID"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 outline-none focus:border-[#025148]"
                  />
                  {overview?.customers && overview.customers.length > 0 && (
                    <select
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="h-10 rounded-xl border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-[#025148]"
                      title="Select Customer"
                    >
                      <option value="">Select a customer...</option>
                      {overview.customers.map((c) => (
                        <option key={c.id} value={c.customerNumber || c.id}>
                          {c.customerNumber} — {c.firstName} {c.lastName ?? ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </label>
            )}

            {context === "CART_READY" && (
              <div className="grid gap-1 text-[11px] font-semibold text-slate-600 flex-1">
                Cart Basket Selection (Multi-Item Cross-Sell)
                {overview?.products && overview.products.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {overview.products.map((p) => {
                      const sku = p.sku || p.id;
                      const isSelected = cartProductIds.includes(sku);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleCartProduct(sku)}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                            isSelected
                              ? "border-[#025148] bg-[#025148] text-white"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {p.name} ({sku}) {isSelected ? "✓" : "+"}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="pt-1 text-xs text-slate-400">
                    No products available in catalog for cart basket selection.
                  </p>
                )}
              </div>
            )}

            {/* Branch Selector (applicable to all contexts) */}
            <label className="grid gap-1 text-[11px] font-semibold text-slate-600 min-w-40">
              Branch Scope
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-[#025148]"
              >
                <option value="">All Branches</option>
                {overview?.branches?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </label>

            {/* Top N Selector */}
            <label className="grid gap-1 text-[11px] font-semibold text-slate-600 w-24">
              Return Count
              <select
                value={topN}
                onChange={(e) => setTopN(Number(e.target.value))}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-[#025148]"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
              </select>
            </label>

            {/* Include Substitutes Toggle */}
            <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 pb-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSubstitutes}
                onChange={(e) => setIncludeSubstitutes(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#025148] focus:ring-[#025148]"
              />
              Substitutes
            </label>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => void fetchRecommendations(true)}
              disabled={loading}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#025148] px-5 text-xs font-bold text-white transition hover:bg-[#013e37] disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Generating…" : "Run Recommendations"}
            </button>
          </div>
        </div>
      </section>

      {/* Error Message Card */}
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div>
              <p className="text-sm font-bold">Unable to load recommendations</p>
              <p className="mt-0.5 text-xs text-rose-700">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void fetchRecommendations(true)}
            className="rounded-xl border border-rose-300 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Results Display Area */}
      {loading ? (
        <div className="flex min-h-72 w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
          <LoaderCircle className="h-8 w-8 animate-spin text-[#025148]" />
          <p className="mt-3 text-sm font-bold text-slate-800">
            Generating {activeOption.label}…
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Scoring catalog candidates across association rules and inventory availability…
          </p>
        </div>
      ) : response && response.recommendations && response.recommendations.length > 0 ? (
        <div className="space-y-6">
          {/* Summary Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">
                {response.recommendations.length} recommendations ranked for {activeOption.label}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">
                Generated {new Date(response.generated_at).toLocaleTimeString()}
              </span>
            </div>

            {/* Micro Metadata Summary */}
            {response.model_metadata && (
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-700">
                  {response.model_metadata.model_name || "Hybrid Recommender"}
                </span>
                <span className="text-slate-400">•</span>
                <span>
                  Scored <strong>{response.model_metadata.total_candidates_scored}</strong> candidates
                </span>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {response.recommendations.map((item, index) => {
              const reasonLabel =
                REASON_LABELS[item.reason_code] || item.reason_code || "Recommended";
              const isOutOfStock = !item.is_available || item.stock_quantity <= 0;
              const isLowStock = !isOutOfStock && item.stock_quantity <= 5;

              return (
                <div
                  key={`${item.product_id}-${index}`}
                  className={`flex flex-col justify-between rounded-2xl border p-4 transition shadow-xs ${
                    isOutOfStock
                      ? "border-slate-200 bg-slate-50/70 opacity-75"
                      : "border-[var(--brand-stroke)] bg-white hover:border-[#025148]/40 hover:shadow-sm"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Rank & Reason Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-xs font-bold text-[#025148]">
                        #{index + 1}
                      </span>
                      <span
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 truncate max-w-[150px]"
                        title={reasonLabel}
                      >
                        {reasonLabel}
                      </span>
                    </div>

                    {/* Product Name & Brand */}
                    <div>
                      <p className="font-mono text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                        {item.product_id}
                      </p>
                      <h3
                        className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-900 leading-snug"
                        title={item.name}
                      >
                        {item.name || item.product_id}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {item.brand || "TechNova"} • {item.category || "Hardware"}
                      </p>
                    </div>

                    {/* Explanation */}
                    <p className="line-clamp-2 text-[11px] text-slate-600 bg-slate-50 rounded-xl p-2 leading-relaxed">
                      {item.reason}
                    </p>
                  </div>

                  {/* Bottom Stats & Stock Availability */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                    {/* Price & Confidence Score */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400">Unit Price</p>
                        <p className="text-sm font-bold text-slate-900">
                          {item.price != null ? currency.format(item.price) : "LKR —"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-semibold text-slate-400">AI Score</p>
                        <span className="inline-block rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs font-bold text-emerald-800">
                          {percent.format(item.score)}
                        </span>
                      </div>
                    </div>

                    {/* Stock Aware Badge */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-500">
                        Stock: <strong>{item.stock_quantity} units</strong>
                      </span>

                      {isOutOfStock ? (
                        <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          Low Stock
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Model Provenance & Algorithms Metadata Footer */}
          {response.model_metadata && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-800">Model Pipeline:</span>
                  <span>{response.model_metadata.model_name} v{response.model_metadata.version}</span>
                  <span className="text-slate-300">•</span>
                  <span>Context: <strong>{response.model_metadata.context}</strong></span>
                </div>
                {response.model_metadata.training_date_range && (
                  <div className="text-[11px] text-slate-500">
                    Trained: {response.model_metadata.training_date_range.train_start} to{" "}
                    {response.model_metadata.training_date_range.train_end}
                  </div>
                )}
              </div>

              {response.model_metadata.algorithms_used && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Algorithms Active:
                  </span>
                  {response.model_metadata.algorithms_used.map((alg) => (
                    <span
                      key={alg}
                      className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                    >
                      {alg}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-xs">
          <Package className="h-8 w-8 text-slate-400" />
          <p className="mt-3 text-base font-bold text-slate-700">
            Recommendations unavailable
          </p>
          <p className="mt-1 text-xs text-slate-500 max-w-md">
            No real recommendation data is currently available. Recommendations require real TechNova product, customer, branch, and transaction history.
          </p>
          <button
            type="button"
            onClick={() => void fetchRecommendations(true)}
            className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            Refresh Context
          </button>
        </div>
      )}
    </div>
  );
}
