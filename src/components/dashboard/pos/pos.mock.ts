import {
  Coffee,
  Footprints,
  Headphones,
  Laptop,
  LayoutGrid,
  Smartphone,
  Watch,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface Product {
  id: string;
  sku?: string;
  barcode?: string | null;
  name: string;
  price: number;
  stockCount: number;
  category: string;
  image: string;
  inStockFormatted?: string;
  trackSerials?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  stockCount: number;
  qty: number;
  image: string;
  batchNo?: string;
  inStockFormatted?: string;
  productId?: string;
  trackSerials?: boolean;
  serialNumber?: string;
}

export const categories: Category[] = [
  { id: "All", label: "All", icon: LayoutGrid },
  { id: "Headset", label: "Headset", icon: Headphones },
  { id: "Shoes", label: "Shoes", icon: Footprints },
  { id: "Mobiles", label: "Mobiles", icon: Smartphone },
  { id: "Watches", label: "Watches", icon: Watch },
  { id: "Laptops", label: "Laptops", icon: Laptop },
  { id: "Appliances", label: "Appliances", icon: Coffee },
];

export const products: Product[] = [
  {
    id: "p01",
    name: "Charger Cable",
    price: 40,
    stockCount: 40,
    inStockFormatted: "40 Pcs",
    category: "Appliances",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p02",
    name: "Apple Airpods 2",
    price: 120,
    stockCount: 26,
    inStockFormatted: "26 Pcs",
    category: "Headset",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p03",
    name: "Vacuum Cleaner",
    price: 800,
    stockCount: 12,
    inStockFormatted: "12 Pcs",
    category: "Appliances",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p04",
    name: "Realme 8 Pro",
    price: 700,
    stockCount: 18,
    inStockFormatted: "18 Pcs",
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p05",
    name: "Vacuum Robot",
    price: 600,
    stockCount: 35,
    inStockFormatted: "35 Pcs",
    category: "Appliances",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p06",
    name: "Kitchen Mixer",
    price: 650,
    stockCount: 10,
    inStockFormatted: "10 Pcs",
    category: "Appliances",
    image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p07",
    name: "Apple Watch Series 9",
    price: 300,
    stockCount: 8,
    inStockFormatted: "08 Pcs",
    category: "Watches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p08",
    name: "Bracelet",
    price: 1450,
    stockCount: 12,
    inStockFormatted: "12 Pcs",
    category: "Watches",
    image: "https://images.unsplash.com/photo-1611591475155-42e924a10977?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p09",
    name: "YETI Flask",
    price: 15800,
    stockCount: 30,
    inStockFormatted: "30 Pcs",
    category: "Appliances",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p10",
    name: "Osmo Med Kit",
    price: 410,
    stockCount: 15,
    inStockFormatted: "15 Pcs",
    category: "Appliances",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p11",
    name: "Celestique Perfume",
    price: 190,
    stockCount: 45,
    inStockFormatted: "45 Pcs",
    category: "Appliances",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p12",
    name: "Dell XPS 13",
    price: 1140,
    stockCount: 22,
    inStockFormatted: "22 Pcs",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p13",
    name: "Cheese Snack",
    price: 15,
    stockCount: 56,
    inStockFormatted: "56 Pcs",
    category: "Appliances",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p14",
    name: "Blue Boot Shoes",
    price: 320,
    stockCount: 30,
    inStockFormatted: "30 Pcs",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p15",
    name: "Sonic Aura X7",
    price: 230,
    stockCount: 20,
    inStockFormatted: "20 Pcs",
    category: "Headset",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p16",
    name: "Brown Formal Shoes",
    price: 180,
    stockCount: 12,
    inStockFormatted: "12 Pcs",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p17",
    name: "PixelCrafter 3000",
    price: 900,
    stockCount: 20,
    inStockFormatted: "20 Pcs",
    category: "Appliances",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p18",
    name: "Apple Iphone 13",
    price: 1200,
    stockCount: 15,
    inStockFormatted: "15 Pcs",
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p19",
    name: "Citrify Orange Juice",
    price: 80,
    stockCount: 16,
    inStockFormatted: "16 Pcs",
    category: "Appliances",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "p20",
    name: "Aroma Coffee Maker",
    price: 170,
    stockCount: 35,
    inStockFormatted: "35 Pcs",
    category: "Appliances",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&auto=format&fit=crop&q=80",
  },
];

export const initialCartItems: CartItem[] = [
  {
    id: "cart-01",
    name: "iPhone 11S",
    price: 400,
    stockCount: 10,
    inStockFormatted: "10",
    qty: 1,
    batchNo: "",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cart-02",
    name: "Samsung Galaxy S21",
    price: 400,
    stockCount: 8,
    inStockFormatted: "08",
    qty: 1,
    batchNo: "",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cart-03",
    name: "Red Boot Shoes",
    price: 400,
    stockCount: 7,
    inStockFormatted: "07",
    qty: 1,
    batchNo: "",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
  },
];
