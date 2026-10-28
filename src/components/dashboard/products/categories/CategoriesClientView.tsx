"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MOCK_CATEGORIES, TOTAL_PAGES, type CategoryItem } from "./CategoriesMock";
import CategoriesHeader from "./CategoriesHeader";
import CategoriesFilterBar from "./CategoriesFilterBar";
import CategoriesTable from "./CategoriesTable";
import CategoriesPagination from "./CategoriesPagination";

export default function CategoriesClientView() {
  const [categories, setCategories] = useState<CategoryItem[]>(MOCK_CATEGORIES);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchSearch =
        search === "" ||
        c.category.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.cid.toLowerCase().includes(search.toLowerCase()) ||
        c.createdBy.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === "Category" || c.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [categories, search, selectedCategory]);

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(filteredCategories.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  }

  function handleSelectRow(id: string, checked: boolean) {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <CategoriesHeader
        onRefresh={() => setCategories(MOCK_CATEGORIES)}
        onExportPdf={() => toast.info("Exporting Category List to PDF...", { duration: 5000 })}
        onExportExcel={() => toast.info("Exporting Category List to Excel...", { duration: 5000 })}
        onImport={() => toast.info("Importing Categories...", { duration: 5000 })}
      />

      {/* 2. Filter Bar */}
      <CategoriesFilterBar
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* 3. Table */}
      <CategoriesTable
        categories={filteredCategories}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onDelete={handleDelete}
      />

      {/* 4. Pagination */}
      <CategoriesPagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </main>
  );
}
