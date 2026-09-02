import type { Metadata } from "next";
import { Archive, BadgeCheck, LayoutGrid, ScanBarcode } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import NavigationActionCard from "@/components/common/NavigationActionCard";

export const metadata: Metadata = {
  title: "Products | TechNova POS",
};

const productActions = [
  {
    title: "View Products",
    href: "/products/product-list",
    icon: Archive,
  },
  {
    title: "View Categories",
    href: "/products/categories",
    icon: LayoutGrid,
  },
  {
    title: "Manage Brands",
    href: "/products/brands",
    icon: BadgeCheck,
  },
  {
    title: "Barcode Operations",
    href: "/products/barcode",
    icon: ScanBarcode,
  },
] as const;

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#F9F9FF]">
      {/* Header + breadcrumb trail */}
      <PageHeader
        title="Products"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Products" },
        ]}
      />

      {/* Mode selection card */}
      <div className="px-6 pb-8">
        <div className="pos-card min-h-[520px] flex items-center justify-center p-8">
          <div className="flex flex-row flex-wrap items-center justify-center gap-6 md:gap-8 w-full">
            {productActions.map((action) => (
              <NavigationActionCard
                key={action.href}
                title={action.title}
                href={action.href}
                icon={action.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
