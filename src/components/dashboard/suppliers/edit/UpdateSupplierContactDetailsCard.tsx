"use client";

interface UpdateSupplierContactDetailsCardProps {
  contactName: string;
  onContactNameChange: (val: string) => void;
  email: string;
  onEmailChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  website: string;
  onWebsiteChange: (val: string) => void;
  address: string;
  onAddressChange: (val: string) => void;
  city: string;
  onCityChange: (val: string) => void;
  state: string;
  onStateChange: (val: string) => void;
  zipCode: string;
  onZipCodeChange: (val: string) => void;
}

export default function UpdateSupplierContactDetailsCard({
  contactName,
  onContactNameChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  website,
  onWebsiteChange,
  address,
  onAddressChange,
  city,
  onCityChange,
  state,
  onStateChange,
  zipCode,
  onZipCodeChange,
}: UpdateSupplierContactDetailsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-5">
      {/* Title */}
      <h2 className="text-base font-bold text-[var(--brand-black-font)]">
        Contact Details
      </h2>

      {/* Row 1: Primary Contact Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Primary Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="John Doe"
            value={contactName}
            onChange={(e) => onContactNameChange(e.target.value)}
            className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="john@example.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
          />
        </div>
      </div>

      {/* Row 2: Phone Number & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Website
          </label>
          <input
            type="url"
            placeholder="https://www.example.com"
            value={website}
            onChange={(e) => onWebsiteChange(e.target.value)}
            className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
          />
        </div>
      </div>

      {/* Row 3: Address */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Address
        </label>
        <input
          type="text"
          placeholder="123 Corporate Blvd, Suite 100"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
        />
      </div>

      {/* Row 4: 3-Column City, State, ZIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <input
            type="text"
            placeholder="State/Province"
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <input
            type="text"
            placeholder="ZIP/Postal Code"
            value={zipCode}
            onChange={(e) => onZipCodeChange(e.target.value)}
            className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
          />
        </div>
      </div>
    </div>
  );
}
