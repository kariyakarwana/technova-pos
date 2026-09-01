export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  unit: string;
  qty: number;
  createdBy: string;
  productImage: string;
  avatarImage: string;
}

export interface CategoryItem {
  id: string;
  cid: string;
  category: string;
  description: string;
  status: string;
  createdBy: string;
  avatarImage: string;
}

export interface BarcodeProductItem {
  id: string;
  sku: string;
  name: string;
  brandName: string;
  description: string;
  barcodeCode: string;
  productImage: string;
  qty: number;
}

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: "1",
    sku: "PT001",
    name: "Lenovo IdeaPad 3",
    category: "Computers",
    brand: "Lenovo",
    price: 600,
    unit: "Pc",
    qty: 100,
    createdBy: "James Kirwin",
    productImage: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100&auto=format&fit=crop&q=80",
    avatarImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    sku: "PT002",
    name: "Beats Pro",
    category: "Electronics",
    brand: "Beats",
    price: 160,
    unit: "Pc",
    qty: 140,
    createdBy: "Francis Chang",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80",
    avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    sku: "PT003",
    name: "Nike Jordan",
    category: "Shoe",
    brand: "Nike",
    price: 110,
    unit: "Pc",
    qty: 300,
    createdBy: "Antonio Engle",
    productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80",
    avatarImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    sku: "PT004",
    name: "Apple Series 5 Watch",
    category: "Electronics",
    brand: "Apple",
    price: 120,
    unit: "Pc",
    qty: 450,
    createdBy: "Leo Kelly",
    productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80",
    avatarImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    sku: "PT005",
    name: "Amazon Echo Dot",
    category: "Electronics",
    brand: "Amazon",
    price: 80,
    unit: "Pc",
    qty: 320,
    createdBy: "Annette Walker",
    productImage: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=100&auto=format&fit=crop&q=80",
    avatarImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "6",
    sku: "PT006",
    name: "Sanford Chair Sofa",
    category: "Furniture",
    brand: "Modern Wave",
    price: 320,
    unit: "Pc",
    qty: 650,
    createdBy: "John Weaver",
    productImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&auto=format&fit=crop&q=80",
    avatarImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "7",
    sku: "PT007",
    name: "Red Premium Satchel",
    category: "Bags",
    brand: "Dior",
    price: 60,
    unit: "Pc",
    qty: 700,
    createdBy: "Gary Hennessy",
    productImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&auto=format&fit=crop&q=80",
    avatarImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "8",
    sku: "PT008",
    name: "iPhone 14 Pro",
    category: "Phone",
    brand: "Apple",
    price: 540,
    unit: "Pc",
    qty: 630,
    createdBy: "Eleanor Panek",
    productImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80",
    avatarImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "9",
    sku: "PT009",
    name: "Gaming Chair",
    category: "Furniture",
    brand: "Arlime",
    price: 200,
    unit: "Pc",
    qty: 410,
    createdBy: "William Levy",
    productImage: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=100&auto=format&fit=crop&q=80",
    avatarImage: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "10",
    sku: "PT010",
    name: "Borealis Backpack",
    category: "Bags",
    brand: "The North Face",
    price: 45,
    unit: "Pc",
    qty: 550,
    createdBy: "Charlotte Klotz",
    productImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&auto=format&fit=crop&q=80",
    avatarImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80",
  },
];

export const MOCK_CATEGORIES: CategoryItem[] = [
  {
    id: "1",
    cid: "PT001",
    category: "Computers",
    description: "Laptops, Desktops, and Computer Accessories",
    status: "Active",
    createdBy: "James Kirwin",
    avatarImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    cid: "PT002",
    category: "Electronics",
    description: "Smartphones, Audio, and Gadgets",
    status: "Active",
    createdBy: "Francis Chang",
    avatarImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    cid: "PT003",
    category: "Shoe",
    description: "Footwear, Sneakers, and Boots",
    status: "Active",
    createdBy: "Antonio Engle",
    avatarImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    cid: "PT004",
    category: "Furniture",
    description: "Chairs, Desks, and Ergonomic Sofas",
    status: "Active",
    createdBy: "John Weaver",
    avatarImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    cid: "PT005",
    category: "Bags",
    description: "Satchels, Backpacks, and Travel Bags",
    status: "Active",
    createdBy: "Gary Hennessy",
    avatarImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&auto=format&fit=crop&q=80",
  },
];

export const MOCK_BARCODE_PRODUCTS: BarcodeProductItem[] = [
  {
    id: "1",
    sku: "PT001",
    name: "Lenovo IdeaPad 3",
    brandName: "Lenovo",
    description: "Core i5, 8GB RAM, 512GB SSD",
    barcodeCode: "123456789012",
    productImage: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100&auto=format&fit=crop&q=80",
    qty: 1,
  },
  {
    id: "2",
    sku: "PT002",
    name: "Beats Pro",
    brandName: "Beats",
    description: "Wireless Over-Ear Headphones",
    barcodeCode: "123456789013",
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80",
    qty: 1,
  },
  {
    id: "3",
    sku: "PT003",
    name: "Nike Jordan",
    brandName: "Nike",
    description: "Air Jordan Retro High OG",
    barcodeCode: "123456789014",
    productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=80",
    qty: 1,
  },
];
