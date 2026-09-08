"use client";

import { useState } from "react";
import { ArrowUp, ChevronDown, Info, Package, Users } from "lucide-react";

interface OverallInformationCardProps {
  suppliersCount: number;
  customersCount: number;
  ordersCount: number;
  firstTimeAmount: string;
  firstTimeRate: string;
  returnAmount: string;
  returnRate: string;
}

export default function OverallInformationCard({
  suppliersCount,
  customersCount,
  ordersCount,
  firstTimeAmount,
  firstTimeRate,
  returnAmount,
  returnRate,
}: OverallInformationCardProps) {
  const [filterPeriod, setFilterPeriod] = useState("Today");

  return (
    <div className="bg-white rounded-2xl border border-[var(--brand-stroke)] p-6 shadow-xs flex flex-col justify-between space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 text-[var(--brand-green)]" />
        <h2 className="text-base font-bold text-[var(--brand-black-font)]">
          Overall Information
        </h2>
      </div>

      {/* 3 Micro KPI Tiles */}
      <div className="grid grid-cols-3 gap-3">
        {/* Suppliers */}
        <div className="bg-slate-50/80 rounded-xl p-3 text-center space-y-1.5 border border-slate-100">
          <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <Users className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">
            Suppliers
          </span>
          <p className="text-sm font-extrabold text-[var(--brand-black-font)]">
            {suppliersCount}
          </p>
        </div>

        {/* Customer */}
        <div className="bg-slate-50/80 rounded-xl p-3 text-center space-y-1.5 border border-slate-100">
          <div className="h-7 w-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Users className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">
            Customer
          </span>
          <p className="text-sm font-extrabold text-[var(--brand-black-font)]">
            {customersCount}
          </p>
        </div>

        {/* Orders */}
        <div className="bg-slate-50/80 rounded-xl p-3 text-center space-y-1.5 border border-slate-100">
          <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Package className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">
            Orders
          </span>
          <p className="text-sm font-extrabold text-[var(--brand-black-font)]">
            {ordersCount}
          </p>
        </div>
      </div>

      {/* Customers Overview Section */}
      <div className="pt-2 border-t border-slate-100 space-y-4">
        {/* Sub Header & Filter */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--brand-black-font)]">
            Customers Overview
          </span>

          <div className="relative">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="h-7 pl-2.5 pr-6 text-[11px] bg-slate-50 border border-[var(--brand-stroke)] rounded-lg text-slate-700 font-semibold appearance-none focus:outline-none cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Radial Rings & Legend Numbers */}
        <div className="flex items-center gap-6">
          {/* Concentric Radial Ring Gauges */}
          <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-full w-full rotate-[-90deg]">
              {/* Outer Orange Ring Track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#FFEDD5"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Outer Orange Ring Progress (First Time) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#EA580C"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset="100"
                strokeLinecap="round"
                fill="transparent"
              />

              {/* Inner Teal Ring Track */}
              <circle
                cx="50"
                cy="50"
                r="28"
                stroke="#E6F7F5"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Inner Teal Ring Progress (Return) */}
              <circle
                cx="50"
                cy="50"
                r="28"
                stroke="#0E9384"
                strokeWidth="7"
                strokeDasharray="175.9"
                strokeDashoffset="75"
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
          </div>

          {/* Breakdown Stats */}
          <div className="space-y-3 flex-1">
            {/* First Time */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-extrabold text-[var(--brand-black-font)]">
                  {firstTimeAmount}
                </p>
                <span className="text-[10px] text-slate-400 font-semibold block">
                  First Time
                </span>
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <ArrowUp className="h-2.5 w-2.5" />
                <span>{firstTimeRate}</span>
              </span>
            </div>

            {/* Return */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-extrabold text-[var(--brand-black-font)]">
                  {returnAmount}
                </p>
                <span className="text-[10px] text-slate-400 font-semibold block">
                  Return
                </span>
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <ArrowUp className="h-2.5 w-2.5" />
                <span>{returnRate}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
