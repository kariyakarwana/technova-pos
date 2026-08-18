import {
  redirect,
} from "next/navigation";

import type {
  Metadata,
} from "next";

import {
  auth,
} from "@/auth";

import {
  LoginForm,
} from "@/components/auth/login-form";

import {
  GoogleButton,
} from "@/components/auth/google-button";

export const metadata: Metadata = {
  title: "Sign in | TechNova POS",
};

export default async function LoginPage() {
  const session = await auth();

  if (
    session?.user?.id &&
    !session.invalid
  ) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500 text-xl font-bold">
            T
          </div>

          <span className="text-xl font-bold">
            TechNova POS
          </span>
        </div>

        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
            Intelligent retail
          </p>

          <h1 className="mt-5 text-5xl font-bold leading-tight">
            Smarter retail starts here.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100">
            Securely manage sales,
            inventory, customers and
            business insights from one
            workspace.
          </p>
        </div>

        <p className="text-sm text-blue-200">
          © {new Date().getFullYear()}{" "}
          TechNova
        </p>
      </section>

      <section className="flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <p className="text-xl font-bold text-slate-950">
              TechNova POS
            </p>
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
            Secure access
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
            Welcome back
          </h2>

          <p className="mt-3 text-slate-600">
            Sign in using your TechNova
            employee account.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <LoginForm />


        <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-semibold uppercase text-slate-400">
            Or
        </span>

        <div className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleButton />
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Access is limited to authorized
            TechNova employees.
          </p>
        </div>
      </section>
    </main>
  );
}