import Link from "next/link";

import type {
  Metadata,
} from "next";

export const metadata: Metadata = {
  title:
    "Access denied | TechNova POS",
};

export default function ForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wider text-red-600">
          Access denied
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          You cannot access this page
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          Your account is authenticated,
          but it does not have the required
          permission. Contact your system
          administrator if you believe this
          is incorrect.
        </p>

        <Link
          href="/dashboard"
          className="mt-7 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Return to dashboard
        </Link>
      </section>
    </main>
  );
}