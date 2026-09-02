"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type ProductItem,
} from "@/components/dashboard/products/products.mock";
import { apiGet, apiPatch } from "@/lib/api/client";
import { useBranch } from "@/components/dashboard/BranchContext";

type ApiProduct = { id: string; sku: string; name: string; sellingPrice: string | number; unit?: string; images: Array<{ url: string }>; category: { name: string } | null; brand: { name: string } | null; stockLevels: Array<{ quantityOnHand: string | number }> };
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

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const brands = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.brand)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedBrand !== "All") {
      result = result.filter((p) => p.brand === selectedBrand);
    }

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
  }, [products, searchQuery, selectedCategory, selectedBrand, sortField, sortOrder]);

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
    const result = await apiGet<{ data: ApiProduct[]; totalPages: number }>(`/catalog/products?${params}`);
    setProducts(result.data.map((product) => ({ id: product.id, sku: product.sku, name: product.name, category: product.category?.name ?? "Uncategorized", brand: product.brand?.name ?? "Unbranded", price: Number(product.sellingPrice), unit: product.unit ?? "unit", qty: product.stockLevels.reduce((sum, stock) => sum + Number(stock.quantityOnHand), 0), createdBy: "TechNova", productImage: product.images[0]?.url ?? "/TechNova.svg", avatarImage: "/TechNova.svg" })));
    setTotalPages(result.totalPages);
  }, [branchId, currentPage, rowsPerPage]);

  useEffect(() => { void loadProducts(); }, [loadProducts]);

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
