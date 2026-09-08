import Image from "next/image";
import { Minus, Play, Plus, X } from "lucide-react";
import { useState } from "react";
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
  const [videoOpen, setVideoOpen] = useState(false);
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
        {product.videoUrl && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setVideoOpen(true);
            }}
            aria-label={`Play ${product.name} video`}
            className="absolute bottom-1.5 left-1.5 z-10 flex items-center gap-1 rounded-full bg-slate-950/80 px-2 py-1 text-[9px] font-semibold text-white"
          >
            <Play className="h-3 w-3 fill-current" />
            Video
          </button>
        )}
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
      {videoOpen && product.videoUrl && (
        <div
          onClick={(event) => event.stopPropagation()}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-4"
        >
          <div className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">{product.name}</h2>
                <p className="text-xs text-slate-500">Product video</p>
              </div>
              <button
                type="button"
                onClick={() => setVideoOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <video
              src={product.videoUrl}
              controls
              autoPlay
              preload="metadata"
              className="aspect-video w-full rounded-xl bg-slate-950 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
