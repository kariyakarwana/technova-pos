import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Breadcrumb {
  label: string;
  /** Omit href for the current (last) crumb — it renders as plain text. */
  href?: string;
}

interface PageHeaderProps {
  /** Page title rendered as the primary heading. */
  title: string;
  /**
   * Ordered list of breadcrumb segments.
   * The last item should have no `href` (it is the current page).
   */
  breadcrumbs: Breadcrumb[];
  /**
   * Optional JSX rendered on the right side of the header
   * (e.g. a primary action button).
   */
  actionButton?: React.ReactNode;
}

/**
 * PageHeader — consistent header block used at the top of every
 * dashboard sub-page. Renders a title + breadcrumb trail and an
 * optional action slot aligned to the far right.
 */
export default function PageHeader({
  title,
  breadcrumbs,
  actionButton,
}: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
      {/* Left: breadcrumbs + title */}
      <div className="flex flex-col gap-1">
        {/* Breadcrumb trail */}
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-0.5 flex-wrap">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <li key={index} className="flex items-center gap-0.5">
                    {/* Divider — skip before first item */}
                    {index > 0 && (
                      <ChevronRight
                        className="h-3 w-3 text-slate-300 shrink-0"
                        aria-hidden="true"
                      />
                    )}

                    {isLast || !crumb.href ? (
                      /* Current page — non-clickable */
                      <span
                        className="text-xs text-slate-400 font-medium"
                        aria-current={isLast ? "page" : undefined}
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      /* Ancestor — clickable link */
                      <Link
                        href={crumb.href}
                        className="text-xs text-slate-400 font-medium hover:text-[#0E9384] transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {/* Page title */}
        <h1 className="text-xl font-bold text-[#212B36] leading-tight">
          {title}
        </h1>
      </div>

      {/* Right: optional action button */}
      {actionButton && (
        <div className="shrink-0 flex items-center pt-1">{actionButton}</div>
      )}
    </header>
  );
}
