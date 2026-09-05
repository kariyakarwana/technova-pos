"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, LogOut, UserRound } from "lucide-react";
import { useTransition } from "react";
import { logoutAction } from "@/lib/auth/actions";

export default function SupplierPortalNavbar({
  userEmail,
}: {
  userEmail?: string | null;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <nav className="z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <Image src="/TechNova.svg" alt="TechNova" width={140} height={36} priority className="h-9 w-auto object-contain" />
      <div className="flex items-center gap-2">
        <Link href="/supplier-dashboard/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#0E9384] text-[#0E9384]" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Link>
        <div className="hidden items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:flex">
          <UserRound className="h-4 w-4 text-[#0E9384]" /> {userEmail}
        </div>
        <button type="button" disabled={pending} onClick={() => startTransition(() => logoutAction())} className="flex h-9 items-center gap-2 rounded-lg bg-[#025148] px-3 text-xs font-semibold text-white disabled:opacity-50">
          <LogOut className="h-4 w-4" /> {pending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </nav>
  );
}
