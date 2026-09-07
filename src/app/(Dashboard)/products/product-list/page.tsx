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
        onImport={() => alert("Import product modal / CSV upload triggered")}
      />

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
    </main>
  );
}
