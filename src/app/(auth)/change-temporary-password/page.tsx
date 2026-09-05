import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/settings/profile/ChangePasswordForm";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export default async function ChangeTemporaryPasswordPage() {
  const user = await requireAuthenticatedUser("/change-temporary-password");
  if (!user.mustChangePassword)
    redirect(user.roles.includes("SUPPLIER") ? "/supplier-dashboard" : "/dashboard");
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0E9384]">First sign in</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Replace your temporary password</h1>
          <p className="mt-2 text-sm text-slate-500">Create a private password before using your account. You will need to sign in again afterward.</p>
        </div>
        <ChangePasswordForm redirectTo={user.roles.includes("SUPPLIER") ? "/supplier-dashboard" : "/dashboard"} />
      </div>
    </main>
  );
}
