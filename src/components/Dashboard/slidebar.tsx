'use client' 

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Tag, 
  ReceiptText, 
  Package, 
  Boxes, 
  ShoppingCart, 
  Truck, 
  Users, 
  RotateCcw, 
  Bot, 
  UserCog, 
  GitFork, 
  Megaphone 
} from 'lucide-react'

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Point of Sale", icon: Tag, href: "/pos" },
  { name: "Sales", icon: ReceiptText, href: "/sales" },
  { name: "Products", icon: Package, href: "/products" },
  { name: "Inventory", icon: Boxes, href: "/inventory" },
  { name: "Purchases", icon: ShoppingCart, href: "/purchases" },
  { name: "Suppliers", icon: Truck, href: "/suppliers" },
  { name: "Customers", icon: Users, href: "/customers" },
  { name: "Returns & Refunds", icon: RotateCcw, href: "/returns" },
  { name: "AI Intelligence", icon: Bot, href: "/ai" },
  { name: "Employees", icon: UserCog, href: "/employees" },
  { name: "Branches", icon: GitFork, href: "/branches" },
  { name: "Promotions", icon: Megaphone, href: "/promotions" },
];

export default function Sidebar() {
  const pathname = usePathname(); 

  return (
    <div className="w-64 bg-white p-4 flex flex-col gap-3 font-sans h-screen border-r">
      {navItems.map((item, index) => {
        const IconComponent = item.icon;
        
   
        const isActive = pathname === item.href;

        const linkStyles = isActive
          ? "bg-[#025148] text-white shadow-md"
          : "border border-[#025148]/30 text-[#025148] hover:bg-[#025148]/5";

        return (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${linkStyles}`}
          >
            <IconComponent size={20} />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}