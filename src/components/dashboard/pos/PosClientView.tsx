"use client";

import { useMemo, useState } from "react";
import {
  categories,
  initialCartItems,
  products,
  type CartItem,
  type Product,
} from "./pos.mock";
import { useOfflineMode } from "./OfflineContext";
import { CategorySidebar } from "./CategorySidebar";
import { ProductCatalogGrid } from "./ProductCatalogGrid";
import { PosHeader } from "./PosHeader";
import { PosOrderPanel } from "./PosOrderPanel";

export function PosClientView() {
  const { isOffline, toggleOffline } = useOfflineMode();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch = q === "" || p.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  function handleAddToCart(product: Product) {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id ||
          item.name.toLowerCase() === product.name.toLowerCase()
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          stockCount: product.stockCount,
          inStockFormatted: product.inStockFormatted,
          qty: 1,
          batchNo: "",
          image: product.image,
        },
      ];
    });
  }

  function handleRemoveFromCard(product: Product) {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          item.id !== product.id &&
          item.name.toLowerCase() !== product.name.toLowerCase()
      )
    );
  }

  function handleUpdateQty(id: string, delta: number) {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function handleRemoveItem(id: string) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleClearCart() {
    setCartItems([]);
  }

  function handleUpdateBatch(id: string, batchNo: string) {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, batchNo } : item))
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#F9F9FF]">
      <PosHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewAllCategories={() => setSelectedCategory("All")}
        isOffline={isOffline}
        onToggleOffline={toggleOffline}
      />

      <div className="flex flex-1 overflow-hidden">
        <CategorySidebar
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <ProductCatalogGrid
          products={filteredProducts}
          cartItems={cartItems}
          onAdd={handleAddToCart}
          onRemove={handleRemoveFromCard}
        />

        <PosOrderPanel
          cartItems={cartItems}
          isOffline={isOffline}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onUpdateBatch={handleUpdateBatch}
        />
      </div>
    </div>
  );
}

export default PosClientView;
