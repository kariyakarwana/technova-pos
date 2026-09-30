import { microsoftSignInAction } from "@/lib/auth/actions";

function MicrosoftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path fill="#f25022" d="M1 1h8.5v8.5H1z" />
      <path fill="#7fba00" d="M10.5 1H19v8.5h-8.5z" />
      <path fill="#00a4ef" d="M1 10.5h8.5V19H1z" />
      <path fill="#ffb900" d="M10.5 10.5H19V19h-8.5z" />
    </svg>
  );
}

export function MicrosoftButton() {
  return (
    <form action={microsoftSignInAction}>
      <button
        type="submit"
        className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0e9f90]"
      >
        <MicrosoftIcon />
        Continue with Microsoft
      </button>
    </form>
  );
}
