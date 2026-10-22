import type { ReactNode } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
  footerNotice?: ReactNode;
}

/** Split-screen auth layout: form panel (left) + hero image (right, hidden on mobile).
 *  The two columns are wrapped in a centred card on a #eef2f6 page background.
 */
export function AuthLayout({ children, footerNotice }: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden w-full bg-[#eef2f6] flex items-center justify-center p-4 sm:p-6 lg:p-6">
      <div className="w-full max-w-[820px] min-h-[560px] lg:h-[min(625px,calc(100vh-3rem))] rounded-2xl bg-white shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* ── Left column: logo + form + footer ── */}
        <section className="flex flex-col justify-between gap-3 px-6 py-6 sm:px-10 sm:py-8 lg:h-full">
          <div className="mb-2 flex shrink-0 justify-center">
            <Image
              src="/technova-logo.webp"
              alt="TechNova"
              width={192}
              height={61}
              priority
              className="h-auto w-40 object-contain lg:w-32"
              style={{ height: "auto" }}
            />
          </div>

          <div className="w-full max-w-[310px] mx-auto">{children}</div>

          <div className="shrink-0 mt-2 text-center">
            {footerNotice && (
              <p className="text-[10px] leading-snug text-slate-400 text-center mb-2">
                {footerNotice}
              </p>
            )}
            <p className="text-[10px] leading-snug text-slate-400 text-center">
              {new Date().getFullYear()} © TechNova. All Rights Reserved
            </p>
          </div>
        </section>

        {/* ── Right column: banner image (hidden on mobile) ── */}
        <section className="relative hidden lg:block lg:h-full w-full overflow-hidden">
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
