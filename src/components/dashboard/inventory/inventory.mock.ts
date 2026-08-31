export type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface InventoryItem {
  id: string;
  name: string;
  categoryHierarchy: string;
  sku: string;
  branch: string;
  onHand: number;
  reorderLevel: number;
  status: InventoryStatus;
  productImage: string;
}

export interface InventoryMetric {
  title: string;
  value: string;
  subtitle: string;
  type: "value" | "low" | "out" | "total";
}

export interface StockChartDataPoint {
  day: string;
  stockLevelPercent: number; // percentage for stock levels bar
  salesVolumePercent: number; // percentage for sales volume bar
}

export const MOCK_INVENTORY_METRICS: InventoryMetric[] = [
  {
    title: "TOTAL STOCK VALUE",
    value: "$1.24M",
    subtitle: "+2.4% this month",
    type: "value",
  },
  {
    title: "LOW ON STOCK",
    value: "42",
    subtitle: "Requires immediate attention",
    type: "low",
  },
  {
    title: "OUT OF STOCK",
    value: "15",
    subtitle: "Across all branches",
    type: "out",
  },
  {
    title: "TOTAL PRODUCTS",
    value: "3,842",
    subtitle: "Active products",
    type: "total",
  },
];

export const MOCK_STOCK_CHART_DATA: StockChartDataPoint[] = [
  { day: "Mon", stockLevelPercent: 0, salesVolumePercent: 55 },
  { day: "Tue", stockLevelPercent: 30, salesVolumePercent: 45 },
  { day: "Wed", stockLevelPercent: 18, salesVolumePercent: 32 },
  { day: "Thu", stockLevelPercent: 14, salesVolumePercent: 62 },
  { day: "Fri", stockLevelPercent: 36, salesVolumePercent: 28 },
  { day: "Sat", stockLevelPercent: 4, salesVolumePercent: 78 },
  { day: "Sun", stockLevelPercent: 3, salesVolumePercent: 46 },
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: "1",
    name: "NovaKey Pro Wireless",
    categoryHierarchy: "Electronics > Peripherals",
    sku: "KB-NKP-W-01",
    branch: "Downtown Flagship",
    onHand: 12,
    reorderLevel: 25,
    status: "Low Stock",
    productImage: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    name: 'UltraHD Monitor 27"',
    categoryHierarchy: "Electronics > Displays",
    sku: "MN-UHD-27-B",
    branch: "Westside Mall",
    onHand: 84,
    reorderLevel: 15,
    status: "In Stock",
    productImage: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    name: "Velocity SSD 2TB",
    categoryHierarchy: "Components > Storage",
    sku: "ST-VSSD-2T",
    branch: "Downtown Flagship",
    onHand: 0,
    reorderLevel: 10,
    status: "Out of Stock",
    productImage: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    name: "ErgoMouse Pro",
    categoryHierarchy: "Electronics > Peripherals",
    sku: "MS-EMP-01",
    branch: "Northside Hub",
    onHand: 156,
    reorderLevel: 30,
    status: "In Stock",
    productImage: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    name: "Thunderbolt 4 Dock",
    categoryHierarchy: "Electronics > Accessories",
    sku: "DK-TB4-PRO",
    branch: "Downtown Flagship",
    onHand: 18,
    reorderLevel: 20,
    status: "Low Stock",
    productImage: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "6",
    name: "Studio Wave Microphone",
    categoryHierarchy: "Audio > Recording",
    sku: "AU-SWM-MIC",
    branch: "Westside Mall",
    onHand: 92,
    reorderLevel: 15,
    status: "In Stock",
    productImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&auto=format&fit=crop&q=80",
  },
];
