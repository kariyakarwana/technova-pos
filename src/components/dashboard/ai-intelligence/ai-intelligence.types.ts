export interface ForecastSummary {
  forecast_days: number;
  total_predicted_demand: number;
  average_daily_demand: number;
  next_7_days_demand: number;
  next_30_days_demand: number;
  peak_demand_date: string;
  peak_daily_demand: number;
}

export interface StockPlan {
  current_stock: number;
  lead_time_demand: number;
  safety_stock: number;
  reorder_point: number;
  target_stock: number;
  recommended_order_quantity: number;
  stockout_risk: number;
  status: "reorder_now" | "monitor" | "healthy";
}

export interface ForecastPeriod {
  label: string;
  start_date: string;
  end_date: string;
  total_demand: number;
  average_daily_demand: number;
}

export interface ProductPrediction {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
  currentPrice: number;
  observedDays: number;
  forecast: {
    summary: ForecastSummary;
    stock_plan: StockPlan;
    data_readiness: {
      history_days: number;
      maturity: string;
      confidence: string;
      production_ready: boolean;
      recommended_action: string;
    };
    daily: Array<{ date: string; predicted_demand: number }>;
    weekly: ForecastPeriod[];
    monthly: ForecastPeriod[];
    seasonal: ForecastPeriod[];
    yearly: ForecastPeriod[];
    notes: string[];
  };
  pricing: null | {
    current_price: number;
    recommended_price: number;
    expected_daily_demand: number;
    expected_daily_profit: number;
    price_change_rate: number;
    decision: "increase" | "decrease" | "keep";
    minimum_allowed_price: number;
    maximum_allowed_price: number;
  };
}

export interface AIOverview {
  generatedAt: string;
  modelStatus: "connected";
  forecastDays: number;
  observedDays: number;
  branches: Array<{ id: string; code: string; name: string }>;
  customers: Array<{
    id: string;
    customerNumber: string;
    firstName: string;
    lastName?: string | null;
  }>;
  products: ProductPrediction[];
  stockIntelligence?: {
    available: boolean;
    source: string;
    message: string;
  };
  dynamicPricing?: {
    available: boolean;
    source: string;
    message: string;
  };
}

export interface LoyaltyResult {
  customer: {
    id: string;
    customerNumber: string;
    firstName: string;
    lastName?: string | null;
  };
  customer_id: string;
  profile: {
    segment: string;
    loyalty_score: number;
    recency_days: number;
    order_count: number;
    total_spend: number;
    units_purchased: number;
  };
  recommendations: Array<{
    product_id: string;
    description: string;
    score: number;
    reason: string;
  }>;
}

export interface SalesForecastPrediction {
  date: string;
  predicted_revenue: number;
}

export interface SalesForecastResponse {
  organization_id: string;
  branch_id: string;
  forecast_horizon: number;
  predictions: SalesForecastPrediction[];
  branch?: {
    id: string;
    code: string;
    name: string;
  };
  generatedAt: string;
  historyDays: number;
}

export type SalesForecastHorizon = 1 | 7 | 14 | 30;

export type DemandForecastHorizon = 7 | 14 | 30;

export interface DailyForecastContextPayload {
  date?: string;
  forecast_date?: string;
  forecastDate?: string;
  is_open?: number;
  isOpen?: number;
  is_promo?: number;
  isPromo?: number;
  unit_price?: number;
  unitPrice?: number;
  state_holiday?: string;
  stateHoliday?: string;
  school_holiday?: number;
  schoolHoliday?: number;
}

export interface DemandForecastPayload {
  product_id?: string;
  productId?: string;
  store_id?: string;
  storeId?: string;
  branchId?: string;
  category?: string;
  base_unit_price?: number;
  baseUnitPrice?: number;
  unit_price?: number;
  unitPrice?: number;
  store_type?: "a" | "b" | "c" | "d" | (string & {});
  storeType?: "a" | "b" | "c" | "d" | (string & {});
  assortment?: "a" | "b" | "c" | (string & {});
  promo2?: number;
  horizon?: DemandForecastHorizon | number;
  forecastHorizon?: DemandForecastHorizon | number;
  forecast_date?: string;
  forecastDate?: string;
  daily_contexts?: DailyForecastContextPayload[];
  dailyContexts?: DailyForecastContextPayload[];
}

