"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Trash2,
  FileText,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
} from "lucide-react";

// 1. Employee Data Interface
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  role: string;
  status: string;
}

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // States for Loadings and Popups
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

 
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const dummyData: Employee[] = [
          { id: "PT001", firstName: "Saman", lastName: "Eliya", phone: "773409342", email: "saman@gmail.com", address: "Galle", createdAt: "08.9.2027", role: "BM", status: "cc" },
          { id: "PT002", firstName: "Kamal", lastName: "Nimara", phone: "779087321", email: "kamal@gmail.com", address: "Colombo", createdAt: "08.3.2027", role: "C", status: "cc" },
        ];
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setEmployees(dummyData);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // --- View Functions ---
  const handleView = (employee: Employee) => setViewEmployee(employee);
  const closeViewPopup = () => setViewEmployee(null);

  // --- Delete Functions ---
  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    const idToDelete = deleteConfirmId;
    setDeleteConfirmId(null); 
    setDeletingId(idToDelete); 

    try {
    
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== idToDelete));
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      setDeletingId(null);
    }
  };



  return (
 
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 font-sans text-gray-800 relative">

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Employee Management</h1>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span className="hover:text-teal-600 cursor-pointer transition-colors">Dashboard</span>
            <span>›</span>
            <span className="text-gray-400">Employee Management</span>
          </div>
        </div>

        <Link href="/employees/addemployee">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0E9384] border border-[#0E9384] rounded-md hover:bg-teal-50 transition-colors">
              <PlusCircle size={16} /> Add Employee
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#D92D20] border border-[#D92D20] rounded-md hover:bg-red-700 transition-colors">
              <Trash2 size={16} /> Delete Employee
            </button>
          </div>
        </Link>
      </div>

      {/* --- Filters Section --- */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select className="w-full h-10 px-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none">
              <option>All</option>
              <option>Manager</option>
              <option>Cashier</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select className="w-full h-10 px-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <label className="text-sm font-medium text-gray-700">Branch</label>
            <select className="w-full h-10 px-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none">
              <option>All</option>
              <option>Colombo</option>
              <option>Galle</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-md text-red-500 hover:bg-gray-50 transition-colors"><FileText size={18} /></button>
          <button className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-md text-green-600 hover:bg-gray-50 transition-colors"><FileSpreadsheet size={18} /></button>
          <button className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"><RefreshCw size={18} /></button>
          <button className="h-10 px-4 bg-[#0E9384] text-white text-sm font-medium rounded-md hover:bg-teal-700 transition-colors">Apply Filters</button>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 font-semibold">
              <th className="py-3 px-4 w-12 text-center"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer" /></th>
              <th className="py-3 px-4 whitespace-nowrap">Employee Id</th>
              <th className="py-3 px-4 whitespace-nowrap">First Name</th>
              <th className="py-3 px-4 whitespace-nowrap">Last Name</th>
              <th className="py-3 px-4 whitespace-nowrap">Phone</th>
              <th className="py-3 px-4 whitespace-nowrap">Email</th>
              <th className="py-3 px-4 whitespace-nowrap">Address</th>
              <th className="py-3 px-4 whitespace-nowrap">Created at</th>
              <th className="py-3 px-4 whitespace-nowrap">Role</th>
              <th className="py-3 px-4 whitespace-nowrap">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-gray-500">Loading employees data...</td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-gray-500">No employees found.</td>
              </tr>
            ) : (
              employees.map((emp, index) => (
                <tr key={index} className={`hover:bg-gray-50/50 transition-colors ${deletingId === emp.id ? 'opacity-50 pointer-events-none' : ''}`}>
                  <td className="py-3 px-4 text-center"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer" /></td>
                  <td className="py-3 px-4 text-gray-500">{emp.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{emp.firstName}</td>
                  <td className="py-3 px-4">{emp.lastName}</td>
                  <td className="py-3 px-4 text-gray-500">{emp.phone}</td>
                  <td className="py-3 px-4 text-gray-900 underline decoration-gray-300 underline-offset-2">{emp.email}</td>
                  <td className="py-3 px-4">{emp.address}</td>
                  <td className="py-3 px-4 underline decoration-gray-300 underline-offset-2">{emp.createdAt}</td>
                  <td className="py-3 px-4">{emp.role}</td>
                  <td className="py-3 px-4 underline decoration-gray-300 underline-offset-2">{emp.status}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => handleView(emp)}
                        className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-[#0E9384] hover:border-[#0E9384] hover:bg-[#EEFFFD] transition-colors"
                        title="View"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Edit Button */}
                      <Link href={`/employees/updateemployee?id=${emp.id}`}>
                        <button
                          className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-colors"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                      </Link>
                      
                      {/* Delete Trigger Button */}
                      <button
                        onClick={() => setDeleteConfirmId(emp.id)}
                        disabled={deletingId === emp.id}
                        className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === emp.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Footer / Pagination Section --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 text-sm text-gray-600 gap-4">
        <div className="flex items-center gap-3">
          <span>Row Per Page</span>
          <select className="h-8 px-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
          <span>Entries</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"><ChevronLeft size={18} /></button>
          <button className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors">1</button>
          <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"><ChevronRight size={18} /></button>
        </div>
      </div>

      {/* Modals */}
      {viewEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Employee Details</h3>
              <button onClick={closeViewPopup} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-2"><span className="text-gray-500 font-medium">Employee ID:</span><span className="col-span-2 text-gray-900 font-semibold">{viewEmployee.id}</span></div>
                <div className="grid grid-cols-3 gap-2"><span className="text-gray-500 font-medium">Full Name:</span><span className="col-span-2 text-gray-900">{viewEmployee.firstName} {viewEmployee.lastName}</span></div>
                <div className="grid grid-cols-3 gap-2"><span className="text-gray-500 font-medium">Email:</span><span className="col-span-2 text-teal-600">{viewEmployee.email}</span></div>
                <div className="grid grid-cols-3 gap-2"><span className="text-gray-500 font-medium">Phone:</span><span className="col-span-2 text-gray-900">{viewEmployee.phone}</span></div>
                <div className="grid grid-cols-3 gap-2"><span className="text-gray-500 font-medium">Address:</span><span className="col-span-2 text-gray-900">{viewEmployee.address}</span></div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50"><span className="text-gray-500 font-medium">Role:</span><span className="col-span-2 text-gray-900">{viewEmployee.role}</span></div>
                <div className="grid grid-cols-3 gap-2"><span className="text-gray-500 font-medium">Status:</span><span className="col-span-2 text-gray-900 uppercase">{viewEmployee.status}</span></div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={closeViewPopup} className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Employee</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this employee? This action cannot be undone.
              </p>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors w-full"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors w-full shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}