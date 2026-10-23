"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type ProductItem,
} from "@/components/dashboard/products/products.mock";
import { apiGet, apiPatch } from "@/lib/api/client";
import { useBranch } from "@/components/dashboard/BranchContext";

type ApiProduct = { id: string; sku: string; name: string; sellingPrice: string | number; unit?: string; images: Array<{ url: string }>; category: { name: string } | null; brand: { name: string } | null; stockLevels: Array<{ quantityOnHand: string | number }> };
type Lookup = { id: string; name: string };
type ProductPage = { data: ApiProduct[]; meta: { page: number; pageSize: number; total: number; pageCount: number } };
import ProductListHeader from "@/components/dashboard/products/ProductListHeader";
import ProductListFilterBar from "@/components/dashboard/products/ProductListFilterBar";
import ProductListTable, {
  type ProductSortField,
  type SortOrder,
} from "@/components/dashboard/products/ProductListTable";
import ProductListPagination from "@/components/dashboard/products/ProductListPagination";
import ProductImportDialog from "@/components/dashboard/products/ProductImportDialog";
import { productCsv, productPrintHtml } from "@/components/dashboard/products/productExport";

export default function ProductListPage() {
  const { branchId } = useBranch();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<ProductSortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState<boolean>(false);
  const [categories, setCategories] = useState<Lookup[]>([]);
  const [brands, setBrands] = useState<Lookup[]>([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  async function productsForExport(): Promise<ApiProduct[]> {
    const exported: ApiProduct[] = [];
    for (let page = 1; ; page += 1) {
      const params = new URLSearchParams({ page: String(page), pageSize: "100", status: "ACTIVE" });
      if (branchId) params.set("branchId", branchId);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedCategory !== "All") params.set("categoryId", selectedCategory);
      if (selectedBrand !== "All") params.set("brandId", selectedBrand);
      const batch = await apiGet<ProductPage>(`/catalog/products?${params}`);
      exported.push(...batch.data);
      if (page >= batch.meta.pageCount || batch.data.length === 0) break;
    }
    return exported;
  }

  async function exportCsv() {
    setExporting(true);
    setExportError(null);
    try {
      const csv = productCsv(await productsForExport());
      const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "technova-products.csv";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Unable to export products.");
    } finally {
      setExporting(false);
    }
  }

  async function exportPdf() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setExportError("Allow pop-ups to print or save the product report as PDF.");
      return;
    }
    printWindow.document.write("<p>Preparing product report…</p>");
    setExporting(true);
    setExportError(null);
    try {
      const html = productPrintHtml(await productsForExport());
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } catch (error) {
      printWindow.close();
      setExportError(error instanceof Error ? error.message : "Unable to prepare product report.");
    } finally {
      setExporting(false);
    }
  }

  const filteredProducts = useMemo(() => {
    const result = [...products];

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }
      return sortOrder === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [products, sortField, sortOrder]);

  function handleToggleSelectAll() {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  }

  function handleToggleSelectOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleSort(field: ProductSortField) {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  async function handleDelete(id: string) {
    const product = products.find((item) => item.id === id);
    if (!window.confirm(`Deactivate ${product?.name ?? "this product"}? It will be removed from the active product list.`)) return;
    await apiPatch(`/catalog/products/${id}`, { status: "INACTIVE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  const loadProducts = useCallback(async () => {
    const params = new URLSearchParams({ page: String(currentPage), pageSize: String(rowsPerPage), status: "ACTIVE" });
    if (branchId) params.set("branchId", branchId);
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory !== "All") params.set("categoryId", selectedCategory);
    if (selectedBrand !== "All") params.set("brandId", selectedBrand);
    const result = await apiGet<ProductPage>(`/catalog/products?${params}`);
    setProducts(result.data.map((product) => ({ id: product.id, sku: product.sku, name: product.name, category: product.category?.name ?? "Uncategorized", brand: product.brand?.name ?? "Unbranded", price: Number(product.sellingPrice), unit: product.unit ?? "unit", qty: product.stockLevels.reduce((sum, stock) => sum + Number(stock.quantityOnHand), 0), createdBy: "TechNova", productImage: product.images[0]?.url ?? "/TechNova.svg", avatarImage: "/TechNova.svg" })));
    setTotalPages(Math.max(1, result.meta.pageCount));
  }, [branchId, currentPage, rowsPerPage, searchQuery, selectedBrand, selectedCategory]);

  useEffect(() => { const timer = setTimeout(() => void loadProducts(), 250); return () => clearTimeout(timer); }, [loadProducts]);
  useEffect(() => { void Promise.all([apiGet<Lookup[]>("/catalog/categories"), apiGet<Lookup[]>("/catalog/brands")]).then(([categoryRows, brandRows]) => { setCategories(categoryRows); setBrands(brandRows); }); }, []);
  useEffect(() => setCurrentPage(1), [branchId, rowsPerPage, searchQuery, selectedBrand, selectedCategory]);

  function handleRefresh() {
    void loadProducts();
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setSelectedIds([]);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6">
      {/* Top Header Row (Title, Breadcrumbs, Action Badges/Buttons) */}
      <ProductListHeader
        onRefresh={handleRefresh}
        isCollapsed={isFilterCollapsed}
        onToggleCollapse={() => setIsFilterCollapsed((prev) => !prev)}
        onImport={() => setIsImportOpen(true)}
        onExportCsv={() => void exportCsv()}
        onExportPdf={() => void exportPdf()}
        exporting={exporting}
      />
      {exportError && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{exportError}</div>}

      {/* Main Content Card */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs">
        {/* Sub-Bar: Search & Filters (Collapsible) */}
        {!isFilterCollapsed && (
          <ProductListFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            categories={categories}
            brands={brands}
          />
        )}

        {/* Table UI */}
        <ProductListTable
          products={filteredProducts}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onDelete={handleDelete}
        />

        {/* Pagination Controls */}
        <ProductListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>
      <ProductImportDialog
        open={isImportOpen}
        categories={categories}
        brands={brands}
        onClose={() => setIsImportOpen(false)}
        onImported={loadProducts}
      />
    </main>
  );
}
