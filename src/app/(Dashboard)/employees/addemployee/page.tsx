"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  RefreshCw, 
  ChevronUp, 
  ChevronDown, 
  Info 
} from "lucide-react";
import Link from "next/link";

export default function AddEmployeePage() {

  const [formData, setFormData] = useState({
    empId: "EMP-02-0001",
    name: "",
    address1: "",
    phone: "",
    email: "",
    role: "",
    address2: "",
    status: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted: ", formData);

    alert("Employee Added Successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans text-gray-800">
      <div className="max-w-[1200px] mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Add Employee Management</h1>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span className="hover:text-[#0E9384] cursor-pointer transition-colors">Dashboard</span>
              <span>›</span>
              <span className="text-gray-400">Add Employee</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 bg-white rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
              <RefreshCw size={16} />
            </button>
            <button className="p-2 border border-gray-200 bg-white rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
              <ChevronUp size={16} />
            </button>
            
            <Link href="/employees">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0E9384] rounded-md hover:bg-teal-700 transition-colors">
                <ArrowLeft size={16} />
                Back to Employee Management
              </button>
            </Link>
          </div>
        </div>

        {/* --- Form Section --- */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Form Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-[#0E9384] font-medium">
              <Info size={18} />
              <span>Add Employee Information</span>
            </div>
            <button className="text-gray-400 hover:text-gray-700">
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6 max-w-2xl">
              
              {/* Emp Id */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Emp Id</label>
                <div className="relative">
                  <select 
                    name="empId"
                    value={formData.empId}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm text-gray-500 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0E9384] appearance-none"
                  >
                    <option value="EMP-02-0001">EMP-02-0001</option>
                    <option value="EMP-02-0002">EMP-02-0002</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0E9384]"
                />
              </div>

              {/* Address 1 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="address1"
                  value={formData.address1}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0E9384]"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0E9384]"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0E9384] placeholder:text-gray-300"
                />
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Role</label>
                <div className="relative">
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0E9384] appearance-none"
                  >
                    <option value="" disabled></option>
                    <option value="Manager">Manager</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Address 2 (As shown in the design image) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <input 
                  type="text" 
                  name="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  className="w-full h-10 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0E9384]"
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <input 
                  type="text" 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full h-10 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0E9384]"
                />
              </div>

            </div>

            {/* Form Footer Buttons */}
            <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
              <button 
                type="button"
                className="px-6 py-2 text-sm font-medium text-white bg-[#0F172A] rounded-md hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-[#0E9384] rounded-md hover:bg-teal-700 transition-colors"
              >
                Add Employee
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}