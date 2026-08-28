import type {
  Metadata,
} from "next";

import {
  logoutAction,
} from "@/lib/auth/actions";

import {
  PERMISSIONS,
} from "@/lib/auth/permissions";

import {
  requirePermission,
} from "@/lib/auth/session";


export const metadata: Metadata = {
  title: "Dashboard | TechNova POS",
};

export default async function DashboardPage() {
  const user = await requirePermission(PERMISSIONS.DASHBOARD_VIEW);

  return (
    <main className="min-h-screen bg-slate-50">

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              TechNova POS
            </p>

            <h1 className="text-2xl font-bold text-slate-950">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-slate-900">
                {user.name ??
                  user.email}
              </p>

              <p className="text-sm text-slate-500">
                {user.roles.join(
                  ", ",
                )}
              </p>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Secure workspace
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            Welcome back,{" "}
            {user.name ??
              user.email}
          </h2>

          <p className="mt-3 max-w-2xl text-slate-600">
            Your backend API session is
            active and your current
            permissions have been loaded
            securely by TechNova POS.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <DashboardCard
              title="Sales"
              description="View and manage POS transactions."
            />

            <DashboardCard
              title="Inventory"
              description="Monitor stock and product availability."
            />

            <DashboardCard
              title="Analytics"
              description="Review business performance and insights."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 p-5">
      <h3 className="font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </article>
  );
}

