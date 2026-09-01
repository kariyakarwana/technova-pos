"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Maximize,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

interface NavbarProps {
  userEmail?: string | null;
}

export default function Navbar({ userEmail }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSignOut() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  const displayEmail = userEmail ?? "admin@technova.com";

  return (
    <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#E6EAED] bg-white px-6">
      <Image
        src="/TechNova.svg"
        alt="TechNova Logo"
        width={140}
        height={36}
        priority
        className="h-9 w-auto object-contain"
      />

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 rounded-lg border border-[#0E9384] bg-white px-2.5 py-1">
          <span className="text-xs font-medium text-slate-500">Branch</span>
          <div className="relative">
            <select
              id="branch-selector"
              className="cursor-pointer appearance-none bg-transparent pr-5 text-xs font-medium text-[#212B36] focus:outline-none"
            >
              <option>Branch 1</option>
              <option>Branch 2</option>
              <option>Branch 3</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <button
          id="navbar-add-btn"
          type="button"
          className="flex h-8 items-center gap-1 rounded-lg border border-[#0E9384] px-2.5 text-xs font-medium text-[#0E9384] transition-colors hover:bg-[#EEFFFD]"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>

        <button
          id="navbar-fullscreen-btn"
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#0E9384] text-[#0E9384] transition-colors hover:bg-[#EEFFFD]"
          onClick={() =>
            document.fullscreenElement
              ? document.exitFullscreen()
              : document.documentElement.requestFullscreen()
          }
          aria-label="Toggle fullscreen"
        >
          <Maximize className="h-4 w-4" />
        </button>

        <Link
          href="/notification"
          id="navbar-notifications-btn"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#0E9384] text-[#0E9384] transition-colors hover:bg-[#EEFFFD]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </Link>

        <button
          id="navbar-settings-btn"
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#0E9384] text-[#0E9384] transition-colors hover:bg-[#EEFFFD]"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        <div className="relative ml-1" ref={dropdownRef}>
          <button
            id="navbar-profile-btn"
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            className="h-8 w-8 overflow-hidden rounded-full border-2 border-slate-200 transition-colors hover:border-[#025148]/40 focus:outline-none focus:ring-2 focus:ring-[#025148]/30"
            aria-label="Open profile menu"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
              alt="User Profile"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </button>

          {dropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg shadow-slate-200/60"
            >
              <div className="border-b border-slate-100 px-3.5 py-2.5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Signed in as
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                  {displayEmail}
                </p>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard/profile"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" /> My Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" /> Account Settings
                </Link>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  role="menuitem"
                  type="button"
                  onClick={handleSignOut}
                  disabled={isPending}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {isPending ? "Signing out…" : "Sign out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
