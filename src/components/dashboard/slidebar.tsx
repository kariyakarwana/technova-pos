"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellRing,
  Bot,
  Boxes,
  GitFork,
  HandCoins,
  LayoutDashboard,
  Megaphone,
  Package,
  QrCode,
  ReceiptText,
  RotateCcw,
  ShoppingCart,
  Tag,
  Truck,
  UserCog,
  Users,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Point of Sale", icon: Tag, href: "/pos" },
  { name: "Sales", icon: ReceiptText, href: "/sales" },
  { name: "Products", icon: Package, href: "/products" },
  { name: "Inventory", icon: Boxes, href: "/inventory" },
  { name: "Warranty & QR", icon: QrCode, href: "/warranties" },
  { name: "Purchases", icon: ShoppingCart, href: "/purchases" },
  { name: "Suppliers", icon: Truck, href: "/suppliers" },
  { name: "Customers", icon: Users, href: "/customers" },
  { name: "Credit Management", icon: HandCoins, href: "/credit" },
  { name: "Returns & Refunds", icon: RotateCcw, href: "/returns-refunds" },
  { name: "AI Intelligence", icon: Bot, href: "/ai-intelligence" },
  { name: "Employees", icon: UserCog, href: "/employees" },
  { name: "Branches", icon: GitFork, href: "/branches" },
  { name: "Promotions", icon: Megaphone, href: "/promotions" },
  { name: "Notification Admin", icon: BellRing, href: "/notifications" },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard navigation"
      className="flex w-full flex-col space-y-2 px-4 py-3"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex h-11 w-full items-center rounded-[16px] border-[1.5px] font-medium transition-all duration-200 ${
              isActive
                ? "border-[#004532] bg-[#004532] font-semibold shadow-md shadow-[#004532]/25"
                : "border-[#0E9384] bg-white hover:bg-[#EEFFFD]"
            }`}
          >
            <span className="absolute left-4 flex items-center justify-center">
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  isActive ? "text-white" : "text-[#0E9384]"
                }`}
                aria-hidden="true"
              />
            </span>
            <span
              className={`flex-1 pr-9 text-center text-sm ${
                isActive ? "font-semibold text-white" : "text-[#0E9384]"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
