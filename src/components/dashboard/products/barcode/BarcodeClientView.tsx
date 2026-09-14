"use client";

import { useState } from "react";
import {
  MOCK_BARCODE_PRODUCTS,
  TOTAL_BARCODE_PAGES,
  type BarcodeProductItem,
} from "./BarcodeMock";
import BarcodeHeader from "./BarcodeHeader";
import BarcodeSettingsCard from "./BarcodeSettingsCard";
import BarcodeProductTable from "./BarcodeProductTable";
import BarcodePreviewCard from "./BarcodePreviewCard";

export default function BarcodeClientView() {
  const [products, setProducts] = useState<BarcodeProductItem[]>(MOCK_BARCODE_PRODUCTS);
  const [warehouse, setWarehouse] = useState("Select Warehouse");
  const [store, setStore] = useState("Select Store");
  const [paperSize, setPaperSize] = useState("36mm (1.4 Inch)");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  function handleQuantityChange(id: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  }

  function handleDeleteRow(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function handleReset() {
    setProducts(MOCK_BARCODE_PRODUCTS);
    setQuantities({});
    setWarehouse("Select Warehouse");
    setStore("Select Store");
  }

  function handlePrint() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <BarcodeHeader />

      {/* 2. Warehouse / Store / Paper Settings */}
      <BarcodeSettingsCard
        warehouse={warehouse}
        onWarehouseChange={setWarehouse}
        store={store}
        onStoreChange={setStore}
        paperSize={paperSize}
        onPaperSizeChange={setPaperSize}
      />

      {/* 3. Product Table */}
      <BarcodeProductTable
        products={products}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
        onDeleteRow={handleDeleteRow}
        currentPage={currentPage}
        totalPages={TOTAL_BARCODE_PAGES}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* 4. Preview & Print Actions */}
      <BarcodePreviewCard
        products={products}
        quantities={quantities}
        onReset={handleReset}
        onPrint={handlePrint}
      />
    </main>
  );
}
