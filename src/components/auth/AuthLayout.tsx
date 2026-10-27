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
    <div className="min-h-screen min-h-dvh w-full bg-[#eef2f6] flex items-center justify-center p-3 sm:p-5 lg:p-8">
      <div className="w-full max-w-[420px] lg:max-w-[780px] xl:max-w-[820px] rounded-2xl bg-white shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 my-auto">
        {/* ── Left column: logo + form + footer ── */}
        <section className="flex flex-col justify-between p-5 sm:p-7 lg:p-7 xl:p-8 min-h-0">
          <div className="mb-2 sm:mb-3 flex shrink-0 justify-center">
            <Image
              src="/technova-logo.webp"
              alt="TechNova"
              width={160}
              height={51}
              priority
              className="h-auto w-32 sm:w-36 object-contain"
              style={{ height: "auto" }}
            />
          </div>

          <div className="w-full max-w-[320px] sm:max-w-[340px] mx-auto my-auto py-1">{children}</div>

          <div className="shrink-0 mt-3 sm:mt-4 text-center">
            {footerNotice && (
              <p className="text-[11px] leading-snug text-slate-400 text-center mb-1.5">
                {footerNotice}
              </p>
            )}
            <p className="text-[11px] leading-snug text-slate-400 text-center">
              {new Date().getFullYear()} © TechNova. All Rights Reserved
            </p>
          </div>
        </section>

        {/* ── Right column: banner image (hidden on mobile) ── */}
        <section className="relative hidden lg:block lg:min-h-[440px] w-full overflow-hidden">
          <Image
            src="/auth-banner.jpg"
            alt="TechNova POS retail store"
            fill
            sizes="(min-width: 1024px) 410px, 50vw"
            priority
            className="object-cover object-center"
          />
        </section>
      </div>
    </div>
  );
}
