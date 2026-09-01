"use client";

import { Calendar, ChevronDown, Info } from "lucide-react";

interface AddCustomerFormCardProps {
  firstName: string;
  onFirstNameChange: (val: string) => void;
  lastName: string;
  onLastNameChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  email: string;
  onEmailChange: (val: string) => void;
  address: string;
  onAddressChange: (val: string) => void;
  date: string;
  onDateChange: (val: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function AddCustomerFormCard({
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
  address,
  onAddressChange,
  date,
  onDateChange,
  isCollapsed = false,
  onToggleCollapse,
}: AddCustomerFormCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] shadow-xs overflow-hidden">
      {/* Top Banner Header */}
      <div className="p-5 flex items-center justify-between border-b border-[var(--brand-stroke)] bg-white">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[var(--brand-green)]" />
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            Add Customer Information
          </h2>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          title="Toggle view"
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <ChevronDown
            className={[
              "h-5 w-5 transition-transform duration-200",
              isCollapsed ? "-rotate-90" : "rotate-0",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Form Fields Body */}
      {!isCollapsed && (
        <div className="p-6 space-y-5">
          {/* Row 1: First Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
            />
          </div>

          {/* Row 2: Last Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
            />
          </div>

          {/* Row 3: Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
            />
          </div>

          {/* Row 4: Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="@gmail.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
            />
          </div>

          {/* Row 5: Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
            />
          </div>

          {/* Row 6: Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Date
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full h-10 pl-3.5 pr-9 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
