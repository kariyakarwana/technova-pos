"use client";

import Image from "next/image";
import type { UserProfileInfo } from "./profile-settings.mock";

interface ProfileInfoSidebarCardProps {
  user: UserProfileInfo;
  onEditProfile?: () => void;
}

export default function ProfileInfoSidebarCard({
  user,
  onEditProfile,
}: ProfileInfoSidebarCardProps) {
  return (
    <div className="bg-white border border-[var(--brand-stroke)] rounded-2xl p-5 shadow-xs flex items-center gap-4">
      {/* Avatar */}
      <div className="h-14 w-14 rounded-2xl overflow-hidden relative border-2 border-slate-100 shrink-0 bg-slate-100 shadow-2xs">
        <Image
          src={user.avatar}
          alt={user.name}
          fill
          className="object-cover"
        />
      </div>

      {/* User Details */}
      <div className="space-y-0.5 min-w-0 flex-1">
        <h3 className="text-sm font-bold text-[var(--brand-black-font)] truncate">
          {user.name}
        </h3>
        <p className="text-xs text-slate-400 font-medium truncate">
          {user.role}
        </p>
        <button
          type="button"
          onClick={onEditProfile}
          className="text-[11px] text-[var(--brand-green)] hover:underline font-semibold transition-all pt-0.5 block cursor-pointer"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
