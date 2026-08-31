import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface NavigationActionCardProps {
  /** Card label displayed below the icon. */
  title: string;
  /** Route the card navigates to when clicked. */
  href: string;
  /** Any Lucide icon component. */
  icon: LucideIcon;
}

/**
 * NavigationActionCard — a deep-teal pill/tile used on hub pages
 * (e.g. Purchases) to navigate to a sub-section.
 *
 * Usage:
 * ```tsx
 * import { ShoppingCart } from "lucide-react";
 * <NavigationActionCard title="New Purchase" href="/purchases/new" icon={ShoppingCart} />
 * ```
 */
export default function NavigationActionCard({
  title,
  href,
  icon: Icon,
}: NavigationActionCardProps) {
  return (
    <Link
      href={href}
      className={[
        // Shape & colour
        "flex flex-col items-center justify-center gap-3",
        "bg-[#1E5D57] text-white",
        "rounded-2xl px-6 py-8",
        "w-full min-h-[160px]",
        // Elevation + smooth lift on hover
        "shadow-sm",
        "transition-all duration-200 ease-in-out",
        "hover:-translate-y-1 hover:bg-[#184c47]",
        "hover:shadow-md hover:shadow-[#1E5D57]/30",
        // Focus ring for accessibility
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E9384] focus-visible:ring-offset-2",
      ].join(" ")}
    >
      {/* Icon */}
      <span className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/10">
        <Icon className="h-6 w-6 text-white" aria-hidden="true" />
      </span>

      {/* Label */}
      <span className="text-sm font-semibold text-white text-center leading-tight">
        {title}
      </span>
    </Link>
  );
}
