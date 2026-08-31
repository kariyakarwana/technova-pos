"use client";

interface SupplierInformationCardProps {
  companyName: string;
  onCompanyNameChange: (val: string) => void;
  supplierId: string;
  description: string;
  onDescriptionChange: (val: string) => void;
}

export default function SupplierInformationCard({
  companyName,
  onCompanyNameChange,
  supplierId,
  description,
  onDescriptionChange,
}: SupplierInformationCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-5">
      {/* Title */}
      <h2 className="text-base font-bold text-[var(--brand-black-font)]">
        Supplier Information
      </h2>

      {/* 2-Column Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Company Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Acme Corp"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
          />
        </div>

        {/* Supplier ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Supplier ID
          </label>
          <input
            type="text"
            readOnly
            placeholder="Auto-generated"
            value={supplierId}
            className="w-full h-10 px-3.5 text-xs bg-slate-50 border border-[var(--brand-stroke)] rounded-xl text-slate-500 placeholder:text-slate-400 focus:outline-none shadow-xs font-medium cursor-not-allowed"
          />
        </div>
      </div>

      {/* Description / Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Description / Notes
        </label>
        <textarea
          rows={3}
          placeholder="Brief description of goods/services provided..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full p-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}
