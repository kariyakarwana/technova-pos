"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RotateCw,
  ChevronUp,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Info,
  ChevronDownCircle
} from "lucide-react";

export default function UpdateBranch() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    branchId: "",
    name: "",
    address1: "",
    phone: "",
    email: "",
    address2: "",
    status: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Branch Data:", formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Top Header & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Update Branch Management</h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <Link href="/dashboard" className="hover:text-slate-700">Dashboard</Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-600">Update Branch Management</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded bg-white text-slate-600 hover:bg-slate-50 shadow-sm transition"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded bg-white text-slate-600 hover:bg-slate-50 shadow-sm transition"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => router.push('/branches')}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
              <ArrowLeft size={16} /> Back to Branch Management
            </button>
          </div>
        </div>

        {/* Form Container Card */}
        <div className="bg-white rounded-md border border-slate-200 shadow-sm">

          {/* Card Title */}
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Info className="w-4 h-4 text-[#008272]" />
              <span>Update Branch Information</span>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              <ChevronDownCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Branch Id */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Branch Id</label>
              <div className="relative max-w-lg">
                <select
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  className="w-full h-9 px-3 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-[#008272] focus:ring-1 focus:ring-[#008272] text-slate-700 appearance-none pr-8"
                >
                  <option value=""></option>
                  <option value="BR-001">BR-001</option>
                  <option value="BR-002">BR-002</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full max-w-lg h-9 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:border-[#008272] focus:ring-1 focus:ring-[#008272]"
              />
            </div>

            {/* Address 1 */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                required
                className="w-full max-w-lg h-9 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:border-[#008272] focus:ring-1 focus:ring-[#008272]"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full max-w-lg h-9 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:border-[#008272] focus:ring-1 focus:ring-[#008272]"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full max-w-lg h-9 px-3 text-xs border border-slate-300 rounded placeholder-slate-400 focus:outline-none focus:border-[#008272] focus:ring-1 focus:ring-[#008272]"
              />
            </div>

            {/* Address 2 */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Address</label>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="w-full max-w-lg h-9 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:border-[#008272] focus:ring-1 focus:ring-[#008272]"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Status</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full max-w-lg h-9 px-3 text-xs border border-slate-300 rounded focus:outline-none focus:border-[#008272] focus:ring-1 focus:ring-[#008272]"
              />
            </div>

            {/* Bottom Buttons */}
            <div className="pt-6 flex justify-end items-center gap-2">
              <button
                type="button"
                className="px-4 py-1.5 bg-[#0f2942] hover:bg-[#0a1e30] text-white text-xs font-medium rounded shadow-sm transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#008272] hover:bg-[#006e60] text-white text-xs font-medium rounded shadow-sm transition"
              >
                Update Branch
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}