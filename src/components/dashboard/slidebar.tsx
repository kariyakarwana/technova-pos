'use client'

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
  Megaphone,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Point of Sale', icon: Tag, href: '/pos' },
  { name: 'Sales', icon: ReceiptText, href: '/sales' },
  { name: 'Products', icon: Package, href: '/products' },
  { name: 'Inventory', icon: Boxes, href: '/inventory' },
  { name: 'Purchases', icon: ShoppingCart, href: '/purchases' },
  { name: 'Suppliers', icon: Truck, href: '/suppliers' },
  { name: 'Customers', icon: Users, href: '/customers' },
  { name: 'Returns & Refunds', icon: RotateCcw, href: '/returns-refunds' },
  { name: 'AI Intelligence', icon: Bot, href: '/ai-intelligence' },
  { name: 'Employees', icon: UserCog, href: '/employees' },
  { name: 'Branches', icon: GitFork, href: '/branches' },
  { name: 'Promotions', icon: Megaphone, href: '/promotions' },
] as const

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Dashboard navigation"
      className="flex flex-col space-y-2 px-4 py-3 w-full"
    >
      {navItems.map((item) => {
        const IconComponent = item.icon

        const isActive =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={[
              // Base pill shape + layout
              'relative flex items-center h-11 w-full rounded-[16px]',
              'transition-all duration-200 ease-in-out',
              isActive
                // ── Active: filled dark-green pill ──
                ? [
                  'bg-[#004532] border-[1.5px] border-[#004532]',
                  'shadow-md shadow-[#004532]/25',
                  'font-semibold',
                ].join(' ')
                // ── Inactive: outlined teal pill ──
                : [
                  'bg-white border-[1.5px] border-[#0E9384]',
                  'hover:bg-[#EEFFFD]',
                  'font-medium',
                ].join(' '),
            ].join(' ')}
          >
            {/* Icon — pinned to the left */}
            <span className="absolute left-4 flex items-center justify-center">
              <IconComponent
                className={[
                  'h-5 w-5 shrink-0 transition-colors duration-200',
                  isActive ? 'text-white' : 'text-[#0E9384]',
                ].join(' ')}
                aria-hidden="true"
              />
            </span>

            {/* Label — centered in the full pill width */}
            <span
              className={[
                'flex-1 text-center text-sm pr-9 transition-colors duration-200',
                isActive ? 'text-white font-semibold' : 'text-[#0E9384]',
              ].join(' ')}
            >
              {item.name}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}