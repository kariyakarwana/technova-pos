"use client";

import { Bot, ChevronDown } from "lucide-react";

interface UpdateSupplierFinancialDetailsCardProps {
  taxId: string;
  onTaxIdChange: (val: string) => void;
  paymentTerms: string;
  onPaymentTermsChange: (val: string) => void;
  creditLimit: string;
  onCreditLimitChange: (val: string) => void;
}

export default function UpdateSupplierFinancialDetailsCard({
  taxId,
  onTaxIdChange,
  paymentTerms,
  onPaymentTermsChange,
  creditLimit,
  onCreditLimitChange,
}: UpdateSupplierFinancialDetailsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs space-y-5">
      {/* Title */}
      <h2 className="text-base font-bold text-[var(--brand-black-font)]">
        Business & Financial Details
      </h2>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Tax ID / VAT Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Tax ID / VAT Number
          </label>
          <input
            type="text"
            placeholder="XX-XXXXXXX"
            value={taxId}
            onChange={(e) => onTaxIdChange(e.target.value)}
            className="w-full h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
          />
        </div>

        {/* Payment Terms */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Payment Terms
          </label>
          <div className="relative">
            <select
              value={paymentTerms}
              onChange={(e) => onPaymentTermsChange(e.target.value)}
              className="w-full h-10 pl-3.5 pr-9 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] appearance-none focus:outline-none focus:border-[var(--brand-green)] cursor-pointer shadow-xs font-medium"
            >
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 60">Net 60</option>
              <option value="Due on Receipt">Due on Receipt</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Credit Limit (USD) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Credit Limit (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
              $
            </span>
            <input
              type="text"
              placeholder="0.00"
              value={creditLimit}
              onChange={(e) => onCreditLimitChange(e.target.value)}
              className="w-full h-10 pl-7 pr-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--brand-green)] shadow-xs font-medium"
            />
          </div>
        </div>
      </div>

      {/* AI Insight Box */}
      <div className="bg-[#F0FDF9] border border-[#CBEFE8] rounded-xl p-4 flex items-start gap-3 mt-4">
        <div className="h-7 w-7 rounded-lg bg-white border border-[#CBEFE8] text-[var(--brand-green)] flex items-center justify-center shrink-0 shadow-2xs">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[var(--brand-green)]">
            AI Insight
          </h4>
          <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
            Based on similar suppliers in the electronics category, a &apos;Net 45&apos; payment term with a starting credit limit of $15,000 is standard.
          </p>
        </div>
      </div>
    </div>
  );
}
