'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const Icon = ({ children, size = 16, ...props }: IconProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {children}
  </svg>
);

const FiPlus = (props: IconProps) => <Icon {...props}><path d="M12 5v14M5 12h14" /></Icon>;
const FiEye = (props: IconProps) => <Icon {...props}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Icon>;
const FiEdit2 = (props: IconProps) => <Icon {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></Icon>;
const FiTrash2 = (props: IconProps) => <Icon {...props}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" /></Icon>;
const FiChevronLeft = (props: IconProps) => <Icon {...props}><path d="m15 18-6-6 6-6" /></Icon>;
const FiChevronRight = (props: IconProps) => <Icon {...props}><path d="m9 18 6-6-6-6" /></Icon>;

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: string;
}

export default function BranchManagementPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const response = await fetch('/api/branches');

        if (!response.ok) {
          throw new Error("Failed to fetch from API");
        }

        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.warn("API error or offline, using fallback mock data:", error);

        const mockBranches: Branch[] = [
          { id: 'B001', name: 'Main Branch', address: 'Colombo 01', phone: '0112345678', email: 'main@technova.com', status: 'Active' },
          { id: 'B002', name: 'Kandy Branch', address: 'Peradeniya Rd, Kandy', phone: '0812233445', email: 'kandy@technova.com', status: 'Active' },
          { id: 'B003', name: 'Galle Branch', address: 'Main Street, Galle', phone: '0912244556', email: 'galle@technova.com', status: 'Inactive' },
        ];
        setBranches(mockBranches);
      } finally {
        setLoading(false);
      }
    };

    void loadBranches();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this branch?")) {
      try {
        await fetch(`/api/branches/${id}`, {
          method: 'DELETE',
        });

        setBranches(branches.filter(b => b.id !== id));
      } catch (error) {
        console.error("Error deleting branch:", error);
        setBranches(branches.filter(b => b.id !== id));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">


        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Branch Management</h1>
            <p className="text-xs text-gray-400 mt-1">
              Dashboard <span className="mx-1">&gt;</span> Branch Management
            </p>
          </div>

          <button
            onClick={() => router.push('/branches/addbranch')}
            className="flex items-center gap-2 border border-teal-600 text-teal-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-50 transition"
          >
            <FiPlus size={16} /> Add Branch
          </button>
        </div>


        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                <th className="py-3 px-4 rounded-l-lg w-10">
                  <input type="checkbox" className="rounded border-gray-300 cursor-pointer" />
                </th>
                <th className="py-3 px-4 font-semibold">Branch Id</th>
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Address</th>
                <th className="py-3 px-4 font-semibold">Phone</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 rounded-r-lg text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-400">Loading data...</td>
                </tr>
              ) : branches.length > 0 ? (
                branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <input type="checkbox" className="rounded border-gray-300 cursor-pointer" />
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-medium">{branch.id}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{branch.name}</td>
                    <td className="py-3 px-4 text-gray-600">{branch.address}</td>
                    <td className="py-3 px-4 text-gray-600">{branch.phone}</td>
                    <td className="py-3 px-4">
                      {branch.email ? (
                        <a href={`mailto:${branch.email}`} className="text-teal-600 underline">
                          {branch.email}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${branch.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {branch.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => { setSelectedBranch(branch); setIsViewModalOpen(true); }}
                        title="View"
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded border border-gray-200 transition inline-flex items-center justify-center"
                      >
                        <FiEye size={16} />
                      </button>

                      <button
                        onClick={() => router.push(`/branches/updatebranch?id=${branch.id}`)}
                        title="Edit"
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded border border-gray-200 transition inline-flex items-center justify-center"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(branch.id)}
                        title="Delete"
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-gray-200 transition inline-flex items-center justify-center"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-400">No branches found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <span>Row Per Page</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none bg-white">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            <span>Entries</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50"><FiChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-teal-600 text-white font-medium">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50"><FiChevronRight size={16} /></button>
          </div>
        </div>

      </div>


      {isViewModalOpen && selectedBranch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Branch Details</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Branch ID:</strong> {selectedBranch.id}</p>
              <p><strong>Name:</strong> {selectedBranch.name}</p>
              <p><strong>Address:</strong> {selectedBranch.address}</p>
              <p><strong>Phone:</strong> {selectedBranch.phone}</p>
              <p><strong>Email:</strong> {selectedBranch.email || '-'}</p>
              <p><strong>Status:</strong> {selectedBranch.status}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}