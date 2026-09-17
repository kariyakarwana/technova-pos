"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useBranch } from "@/components/dashboard/BranchContext";
import { apiGet, apiPost } from "@/lib/api/client";
import BarcodeHeader from "./BarcodeHeader";
import BarcodePreviewCard from "./BarcodePreviewCard";
import BarcodeProductTable from "./BarcodeProductTable";
import BarcodeSettingsCard from "./BarcodeSettingsCard";
import type {
  BarcodeLabelSettings,
  BarcodeProductItem,
} from "./BarcodeTypes";
import { canEncodeCode128 } from "./Code128Barcode";

type ApiProduct = {
  id: string;
  sku: string;
  name: string;
  barcode: string | null;
  sellingPrice: string | number;
  images: Array<{
    id: string;
    url: string;
    objectKey: string | null;
  }>;
  stockLevels: Array<{
    quantityOnHand: string | number;
    quantityReserved?: string | number;
  }>;
};

type ProductPage = {
  data: ApiProduct[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
  };
};

type GeneratedBarcode = {
  id: string;
  barcode: string;
  generated: boolean;
};

const DEFAULT_SETTINGS: BarcodeLabelSettings = {
  paperSize: "50mm",
  showName: true,
  showSku: true,
  showPrice: true,
  showValue: true,
};

function productImage(product: ApiProduct) {
  const image = product.images[0];
  if (!image) return "/TechNova.svg";
  if (image.objectKey) {
    return `/api/backend/catalog/products/${product.id}/images/${image.id}/content`;
  }
  return image.url || "/TechNova.svg";
}

function toBarcodeProduct(product: ApiProduct): BarcodeProductItem {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    barcodeCode: product.barcode,
    price: Number(product.sellingPrice),
    stock: product.stockLevels.reduce(
      (total, level) =>
        total +
        Math.max(
          0,
          Number(level.quantityOnHand) - Number(level.quantityReserved ?? 0),
        ),
      0,
    ),
    productImage: productImage(product),
  };
}

export default function BarcodeClientView() {
  const { branchId, branch } = useBranch();
  const [products, setProducts] = useState<BarcodeProductItem[]>([]);
  const [queued, setQueued] = useState<Record<string, BarcodeProductItem>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [settings, setSettings] =
    useState<BarcodeLabelSettings>(DEFAULT_SETTINGS);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    if (!branchId) {
      setProducts([]);
      setTotal(0);
      setTotalPages(1);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(pageSize),
        status: "ACTIVE",
        branchId,
      });
      if (search.trim()) params.set("search", search.trim());
      const result = await apiGet<ProductPage>(`/catalog/products?${params}`);
      setProducts(result.data.map(toBarcodeProduct));
      setTotal(result.meta.total);
      setTotalPages(Math.max(1, result.meta.pageCount));
    } catch (loadError) {
      setProducts([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load products for barcode printing.",
      );
    } finally {
      setLoading(false);
    }
  }, [branchId, currentPage, pageSize, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadProducts(), 250);
    return () => window.clearTimeout(timer);
  }, [loadProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, search]);

  useEffect(() => {
    setCurrentPage(1);
    setQueued({});
    setQuantities({});
  }, [branchId]);

  const queuedProducts = useMemo(() => Object.values(queued), [queued]);
  const queuedIds = useMemo(() => new Set(Object.keys(queued)), [queued]);

  function toggleProduct(product: BarcodeProductItem) {
    if (!product.barcodeCode || !canEncodeCode128(product.barcodeCode)) return;
    setQueued((current) => {
      if (current[product.id]) {
        const next = { ...current };
        delete next[product.id];
        return next;
      }
      return { ...current, [product.id]: product };
    });
    setQuantities((current) => ({
      ...current,
      [product.id]: current[product.id] ?? 1,
    }));
  }

  function changeQuantity(id: string, quantity: number) {
    setQuantities((current) => ({ ...current, [id]: quantity }));
  }

  async function generateBarcode(product: BarcodeProductItem) {
    setGeneratingId(product.id);
    setMessage(null);
    setError(null);
    try {
      const result = await apiPost<GeneratedBarcode>(
        `/catalog/products/${product.id}/barcode/generate`,
        {},
      );
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...item, barcodeCode: result.barcode }
            : item,
        ),
      );
      setMessage(
        result.generated
          ? `Barcode ${result.barcode} was generated for ${product.name}.`
          : `${product.name} already has barcode ${result.barcode}.`,
      );
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "Unable to generate a barcode.",
      );
    } finally {
      setGeneratingId(null);
    }
  }

  function clearQueue() {
    setQueued({});
    setQuantities({});
  }

  function printLabels() {
    if (queuedProducts.length === 0) return;
    window.print();
  }

  return (
    <main className="min-h-screen space-y-6 bg-[var(--brand-app-bg)] p-6">
      <BarcodeHeader />
      <BarcodeSettingsCard
        branchName={branch?.name ?? ""}
        search={search}
        onSearchChange={setSearch}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {message && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-xs font-medium text-teal-800">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800">
          {error}
        </div>
      )}

      <BarcodeProductTable
        products={products}
        queuedIds={queuedIds}
        quantities={quantities}
        loading={loading}
        generatingId={generatingId}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        total={total}
        onToggle={toggleProduct}
        onQuantityChange={changeQuantity}
        onGenerate={generateBarcode}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <BarcodePreviewCard
        products={queuedProducts}
        quantities={quantities}
        settings={settings}
        onReset={clearQueue}
        onPrint={printLabels}
      />
    </main>
  );
}
