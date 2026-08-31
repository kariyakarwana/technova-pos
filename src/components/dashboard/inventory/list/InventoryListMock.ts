export type InventoryListStatus = "Low Stock" | "In Stock" | "Out of Stock";

export interface InventoryListItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  branch: string;
  onHand: number;
  reorderLevel: number;
  status: InventoryListStatus;
  image?: string;
}

export const MOCK_INVENTORY_LIST_ITEMS: InventoryListItem[] = [
  {
    id: "1",
    name: "NovaKey Pro Wireless",
    category: "Electronics > Peripherals",
    sku: "KB-NKP-W-01",
    branch: "Downtown Flagship",
    onHand: 12,
    reorderLevel: 25,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    name: 'UltraHD Monitor 27"',
    category: "Electronics > Displays",
    sku: "MN-UHD-27-B",
    branch: "Westside Mall",
    onHand: 84,
    reorderLevel: 15,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    name: "Velocity SSD 2TB",
    category: "Components > Storage",
    sku: "ST-VSSD-2T",
    branch: "Downtown Flagship",
    onHand: 0,
    reorderLevel: 10,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    name: "ErgoMouse Pro",
    category: "Electronics > Peripherals",
    sku: "MS-EMP-01",
    branch: "Northside Hub",
    onHand: 156,
    reorderLevel: 30,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    name: "Thunderbolt 4 Dock",
    category: "Electronics > Accessories",
    sku: "DK-TB4-PRO",
    branch: "Downtown Flagship",
    onHand: 18,
    reorderLevel: 20,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "6",
    name: "Studio Wave Microphone",
    category: "Audio > Recording",
    sku: "AU-SWM-MIC",
    branch: "Westside Mall",
    onHand: 92,
    reorderLevel: 15,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&auto=format&fit=crop&q=80",
  },
];
