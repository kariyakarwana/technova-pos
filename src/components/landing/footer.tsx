import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#DDE8E2] bg-[#F4F8F6] py-8 text-xs text-[#4A6B63]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 sm:flex-row sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/technova-logo.webp"
            alt="TechNova"
            width={110}
            height={35}
            className="h-6 w-auto object-contain"
          />
        </Link>

        {/* Center: Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
          <Link href="#features" className="hover:text-[#0F3B32] transition-colors">
            Features
          </Link>
          <Link href="/privacy" className="hover:text-[#0F3B32] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#0F3B32] transition-colors">
            Terms of Service
          </Link>
          <Link href="#contact" className="hover:text-[#0F3B32] transition-colors">
            Contact
          </Link>
        </div>

        {/* Right: Copyright */}
        <p className="text-center sm:text-right">
          © {new Date().getFullYear()} TechNova
        </p>
      </div>
    </footer>
  );
}