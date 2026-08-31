import type { Metadata } from "next";
import Link from "next/link";
import { Archive, LayoutGrid } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

export const metadata: Metadata = {
  title: "Purchases | TechNova POS",
};

const modeCards = [
  {
    title: "Customer Purchases",
    href: "/purchases/customer",
    icon: Archive,
    description: "Manage purchases made by customers",
  },
  {
    title: "Purchases Fom Supplier",
    href: "/purchases/orders",
    icon: LayoutGrid,
    description: "Track and manage supplier orders",
  },
] as const;

export default function PurchasesPage() {
  return (
    <main className="min-h-screen bg-[#F9F9FF]">
      {/* Page header with breadcrumb */}
      <PageHeader
        title="Purchases"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Purchases" },
        ]}
      />

      {/* Main card container */}
      <div className="px-6 pb-8">
        <div
          className="pos-card min-h-[500px] flex items-center justify-center p-8"
        >
          {/* Mode selection tiles */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {modeCards.map(({ title, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                group-label={title}
                className={[
                  "group",
                  // Size & shape
                  "flex flex-col items-center justify-center",
                  "w-72 h-44 rounded-2xl",
                  // Colour
                  "bg-[#1E5D57] text-white",
                  // Spacing
                  "p-6",
                  // Elevation
                  "shadow-md",
                  // Transitions
                  "transition-all duration-200 ease-in-out",
                  // Hover
                  "hover:-translate-y-1 hover:bg-[#184c47] hover:shadow-xl",
                  // Cursor
                  "cursor-pointer",
                  // Focus
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2",
                ].join(" ")}
              >
                {/* Icon */}
                <Icon
                  className="h-12 w-12 text-white mb-4 transition-transform duration-200 group-hover:scale-105"
                  aria-hidden="true"
                />

                {/* Label */}
                <span className="text-lg font-bold text-center tracking-wide leading-tight">
                  {title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
