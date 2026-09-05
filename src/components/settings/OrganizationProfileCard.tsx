"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Clock, ImageIcon } from "lucide-react";
import type { OrganizationSettings } from "./settings.types";

interface OrganizationProfileCardProps {
  organization: OrganizationSettings;
  onChange: (value: OrganizationSettings) => void;
  onSave?: () => void;
  isSaving?: boolean;
  readOnly?: boolean;
}

export default function OrganizationProfileCard({
  organization,
  onChange,
  onSave,
  isSaving = false,
  readOnly = false,
}: OrganizationProfileCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [failedLogoUrl, setFailedLogoUrl] = useState("");
  const logoUrl = organization.branding?.logoUrl ?? "";
  function update<K extends keyof OrganizationSettings>(key: K, value: OrganizationSettings[K]) { onChange({ ...organization, [key]: value }); }
  function updateBranding(key: "logoUrl" | "receiptLogoUrl" | "primaryColor" | "secondaryColor", value: string) { onChange({ ...organization, branding: { logoUrl: null, receiptLogoUrl: null, primaryColor: null, secondaryColor: null, ...organization.branding, [key]: value || null } }); }

  return (
    <div className="bg-white border border-[var(--brand-stroke)] rounded-2xl shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--brand-stroke)] bg-white">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center text-[var(--brand-green)]">
            <Clock className="h-4 w-4" />
          </span>
          <span className="text-sm font-bold text-[var(--brand-black-font)]">
            Organization Profile
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="text-slate-400 hover:text-[var(--brand-green)] transition-colors p-1 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Left Upload Box */}
            <div className="flex flex-col items-center shrink-0 w-full sm:w-auto">
              <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 p-3 text-center relative overflow-hidden bg-slate-50/50">
                {logoUrl && failedLogoUrl !== logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Organization Logo"
                    fill
                    loader={({ src }) => src}
                    unoptimized
                    onError={() => setFailedLogoUrl(logoUrl)}
                    className="object-cover"
                  />
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-[var(--brand-green)] transition-colors">
                      Logo preview
                    </span>
                  </>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-medium text-center mt-2 max-w-[150px] leading-tight">
                Recommended: 512x512px PNG or SVG
              </span>
            </div>

            {/* Right Form Fields */}
            <div className="flex-1 w-full space-y-4">
              {/* Organization Name */}
              <div>
                <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">
                  Organization Name <span className="text-[var(--brand-red)] ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={organization.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Enter organization name"
                  className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 transition-all"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">
                    Primary Contact Email <span className="text-[var(--brand-red)] ml-0.5">*</span>
                  </label>
                  <input
                    type="email"
                  value={organization.email ?? ""}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="contact@technova.com"
                    className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">
                    Support Phone <span className="text-[var(--brand-red)] ml-0.5">*</span>
                  </label>
                  <input
                    type="tel"
                    value={organization.phone ?? ""}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">Registration Number</label><input value={organization.registrationNumber ?? ""} onChange={(event) => update("registrationNumber", event.target.value)} className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl" /></div>
                <div><label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">Logo URL</label><input type="url" value={logoUrl} onChange={(event) => updateBranding("logoUrl", event.target.value)} placeholder="https://.../logo.png" className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl" /></div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-bold text-slate-900">Supplier portal features</h3>
                <p className="mt-1 text-xs text-slate-500">Organization-wide controls. Individual supplier settings can disable notifications or changes further.</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {([
                    ["Enable supplier portal", "supplierPortalEnabled"],
                    ["Allow order change proposals", "supplierOrderChangesEnabled"],
                    ["Supplier email notifications", "supplierEmailNotificationsEnabled"],
                    ["Supplier in-app notifications", "supplierInAppNotificationsEnabled"],
                  ] as const).map(([label, key]) => <label key={key} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-xs font-semibold"><span>{label}</span><input type="checkbox" disabled={readOnly} checked={organization[key]} onChange={(event) => update(key, event.target.checked)} className="h-4 w-4 accent-[#0E9384]" /></label>)}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">Timezone</label><input value={organization.timezone} onChange={(event) => update("timezone", event.target.value)} className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl" /></div>
                <div><label className="block text-xs font-semibold text-[var(--brand-black-font)] mb-1.5">Currency</label><input maxLength={3} value={organization.currencyCode} onChange={(event) => update("currencyCode", event.target.value.toUpperCase())} className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl" /></div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end pt-2 border-t border-[var(--brand-stroke)]">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || readOnly}
              className="h-10 px-6 rounded-xl bg-[#0E7A6E] hover:bg-[#0C6A60] active:scale-[0.98] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              {readOnly ? "View only" : isSaving ? "Saving..." : "Save profile Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
