import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-6 px-4 text-center text-sm text-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2">
        <p>© 2026 TechNova International. All rights reserved.</p>
        
       
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-slate-900 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-slate-900 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}