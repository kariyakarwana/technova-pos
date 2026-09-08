import type {
  CategoryMetric,
  KpiCardItem,
  LowStockItem,
  MonthlySalesPurchase,
  RecentSaleItem,
  TopBannerMetric,
  TopCustomerItem,
  TopProductItem,
} from "@/components/dashboard/dashboard/AdminDashboardTypes";

/**
 * Grid coordinates and dimensions for a dashboard widget.
 */
export interface DashboardWidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
}

/**
 * Arbitrary serializable settings for a widget.
 */
export type DashboardWidgetSettings = Record<string, unknown>;

/**
 * Serialized representation of a single widget within a dashboard layout.
 */
export interface DashboardLayoutWidget {
  id: string;
  type: string;
  title?: string;
  position: DashboardWidgetPosition;
  settings?: DashboardWidgetSettings;
}

/**
 * Full serializable configuration for a customizable dashboard layout.
 */
export interface DashboardLayout {
  version: number;
  columns: number;
  rowHeight: number;
  widgets: DashboardLayoutWidget[];
}

/**
 * Dashboard entity returned by the backend API.
 */
export interface Dashboard {
  id: string;
  organizationId: string;
  branchId?: string | null;
  userId?: string | null;
  name: string;
  description?: string | null;
  isDefault: boolean;
  layout: DashboardLayout;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pre-built template for creating dashboards.
 */
export interface DashboardTemplate {
  id: string;
  organizationId?: string | null;
  name: string;
  description?: string | null;
  category?: string | null;
  layout: DashboardLayout;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tokens defining visual styling for a dashboard theme.
 */
export interface VisualThemeTokens {
  mode?: "light" | "dark" | "system";
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  cardBackground?: string;
  surfaceColor?: string;
  textColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  customVariables?: Record<string, string>;
}

/**
 * Visual theme configuration entity returned by the backend API.
 */
export interface VisualTheme {
  id: string;
  organizationId: string;
  name: string;
  isDefault: boolean;
  tokens: VisualThemeTokens;
  createdAt: string;
  updatedAt: string;
}

/**
 * Raw data payload returned by the `/reports/dashboard` endpoint.
 */
export interface DashboardReportData {
  period: { from: string; to: string };
  sales: { count: number; total: number; paid: number; balanceDue: number };
  customers: number;
  credit: { accounts: number; outstanding: number };
  returns: { count: number; total: number };
  comparisons: { sales: number; purchases: number; returns: number };
  purchases: { count: number; total: number };
  profit: number;
  suppliers: number;
  customerOverview: { firstTime: number; returning: number };
  monthlyTrends: MonthlySalesPurchase[];
  topSellingProducts: Array<{ id: string; name: string; price: number; quantity: number; imageUrl: string }>;
  lowStockProducts: Array<{ id: string; name: string; sku: string; quantity: number; imageUrl: string }>;
  recentSales: Array<{ id: string; name: string; category: string; total: number; date: string; status: string; imageUrl: string }>;
  topCustomers: Array<{ id: string; name: string; country: string; orderCount: number; spent: number; avatarUrl: string }>;
  categories: Array<{ name: string; percentage: number; salesCount: number }>;
  categorySummary: { totalCategories: number; totalProducts: number };
  heatmap: number[][];
}

/**
 * Formatted data ready for consumption by individual widgets.
 */
export interface FormattedDashboardData {
  banners: TopBannerMetric[];
  kpis: KpiCardItem[];
  overall: {
    suppliersCount: number;
    customersCount: number;
    ordersCount: number;
    firstTimeAmount: string;
    firstTimeRate: string;
    returnAmount: string;
    returnRate: string;
  };
  products: TopProductItem[];
  lowStock: LowStockItem[];
  recent: RecentSaleItem[];
  customers: TopCustomerItem[];
  categories: CategoryMetric[];
}

/**
 * API request payloads
 */
export interface CreateDashboardPayload {
  name: string;
  description?: string;
  branchId?: string;
  userId?: string;
  isDefault?: boolean;
  layout: DashboardLayout;
}

export interface UpdateDashboardPayload {
  name?: string;
  description?: string;
  branchId?: string | null;
  userId?: string | null;
  isDefault?: boolean;
}

export interface UpdateDashboardLayoutPayload {
  layout: DashboardLayout;
}

export interface DashboardQueryParams {
  branchId?: string;
  userId?: string;
  isDefault?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CreateDashboardTemplatePayload {
  name: string;
  description?: string;
  category?: string;
  layout: DashboardLayout;
}

export interface UpdateDashboardTemplatePayload {
  name?: string;
  description?: string;
  category?: string;
  layout?: DashboardLayout;
}

export interface DashboardTemplateQueryParams {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateVisualThemePayload {
  name: string;
  isDefault?: boolean;
  tokens: VisualThemeTokens;
}

export interface UpdateVisualThemePayload {
  name?: string;
  isDefault?: boolean;
  tokens?: VisualThemeTokens;
}

export interface VisualThemeQueryParams {
  isDefault?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
