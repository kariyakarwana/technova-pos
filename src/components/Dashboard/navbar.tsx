"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Maximize,
  Plus,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";

interface NavbarProps {
  userEmail?: string | null;
}

export default function Navbar({ userEmail }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
    <nav className="bg-white border-b border-[#E6EAED] h-16 px-6 flex items-center justify-between sticky top-0 z-40 w-full">
      {/* Left — Logo */}
      <div className="flex items-center">
        <div className="flex items-center">
          <Image
            src="/TechNova.svg"
            alt="TechNova Logo"
            width={140}
            height={36}
            priority
            className="h-9 w-auto object-contain"
          />
        </div>



      </div>


      {/* Right — Controls */}
      <div className="flex items-center gap-2.5">
        {/* Inline Branch Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 border border-[#0E9384] rounded-lg bg-white">
          <span className="text-xs text-slate-500 font-medium">Branch</span>
          <div className="relative">
            <select
              id="branch-selector"
              className="appearance-none bg-transparent text-xs text-[#212B36] pr-5 focus:outline-none cursor-pointer font-medium"
            >
              <option>Branch 1</option>
              <option>Branch 2</option>
              <option>Branch 3</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Add Button */}
        <button
          id="navbar-add-btn"
          className="flex items-center gap-1 h-8 px-2.5 text-xs border border-[#0E9384] text-[#0E9384] hover:bg-[#EEFFFD] rounded-lg font-medium transition-colors"
        >
          <Plus size={13} />
          <span>Add</span>
        </button>

        {/* Fullscreen */}
        <button
          id="navbar-fullscreen-btn"
          className="h-8 w-8 flex items-center justify-center border border-[#0E9384] text-[#0E9384] hover:bg-[#EEFFFD] rounded-lg transition-colors"
          onClick={() =>
            document.fullscreenElement
              ? document.exitFullscreen()
              : document.documentElement.requestFullscreen()
          }
          aria-label="Toggle fullscreen"
        >
          <Maximize size={15} />
        </button>

        {/* Notifications */}
        <Link href="/notification" className="relative">
          <button
            id="navbar-notifications-btn"
            className="h-8 w-8 flex items-center justify-center border border-[#0E9384] text-[#0E9384] hover:bg-[#EEFFFD] rounded-lg transition-colors relative"
            aria-label="Notifications"
            type="button"
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
        </Link>

        {/* Settings */}
        <button
          id="navbar-settings-btn"
          className="h-8 w-8 flex items-center justify-center border border-[#0E9384] text-[#0E9384] hover:bg-[#EEFFFD] rounded-lg transition-colors"
          aria-label="Settings"
          type="button"
        >
          <Settings size={15} />
        </button>

        {/* Profile Avatar + Dropdown */}
        <div className="relative ml-1" ref={dropdownRef}>
          <button
            id="navbar-profile-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1 h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-[#025148]/30 transition-all"
            aria-label="Open profile menu"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-slate-200 hover:border-[#025148]/40 transition-colors">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                alt="User Profile"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-xl border border-slate-200 shadow-lg shadow-slate-200/60 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              {/* Header — current user email */}
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                  Signed in as
                </p>
                <p
                  className="text-xs text-slate-700 font-semibold mt-0.5 truncate"
                  title={displayEmail}
                >
                  {displayEmail}
                </p>
              </div>

              {/* Navigation links */}
              <div className="py-1">
                <Link
                  href="/dashboard/profile"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User size={14} className="text-slate-400" />
                  My Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings size={14} className="text-slate-400" />
                  Account Settings
                </Link>
              </div>

              {/* Sign out */}
              <div className="pt-1 border-t border-slate-100">
                <button
                  role="menuitem"
                  id="navbar-signout-btn"
                  onClick={handleSignOut}
                  disabled={isPending}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <LogOut size={14} />
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

