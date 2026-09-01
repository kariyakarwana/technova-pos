"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react";
import type { ProductItem } from "./products.mock";

export type ProductSortField = "name" | "sku" | "category" | "brand" | "price" | "unit" | "qty" | "createdBy";
export type SortOrder = "asc" | "desc";

interface ProductListTableProps {
  products: ProductItem[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  sortField: ProductSortField;
  sortOrder: SortOrder;
  onSort: (field: ProductSortField) => void;
  onDelete: (id: string) => void;
}

export default function ProductListTable({
  products,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  sortField,
  sortOrder,
  onSort,
  onDelete,
}: ProductListTableProps) {
  const isAllSelected =
    products.length > 0 && selectedIds.length === products.length;

  function renderSortIcon(field: ProductSortField) {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400" />;
    }
    return (
      <ArrowUpDown
        className={[
          "h-3 w-3 text-[#0E9384] transition-transform duration-150",
          sortOrder === "desc" ? "rotate-180" : "",
        ].join(" ")}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F9FAFB] text-slate-600 text-xs font-semibold border-b border-[#E4E7EC]">
            <th className="py-3 px-3 w-10 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onToggleSelectAll}
                className="rounded border-slate-300 text-[#0E9384] focus:ring-[#0E9384] cursor-pointer"
              />
            </th>

            <th
              onClick={() => onSort("name")}
              className="py-3 px-3 cursor-pointer hover:text-[#0E9384] transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span>Product Name</span>
                {renderSortIcon("name")}
              </div>
            </th>

            <th
              onClick={() => onSort("sku")}
              className="py-3 px-3 cursor-pointer hover:text-[#0E9384] transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span>SKU</span>
                {renderSortIcon("sku")}
              </div>
            </th>

            <th
              onClick={() => onSort("category")}
              className="py-3 px-3 cursor-pointer hover:text-[#0E9384] transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span>Category</span>
                {renderSortIcon("category")}
              </div>
            </th>

            <th
              onClick={() => onSort("brand")}
              className="py-3 px-3 cursor-pointer hover:text-[#0E9384] transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span>Brand</span>
                {renderSortIcon("brand")}
              </div>
            </th>

            <th
              onClick={() => onSort("price")}
              className="py-3 px-3 cursor-pointer hover:text-[#0E9384] transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span>Price</span>
                {renderSortIcon("price")}
              </div>
            </th>

            <th className="py-3 px-3">Unit</th>

            <th
              onClick={() => onSort("qty")}
              className="py-3 px-3 cursor-pointer hover:text-[#0E9384] transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span>Qty</span>
                {renderSortIcon("qty")}
              </div>
            </th>

            <th className="py-3 px-3">Created By</th>

            <th className="py-3 px-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#E4E7EC] text-xs text-[#1D2939]">
          {products.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-12 text-center text-slate-400">
                No products found matching your search criteria.
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const isSelected = selectedIds.includes(product.id);

              return (
                <tr
                  key={product.id}
                  className={[
                    "hover:bg-slate-50/70 transition-colors",
                    isSelected ? "bg-emerald-50/30" : "",
                  ].join(" ")}
                >
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOne(product.id)}
                      className="rounded border-slate-300 text-[#0E9384] focus:ring-[#0E9384] cursor-pointer"
                    />
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative h-8 w-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={product.productImage}
                          alt={product.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="font-semibold text-[#1D2939] truncate">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-medium text-slate-600">
                    {product.sku}
                  </td>

                  <td className="py-3 px-3 text-slate-600">
                    {product.category}
                  </td>

                  <td className="py-3 px-3 text-slate-600">
                    {product.brand}
                  </td>

                  <td className="py-3 px-3 font-bold text-[#1D2939]">
                    ${product.price.toFixed(2)}
                  </td>

                  <td className="py-3 px-3 text-slate-600">{product.unit}</td>

                  <td className="py-3 px-3 font-medium text-slate-700">
                    {product.qty}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="relative h-6 w-6 rounded-full overflow-hidden bg-slate-200 shrink-0">
                        <Image
                          src={product.avatarImage}
                          alt={product.createdBy}
                          fill
                          sizes="24px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="text-slate-600 truncate">
                        {product.createdBy}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/products/product-list/${product.id}`}
                        title="View Details"
                        className="p-1 rounded text-slate-400 hover:text-[#0E9384] hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/products/product-list/${product.id}`}
                        title="Edit Product"
                        className="p-1 rounded text-slate-400 hover:text-[#1E6DE2] hover:bg-slate-100 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete(product.id)}
                        title="Delete Product"
                        className="p-1 rounded text-slate-400 hover:text-[#D32F2F] hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