export interface DemandForecastPrediction {
  product_id: string;
  store_id: string;
  forecast_date: string;
  predicted_units: number;
  horizon: number;
  day_of_week?: number;
  is_open?: number;
  is_promo?: number;
  unit_price?: number;
}

export interface DemandForecastModelMetadata {
  model_type: string;
  version: string;
  target: string;
  feature_columns?: string[];
  feature_count?: number;
  [key: string]: unknown;
}

export interface DemandForecastResponse {
  product_id: string;
  store_id: string;
  forecast_date: string;
  predicted_units: number;
  horizon: number;
  predictions: DemandForecastPrediction[];
  total_predicted_units?: number;
  model_metadata: DemandForecastModelMetadata;
  branch?: {
    id: string;
    code: string;
    name: string;
  };
  product?: {
    id: string;
    sku: string;
    name: string;
  };
  generatedAt?: string;
  [key: string]: unknown;
}

export type RecommendationContext =
  | "CUSTOMER"
  | "PRODUCT"
  | "BRANCH"
  | "TRENDING"
  | "COLD_START"
  | "CART_READY";

export type RecommendationReasonCode =
  | "FREQUENTLY_BOUGHT_TOGETHER"
  | "BRANCH_POPULAR"
  | "CUSTOMER_HISTORY_AFFINITY"
  | "SIMILAR_PRODUCT"
  | "TRENDING_ACCELERATION"
  | "COMPATIBLE_ACCESSORY"
  | "POPULAR_FALLBACK"
  | (string & {});

export interface RecommendationRequest {
  context: RecommendationContext;
  customer_id?: string;
  product_id?: string;
  product_ids?: string[];
  branch_id?: string;
  top_n?: number;
  include_substitutes?: boolean;
}

export interface RecommendedProduct {
  product_id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  score: number;
  reason_code: string;
  reason: string;
  stock_quantity: number;
  is_available: boolean;
}

export interface RecommendationModelMetadata {
  model_name: string;
  version: string;
  algorithms_used: string[];
  context: string;
  total_candidates_scored: number;
  training_date_range?: {
    train_start: string;
    train_end: string;
  };
}

export interface RecommendationResponse {
  context: string;
  organization_id: string;
  branch_id?: string;
  recommendations: RecommendedProduct[];
  generated_at: string;
  model_metadata: RecommendationModelMetadata;
}

// ==========================================
// BUSINESS ASSISTANT TYPES (PHASE 6)
// ==========================================

export interface AssistantKpiCard {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  unit?: string;
}

export interface AssistantTableData {
  title: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface AssistantChartSeries {
  name: string;
  data: Array<{ label: string; value: number }>;
}

export interface AssistantChartData {
  type: "line" | "bar" | "pie";
  title: string;
  x_label?: string;
  y_label?: string;
  series: AssistantChartSeries[];
}

export interface AssistantSourceReference {
  tool: string;
  entity: string;
  recordCount: number;
  timeRange?: string;
  branchId?: string;
}

export interface AssistantStructuredOutput {
  answer: string;
  language: "en" | "si" | "mixed";
  kpi_cards?: AssistantKpiCard[];
  table?: AssistantTableData;
  chart?: AssistantChartData;
  sources: AssistantSourceReference[];
  follow_up_suggestions?: string[];
  confidence: "high" | "medium" | "low";
  disclaimer?: string;
}

export interface AssistantMessagePayload extends AssistantStructuredOutput {
  id: string;
  role: "assistant";
  createdAt: string;
}

export interface AssistantChatRequest {
  message: string;
  conversationId?: string;
  branchId?: string;
}

export interface AssistantChatResponse {
  conversationId: string;
  message: AssistantMessagePayload;
  metadata?: {
    model: string;
    tokensUsed?: number;
    degraded?: boolean;
    processingTimeMs?: number;
  };
}

export interface AssistantUiMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  structuredOutput?: AssistantStructuredOutput;
  isError?: boolean;
}


