import { PackageOpen } from "lucide-react";
import type { CartItem, Product } from "./pos.mock";
import { ProductCard } from "./ProductCard";

interface ProductCatalogGridProps {
  products: Product[];
  cartItems?: CartItem[];
  onAdd: (product: Product) => void;
  onRemove?: (product: Product) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function ProductCatalogGrid({
  products,
  cartItems = [],
  onAdd,
  onRemove,
  loading = false,
  emptyMessage = "Try a different category or search term",
}: ProductCatalogGridProps) {
  const scrollAreaClass =
    "h-full min-h-0 min-w-0 flex-1 overflow-y-scroll overscroll-contain [scrollbar-gutter:stable] touch-pan-y";

  if (loading) return <div className={`${scrollAreaClass} flex items-center justify-center text-sm text-slate-400`}><span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0E9384] border-t-transparent"/><span className="ml-2">Loading products…</span></div>;
  if (products.length === 0) {
    return (
      <div className={`${scrollAreaClass} flex flex-col items-center justify-center gap-3 text-slate-400`}>
        <PackageOpen className="h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium">No products found</p>
        <p className="max-w-sm text-center text-xs text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  const selectedProductIds = new Set(
    cartItems.map((item) => item.id.replace("cart-", "").toLowerCase())
  );

  return (
    <div className={`${scrollAreaClass} bg-[#F9F9FF] p-3`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-2.5">
        {products.map((product) => {
          const isSelected =
            selectedProductIds.has(product.id.toLowerCase()) ||
            cartItems.some(
              (item) => item.name.toLowerCase() === product.name.toLowerCase()
            );

          return (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={isSelected}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProductCatalogGrid;
