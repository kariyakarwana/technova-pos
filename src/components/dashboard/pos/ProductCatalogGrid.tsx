import { PackageOpen } from "lucide-react";
import type { CartItem, Product } from "./pos.mock";
import { ProductCard } from "./ProductCard";

interface ProductCatalogGridProps {
  products: Product[];
  cartItems?: CartItem[];
  onAdd: (product: Product) => void;
  onRemove?: (product: Product) => void;
}

export function ProductCatalogGrid({
  products,
  cartItems = [],
  onAdd,
  onRemove,
}: ProductCatalogGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-400 overflow-y-auto">
        <PackageOpen className="h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium">No products found</p>
        <p className="text-xs text-slate-400">Try a different category or search term</p>
      </div>
    );
  }

  const selectedProductIds = new Set(
    cartItems.map((item) => item.id.replace("cart-", "").toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-3 bg-[#F9F9FF]">
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
