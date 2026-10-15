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
    <div className="min-h-dvh w-full bg-slate-100 flex items-center justify-center p-3 sm:p-4 lg:h-dvh lg:p-6 lg:overflow-hidden">
      <div className="max-w-5xl w-full overflow-hidden rounded-3xl shadow-xl border border-slate-100 bg-white grid grid-cols-1 lg:h-fit lg:max-h-[96dvh] lg:grid-cols-2">

        {/* ── Left column: logo + form + footer ── */}
        <section className="flex flex-col p-4 sm:p-6 lg:min-h-0 lg:px-10 lg:py-3">
          <div className="mb-8 flex shrink-0 justify-center pt-1 pb-1 lg:mb-3">
            <Image
              src="/technova-logo.webp"
              alt="TechNova"
              width={192}
              height={61}
              priority
              className="h-auto w-48 object-contain lg:w-40"
              style={{ height: "auto" }}
            />
          </div>

          <div className="shrink-0">
            <div className="w-full max-w-sm lg:mx-auto">{children}</div>
          </div>

          <div className="shrink-0 pb-1 pt-1 text-center">
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
