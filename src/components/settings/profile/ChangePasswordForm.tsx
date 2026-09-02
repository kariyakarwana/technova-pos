"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";
import { apiPost } from "@/lib/api/client";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword) {
      return setMessage("Please enter your current password.");
    }
    if (!newPassword) {
      return setMessage("Please enter your new password.");
    }
    if (newPassword !== confirmPassword) {
      return setMessage("New password and confirmation do not match.");
    }

    setIsUpdating(true);
    setMessage(null);
    try {
      await apiPost("/auth/change-password", { currentPassword, newPassword });
      setMessage("Password updated. Sign in again on your other devices.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update password."); }
    finally { setIsUpdating(false); }
  }

  return (
    <div className="bg-white border border-[var(--brand-stroke)] rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center text-[var(--brand-green)]">
          <Lock className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
          Password
        </h2>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleUpdatePassword} className="space-y-4">
        {message && <p role="status" className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">{message}</p>}
        {/* Current Password */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            CURRENT PASSWORD
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3.5 pr-10 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
            >
              {showCurrent ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            NEW PASSWORD
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3.5 pr-10 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
            >
              {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            CONFIRM NEW PASSWORD
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3.5 pr-10 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
            >
              {showConfirm ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="h-10 px-5 rounded-xl bg-[#0E7A6E] hover:bg-[#0C6A60] active:scale-[0.98] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Password"}
          </button>

          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-[var(--brand-green)] text-[var(--brand-green)] bg-white hover:bg-emerald-50/40 text-xs font-semibold shadow-2xs transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}
