'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const Icon = ({ children, size = 16, ...props }: IconProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {children}
  </svg>
);

const FiRefreshCw = (props: IconProps) => <Icon {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></Icon>;
const FiArrowLeft = (props: IconProps) => <Icon {...props}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></Icon>;
const FiInfo = (props: IconProps) => <Icon {...props}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></Icon>;
const FiChevronDown = (props: IconProps) => <Icon {...props}><path d="m6 9 6 6 6-6" /></Icon>;

export default function AddBranchPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 'Active' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Branch added successfully!");
        router.push('/branches');
      } else {
        alert("Failed to add branch.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header & Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Add Branch Management</h1>
            <p className="text-xs text-gray-400 mt-1">
              Dashboard <span className="mx-1">&gt;</span> Add Branch Management
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.location.reload()} className="p-2 border border-gray-200 rounded-lg text-gray-600 bg-white hover:bg-gray-50 transition">
              <FiRefreshCw size={16} />
            </button>
            <button 
              onClick={() => router.push('/branches')}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
              <FiArrowLeft size={16} /> Back to Branch Management
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm">
              <FiInfo size={18} />
              <span>Add Branch Information</span>
            </div>
            <FiChevronDown size={18} className="text-gray-400" />
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Branch Id <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white text-gray-800 focus:outline-teal-600"
                placeholder="Enter Branch ID"
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-teal-600 text-gray-800"
                placeholder="Enter Branch Name"
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Address <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-teal-600 text-gray-800"
                placeholder="Enter Branch Address"
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-teal-600 text-gray-800"
                placeholder="Enter Phone Number"
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-teal-600 text-gray-800"
                placeholder="example@gmail.com"
                required 
              />
            </div>

          
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Status <span className="text-red-500">*</span></label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-teal-600 text-gray-800 cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </form>
        </div>

       
        <div className="flex justify-end gap-3 mt-6">
          <button 
            type="button"
            onClick={() => router.push('/branches')}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition shadow-sm"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
          >
            Add Branch
          </button>
        </div>

      </div>
    </div>
  );
}