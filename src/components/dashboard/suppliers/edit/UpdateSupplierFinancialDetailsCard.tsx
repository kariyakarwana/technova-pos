"use client";

import { Bot } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          <Select
            value={paymentTerms}
            onValueChange={(val) => onPaymentTermsChange(val)}
          >
            <SelectTrigger className="w-full h-10 data-[size=default]:h-10 px-3.5 text-xs bg-white border border-[var(--brand-stroke)] rounded-xl text-[var(--brand-black-font)] shadow-xs font-medium focus:border-[var(--brand-green)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Net 30" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Net 30</SelectItem>
              <SelectItem value="Net 45" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Net 45</SelectItem>
              <SelectItem value="Net 60" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Net 60</SelectItem>
              <SelectItem value="Due on Receipt" className="hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-green)] cursor-pointer">Due on Receipt</SelectItem>
            </SelectContent>
          </Select>
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
