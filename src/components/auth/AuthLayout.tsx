import type { ReactNode } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
}

/** Split-screen auth layout: form panel (left) + hero image (right, hidden on mobile).
 *  The two columns are wrapped in a centred card on a slate-100 page background.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:h-screen w-full bg-slate-100 flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-hidden">
      <div className="max-w-5xl w-full max-h-[92vh] overflow-hidden rounded-3xl shadow-xl border border-slate-100 bg-white grid grid-cols-1 lg:grid-cols-2">

        {/* ── Left column: logo + form + footer ── */}
        <section className="flex flex-col p-6 sm:p-8 lg:px-10 lg:py-6">
          <div className="flex justify-center pt-2 pb-2">
            <Image
              src="/technova-logo.svg"
              alt="TechNova"
              width={160}
              height={48}
              priority
              className="h-auto w-40 object-contain"
              style={{ height: "auto" }}
            />
          </div>

          <div className="flex flex-1 items-center justify-center py-6">
            <div className="w-full max-w-sm">{children}</div>
          </div>

          <div className="pb-2 text-center">
            <p className="text-xs text-slate-400">
              {new Date().getFullYear()} © TechNova. All Right Reserved
            </p>
          </div>
        </section>

        {/* ── Right column: banner image (hidden on mobile) ── */}
        <section className="relative hidden overflow-hidden rounded-r-3xl lg:block">
          <Image
            src="/auth-banner.jpg"
            alt="TechNova POS retail store"
            fill
            sizes="50vw"
            priority
            className="object-cover object-center"
          />
        </section>

      </div>
    </div>
  );
}
