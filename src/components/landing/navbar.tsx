"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header
            className="w-full border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm"
            style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}
        >
            <div className="w-full px-5 lg:px-6 flex items-center justify-between py-4">


                <div className="flex items-center gap-8">

                    <Link href="/" className="flex items-center gap-3 shrink-0">
                        <div className="relative flex items-center">
                            <Image
                            src="/technova-logo.svg"
                            alt="TechNova"
                            width={200}
                            height={48}
                            className="h-auto w-36 object-contain sm:w-48 lg:w-[200px]"
                            style={{ height: "auto" }}
                            priority
                            />
                        </div>
                    </Link>


                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className={`font-semibold text-lg lg:text-xl transition px-3 py-1 ${pathname === "/"
                                    ? "text-teal-600 hover:text-teal-700"
                                    : "text-black hover:text-teal-600"
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/features"
                            className={`font-medium text-lg lg:text-xl transition px-2 py-1 ${pathname === "/features"
                                    ? "text-teal-600 hover:text-teal-700"
                                    : "text-black hover:text-teal-600"
                                }`}
                        >
                            Features
                        </Link>
                    </nav>
                </div>


                <div className="hidden md:flex items-center gap-4 shrink-0">
                    <Button
                    asChild
                    variant="outline"
                    className="border-teal-600 px-5 py-5 text-sm font-semibold text-teal-600 hover:bg-teal-50 lg:text-base"
                    >
                    <Link href="/login">
                        Login
                    </Link>
                    </Button>

                    <Button
                    asChild
                    className="bg-teal-600 px-7 py-5 text-sm font-semibold text-white shadow-md hover:bg-teal-700 lg:text-base"
                    >
                    <Link href="/register">
                        Get Started
                    </Link>
                    </Button>
                </div>


                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-slate-700 hover:text-teal-600 focus:outline-none cursor-pointer"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>

            </div>


            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg px-6 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className={`font-semibold text-lg transition px-3 py-2 rounded-lg ${pathname === "/"
                                ? "text-teal-600 bg-teal-50"
                                : "text-black hover:bg-slate-50 hover:text-teal-600"
                            }`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/features"
                        onClick={() => setIsOpen(false)}
                        className={`font-medium text-lg transition px-3 py-2 rounded-lg ${pathname === "/features"
                                ? "text-teal-600 bg-teal-50"
                                : "text-black hover:bg-slate-50 hover:text-teal-600"
                            }`}
                    >
                        Features
                    </Link>

                    <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                        <Button
                        asChild
                        variant="outline"
                        className="w-full border-teal-600 py-3 text-base font-semibold text-teal-600 hover:bg-teal-50"
                        >
                        <Link
                            href="/login"
                            onClick={() =>
                            setIsOpen(false)
                            }
                        >
                            Login
                        </Link>
                        </Button>

                        <Link href="/register" onClick={() => setIsOpen(false)}>
                            <Button
                                className="w-full bg-teal-600 text-white hover:bg-teal-700 font-sans cursor-pointer py-3 text-base font-semibold shadow-md"
                            >
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
