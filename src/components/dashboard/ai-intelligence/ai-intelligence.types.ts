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
