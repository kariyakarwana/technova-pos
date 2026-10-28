"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2EBE6]/80 bg-[#F4F8F6]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/technova-logo.webp"
            alt="TechNova"
            width={140}
            height={44}
            priority
            className="h-7 w-auto object-contain sm:h-8"
          />
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          <Link
            href="#features"
            className="text-xs sm:text-sm font-medium text-[#0F3B32] hover:text-[#0E9384] transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-xs sm:text-sm font-medium text-[#0F3B32] hover:text-[#0E9384] transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#how-it-works"
            className="text-xs sm:text-sm font-medium text-[#0F3B32] hover:text-[#0E9384] transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#contact"
            className="text-xs sm:text-sm font-medium text-[#0F3B32] hover:text-[#0E9384] transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Right: Auth & CTA */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-medium text-[#0F3B32] hover:text-[#0E9384] transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-[#0D5C4E] hover:bg-[#0B4E42] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 shadow-xs transition-all"
          >
            Request demo
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#0F3B32] hover:text-[#0E9384] focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-[#E2EBE6] bg-[#F4F8F6] px-5 py-5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3">
            <Link
              href="#features"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-sm font-medium text-[#0F3B32] hover:bg-white/60 rounded-lg transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-sm font-medium text-[#0F3B32] hover:bg-white/60 rounded-lg transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-sm font-medium text-[#0F3B32] hover:bg-white/60 rounded-lg transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-sm font-medium text-[#0F3B32] hover:bg-white/60 rounded-lg transition-colors"
            >
              Contact
            </Link>

            <div className="flex flex-col gap-2.5 pt-3 border-t border-[#E2EBE6] mt-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-[#0F3B32] hover:text-[#0E9384]"
              >
                Log in
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center rounded-full bg-[#0D5C4E] hover:bg-[#0B4E42] text-white py-2.5 text-sm font-semibold shadow-xs"
              >
                Request demo
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
