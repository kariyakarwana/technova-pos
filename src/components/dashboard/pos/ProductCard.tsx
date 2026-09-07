import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import type { Product } from "./pos.mock";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onRemove?: (product: Product) => void;
  isSelected?: boolean;
}

export function ProductCard({
  product,
  onAdd,
  onRemove,
  isSelected = false,
}: ProductCardProps) {
  const isOutOfStock = product.stockCount === 0;

  function handleBadgeClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isSelected && onRemove) {
      onRemove(product);
    } else if (!isOutOfStock) {
      onAdd(product);
    }
  }

  return (
    <div
      onClick={() => {
        if (isSelected && onRemove) {
          onRemove(product);
        } else if (!isOutOfStock) {
          onAdd(product);
        }
      }}
      className={[
        "relative flex flex-col justify-between p-2 rounded-xl bg-white transition-all duration-200 cursor-pointer select-none group",
        isSelected
          ? "border-2 border-[#E26D1E] shadow-sm ring-1 ring-[#E26D1E]/20"
          : "border border-[#E6EAED] hover:border-[#0E9384]/60 hover:shadow-xs",
      ].join(" ")}
    >
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-1.5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />

        <button
          type="button"
          onClick={handleBadgeClick}
          aria-label={isSelected ? "Remove from cart" : "Add to cart"}
          className={[
            "absolute top-1.5 right-1.5 h-5 w-5 rounded-full flex items-center justify-center text-white shadow-xs transition-transform active:scale-90 cursor-pointer z-10",
            isSelected
              ? "bg-[#D32F2F] hover:bg-red-700"
              : "bg-[#0E9384] hover:bg-[#0B6E63]",
          ].join(" ")}
        >
          {isSelected ? (
            <Minus className="h-3 w-3 stroke-[3]" />
          ) : (
            <Plus className="h-3 w-3 stroke-[3]" />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        <span
          className="text-[11px] font-semibold text-[#212B36] line-clamp-1 leading-tight group-hover:text-[#0E9384] transition-colors"
          title={product.name}
        >
          {product.name}
        </span>

        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs font-bold text-[#0E9384]">
            LKR {product.price.toLocaleString()}
          </span>
          <span className="text-[10px] font-medium text-[#D32F2F]">
            {product.inStockFormatted || `${product.stockCount} Pcs`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

