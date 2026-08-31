"use client";

import { useState } from "react";
import {
  MOCK_CUSTOMERS,
  type CustomerItem,
} from "./CustomerManagementMock";
import CustomerManagementHeader from "./CustomerManagementHeader";
import CustomerManagementTable from "./CustomerManagementTable";
import CustomerManagementPagination from "./CustomerManagementPagination";

export default function CustomerManagementClientView() {
  const [customers, setCustomers] = useState<CustomerItem[]>(MOCK_CUSTOMERS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(4);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isCollapsed, setIsCollapsed] = useState(false);

  function handleToggleSelectAll() {
    if (selectedIds.length === customers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(customers.map((c) => c.customerId));
    }
  }

  function handleToggleSelectOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function handleDeleteSelected() {
    if (selectedIds.length === 0) {
      alert("Please select customer records to delete.");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${selectedIds.length} selected customer(s)?`
      )
    ) {
      setCustomers((prev) =>
        prev.filter((c) => !selectedIds.includes(c.customerId))
      );
      setSelectedIds([]);
    }
  }

  function handleView(item: CustomerItem) {
    alert(`Viewing details for customer: ${item.firstName} ${item.lastName} (${item.customerId})`);
  }

  function handleEdit(item: CustomerItem) {
    alert(`Editing customer: ${item.firstName} ${item.lastName} (${item.customerId})`);
  }

  function handleDelete(item: CustomerItem) {
    if (confirm(`Delete customer ${item.firstName} ${item.lastName}?`)) {
      setCustomers((prev) =>
        prev.filter((c) => c.customerId !== item.customerId)
      );
      setSelectedIds((prev) => prev.filter((id) => id !== item.customerId));
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <CustomerManagementHeader
        onDeleteSelected={handleDeleteSelected}
        hasSelection={selectedIds.length > 0}
      />

      {/* 2. Table */}
      <CustomerManagementTable
        customers={customers}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectOne={handleToggleSelectOne}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* 3. Pagination */}
      <CustomerManagementPagination
        currentPage={currentPage}
        totalPages={15}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </main>
  );
}
