"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Clock, PlusCircle } from "lucide-react";

interface OrganizationProfileCardProps {
  orgName: string;
  onOrgNameChange: (val: string) => void;
  email: string;
  onEmailChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export default function OrganizationProfileCard({
  orgName,
  onOrgNameChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  onSave,
  isSaving = false,
}: OrganizationProfileCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  }

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
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-36 h-36 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[var(--brand-green)] hover:bg-emerald-50/20 transition-all flex flex-col items-center justify-center gap-2 p-3 text-center cursor-pointer group relative overflow-hidden bg-slate-50/50"
              >
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Organization Logo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <>
                    <PlusCircle className="h-6 w-6 text-slate-400 group-hover:text-[var(--brand-green)] transition-colors" />
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-[var(--brand-green)] transition-colors">
                      Add Image
                    </span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
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
                  value={orgName}
                  onChange={(e) => onOrgNameChange(e.target.value)}
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
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
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
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)]/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end pt-2 border-t border-[var(--brand-stroke)]">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="h-10 px-6 rounded-xl bg-[#0E7A6E] hover:bg-[#0C6A60] active:scale-[0.98] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save profile Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
