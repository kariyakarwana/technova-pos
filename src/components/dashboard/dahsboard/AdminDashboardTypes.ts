export interface TopBannerMetric { title: string; amount: string; change: string; isPositive: boolean; bgGradient: string; iconName: "sales" | "sales_return" | "purchase" | "purchase_return"; }
export interface KpiCardItem { title: string; amount: string; changeText: string; isPositive: boolean; iconBg: string; iconColor: string; iconType: "profit" | "due" | "expense" | "payment_return"; }
export interface MonthlySalesPurchase { month: string; purchase: number; sales: number; }
export interface TopProductItem { id: string; name: string; price: string; salesCount: string; trend: string; isPositive: boolean; imageUrl: string; }
export interface LowStockItem { id: string; name: string; skuId: string; inStock: number; imageUrl: string; }
export interface RecentSaleItem { id: string; name: string; category: string; price: string; date: string; status: "Processing" | "Cancelled" | "OnHold" | "Completed"; imageUrl: string; }
export interface TopCustomerItem { id: string; name: string; country: string; orderCount: string; spentAmount: string; avatarUrl: string; }
export interface CategoryMetric { name: string; percentage: number; salesCount: number; color: string; }
