"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  LoaderCircle,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiGet } from "@/lib/api/client";
import type {
  SalesForecastHorizon,
  SalesForecastResponse,
} from "./ai-intelligence.types";

interface RevenueForecastChartCardProps {
  branchId?: string;
  forecastHorizon?: SalesForecastHorizon;
  onForecastHorizonChange?: (horizon: SalesForecastHorizon) => void;
  // Backward compatibility with legacy props
  timeHorizon?: string;
  onTimeHorizonChange?: (val: string) => void;
}

const currency = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

function formatLkrTick(value: number): string {
  if (value >= 1_000_000) {
    return `LKR ${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `LKR ${(value / 1_000).toFixed(0)}k`;
  }
  return `LKR ${value}`;
}

export default function RevenueForecastChartCard({
  branchId,
  forecastHorizon,
  onForecastHorizonChange,
  timeHorizon,
  onTimeHorizonChange,
}: RevenueForecastChartCardProps) {
  const [internalHorizon, setInternalHorizon] = useState<SalesForecastHorizon>(
    () => {
      if (forecastHorizon) return forecastHorizon;
      if (timeHorizon) {
        if (timeHorizon.includes("1") && !timeHorizon.includes("14")) return 1;
        if (timeHorizon.includes("14")) return 14;
        if (timeHorizon.includes("30")) return 30;
        if (timeHorizon.includes("7")) return 7;
      }
      return 7;
    },
  );

  const activeHorizon: SalesForecastHorizon =
    forecastHorizon ?? internalHorizon;

  const [data, setData] = useState<SalesForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async () => {
    if (!branchId) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        branchId,
        forecastHorizon: String(activeHorizon),
      });
      const result = await apiGet<SalesForecastResponse>(
        `/ai-intelligence/sales-forecast?${query.toString()}`,
      );
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load sales forecast.",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [branchId, activeHorizon]);

  useEffect(() => {
    void fetchForecast();
  }, [fetchForecast]);

  const handleHorizonChange = (newHorizon: SalesForecastHorizon) => {
    if (forecastHorizon === undefined) {
      setInternalHorizon(newHorizon);
    }
    onForecastHorizonChange?.(newHorizon);
    onTimeHorizonChange?.(`${newHorizon} Days`);
  };

  const chartData = useMemo(() => {
    if (!data?.predictions?.length) return [];
    return data.predictions.map((p) => {
      const [year, month, day] = p.date.split("-").map(Number);
      const dateObj = new Date(year, (month || 1) - 1, day || 1);
      const isDateValid = !isNaN(dateObj.getTime());
      const dateLabel = isDateValid
        ? dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : p.date;
      const fullDate = isDateValid
        ? dateObj.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : p.date;

      return {
        date: p.date,
        dateLabel,
        fullDate,
        predicted_revenue: p.predicted_revenue,
      };
    });
  }, [data]);

  const totalRevenue = useMemo(() => {
    if (!data?.predictions?.length) return 0;
    return data.predictions.reduce((acc, p) => acc + p.predicted_revenue, 0);
  }, [data]);

  const avgDailyRevenue = useMemo(() => {
    if (!data?.predictions?.length) return 0;
    return totalRevenue / data.predictions.length;
  }, [data, totalRevenue]);

  const isColdStart = Boolean(
    data &&
    !loading &&
    !error &&
    typeof data.historyDays === "number" &&
    data.historyDays < 28,
  );

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs flex flex-col justify-between space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-[var(--brand-black-font,#0f172a)]">
              Revenue Forecast
            </h2>
            {data?.branch && (
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                {data.branch.name}
              </span>
            )}
            {data && isColdStart && (
              <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Cold-start forecast • Insufficient branch history (&lt; 28 days)
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            AI daily revenue prediction ({activeHorizon}{" "}
            {activeHorizon === 1 ? "day" : "days"} horizon)
          </p>
        </div>

        <div className="relative">
          <select
            value={activeHorizon}
            onChange={(e) =>
              handleHorizonChange(
                Number(e.target.value) as SalesForecastHorizon,
              )
            }
            className="h-8 pl-3 pr-7 text-xs bg-slate-50 border border-[var(--brand-stroke,#e2e8f0)] rounded-lg text-slate-700 font-semibold appearance-none focus:outline-none focus:border-[var(--brand-green,#0E9384)] cursor-pointer"
          >
            <option value={1}>1 Day</option>
            <option value={7}>7 Days</option>
            <option value={14}>14 Days</option>
            <option value={30}>30 Days</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Metric Summaries */}
      {data && data.predictions.length > 0 && !loading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Total Forecast
            </p>
            <p className="mt-1 text-base font-bold text-slate-900">
              {currency.format(totalRevenue)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Daily Average
            </p>
            <p className="mt-1 text-base font-bold text-slate-900">
              {currency.format(avgDailyRevenue)}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Horizon
            </p>
            <p className="mt-1 text-base font-bold text-[var(--brand-green,#0E9384)]">
              {activeHorizon} {activeHorizon === 1 ? "Day" : "Days"}
            </p>
          </div>
        </div>
      )}

      {/* Chart Canvas & State Panels */}
      <div className="relative h-56 w-full rounded-2xl overflow-hidden">
        {loading && (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <LoaderCircle className="h-7 w-7 animate-spin text-[var(--brand-green,#0E9384)]" />
            <p className="mt-2 text-xs font-semibold text-slate-600">
              Calculating revenue forecast...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/60 p-6 text-center">
            <AlertTriangle className="h-6 w-6 text-rose-500" />
            <p className="mt-2 text-xs font-bold text-rose-800">
              Forecast unavailable
            </p>
            <p className="mt-1 text-[11px] text-rose-600 max-w-sm">{error}</p>
            <button
              type="button"
              onClick={() => void fetchForecast()}
              className="mt-3 flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        )}

        {!branchId && !loading && !error && (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center">
            <TrendingUp className="h-6 w-6 text-slate-400" />
            <p className="mt-2 text-xs font-semibold text-slate-700">
              No branch selected
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Select a branch to view AI revenue predictions.
            </p>
          </div>
        )}

        {branchId && !loading && !error && chartData.length === 0 && (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center">
            <TrendingUp className="h-6 w-6 text-slate-400" />
            <p className="mt-2 text-xs font-semibold text-slate-700">
              No predictions available
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              No revenue predictions were returned for this branch and horizon.
            </p>
          </div>
        )}

        {!loading && !error && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 15, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueForecastGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#0E9384" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0E9384" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatLkrTick}
              />
              <Tooltip
                formatter={(val) => [
                  currency.format(Number(val)),
                  "Predicted Revenue",
                ]}
                labelFormatter={(_, payload) => {
                  const item = payload?.[0]?.payload;
                  return item ? item.fullDate : "";
                }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--brand-stroke, #e2e8f0)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="predicted_revenue"
                stroke="#0E9384"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueForecastGrad)"
                dot={{
                  r: activeHorizon <= 7 ? 3.5 : 2,
                  fill: "#0E9384",
                  strokeWidth: 1.5,
                  stroke: "#ffffff",
                }}
                activeDot={{
                  r: 5,
                  fill: "#0E9384",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
