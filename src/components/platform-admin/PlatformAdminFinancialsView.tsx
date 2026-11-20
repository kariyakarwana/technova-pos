"use client";

import React, { useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileText,
  Landmark,
  Plus,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { buildInvoicePdfBytes } from "./invoicePdf";
import type {
  PlatformAnalytics,
  PlatformInvoice,
  TenantSummary,
} from "./types";

type InvoiceStatusFilter = "ALL" | "PAID" | "PENDING" | "OVERDUE";
type DateRangeFilter = "ALL_TIME" | "THIS_MONTH" | "LAST_30_DAYS";

interface Props {
  analytics: PlatformAnalytics;
  invoices: PlatformInvoice[];
  organizations: TenantSummary[];
  onOpenPaymentModal: (org: TenantSummary, invoiceId: string) => void;
}

const INVOICES_PAGE_SIZE = 5;

function isInvoiceOverdue(inv: PlatformInvoice): boolean {
  if (inv.status === "OVERDUE") return true;
  if (inv.status === "PENDING") {
    return new Date(inv.dueDate).getTime() < Date.now();
  }
  return false;
}

function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatPaymentMethod(method: string | null | undefined, status: string): string {
  if (status !== "PAID" && !method) return "Bank Transfer";
  switch ((method || "BANK_TRANSFER").toUpperCase()) {
    case "BANK_TRANSFER":
      return "Bank Transfer";
    case "ONLINE":
      return "Online Portal";
    case "CASH":
      return "Direct Cash";
    case "CHEQUE":
      return "Cheque";
    default:
      return method || "Bank Transfer";
  }
}

export function PlatformAdminFinancialsView({
  analytics,
  invoices,
  organizations,
  onOpenPaymentModal,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>("ALL");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("ALL_TIME");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewInvoice, setPreviewInvoice] = useState<PlatformInvoice | null>(null);
  const [wireSelectorOpen, setWireSelectorOpen] = useState(false);

  const rangeFilteredInvoices = useMemo(() => {
    const now = new Date();
    return invoices.filter((inv) => {
      if (dateRange === "ALL_TIME") return true;
      const issued = new Date(inv.issuedDate);
      if (dateRange === "THIS_MONTH") {
        return (
          issued.getUTCFullYear() === now.getUTCFullYear() &&
          issued.getUTCMonth() === now.getUTCMonth()
        );
      }
      if (dateRange === "LAST_30_DAYS") {
        const diffDays = (now.getTime() - issued.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= 30;
      }
      return true;
    });
  }, [invoices, dateRange]);

  const stats = useMemo(() => {
    let totalInvoiced = 0;
    let totalVat = 0;
    let collectedRevenue = 0;
    let outstandingAmount = 0;
    let paidCount = 0;
    let unpaidCount = 0;

    for (const inv of rangeFilteredInvoices) {
      totalInvoiced += inv.totalAmountUsd;
      totalVat += inv.vatAmountUsd;
      if (inv.status === "PAID") {
        collectedRevenue += inv.totalAmountUsd;
        paidCount += 1;
      } else if (inv.status !== "VOID") {
        outstandingAmount += inv.totalAmountUsd;
        unpaidCount += 1;
      }
    }

    const settlementRate =
      totalInvoiced > 0 ? Math.round((collectedRevenue / totalInvoiced) * 100) : 100;

    return {
      totalInvoiced,
      totalVat,
      collectedRevenue,
      outstandingAmount,
      paidCount,
      unpaidCount,
      settlementRate,
      invoiceCount: rangeFilteredInvoices.length,
    };
  }, [rangeFilteredInvoices]);

  const unpaidInvoices = useMemo(
    () => invoices.filter((i) => i.status === "PENDING" || i.status === "OVERDUE"),
    [invoices]
  );

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rangeFilteredInvoices.filter((inv) => {
      const matchesQuery =
        !q ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.organizationName.toLowerCase().includes(q) ||
        (inv.organizationEmail && inv.organizationEmail.toLowerCase().includes(q)) ||
        (inv.paymentRef && inv.paymentRef.toLowerCase().includes(q));

      if (!matchesQuery) return false;

      if (statusFilter === "PAID") return inv.status === "PAID";
      if (statusFilter === "PENDING") return inv.status === "PENDING" && !isInvoiceOverdue(inv);
      if (statusFilter === "OVERDUE") return isInvoiceOverdue(inv);
      return true;
    });
  }, [rangeFilteredInvoices, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / INVOICES_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedInvoices = filteredInvoices.slice(
    (safePage - 1) * INVOICES_PAGE_SIZE,
    safePage * INVOICES_PAGE_SIZE
  );
  const startEntry =
    filteredInvoices.length === 0 ? 0 : (safePage - 1) * INVOICES_PAGE_SIZE + 1;
  const endEntry = Math.min(safePage * INVOICES_PAGE_SIZE, filteredInvoices.length);

  const triggerRecordPayment = (inv: PlatformInvoice) => {
    const orgObj = organizations.find((o) => o.id === inv.organizationId);
    if (!orgObj) {
      toast.error("Organization record not found for this invoice.");
      return;
    }
    setWireSelectorOpen(false);
    setPreviewInvoice(null);
    onOpenPaymentModal(orgObj, inv.id);
  };

  const handleRecordWireClick = () => {
    if (unpaidInvoices.length === 0) {
      toast.info("All subscription invoices are already marked as Paid.");
      return;
    }
    if (unpaidInvoices.length === 1) {
      triggerRecordPayment(unpaidInvoices[0]);
      return;
    }
    setWireSelectorOpen(true);
  };

  const handleExportInvoices = () => {
    const headers = [
      "Invoice ID",
      "Organization",
      "Email",
      "Plan",
      "Base (USD)",
      "VAT 18% (USD)",
      "Total (USD)",
      "Issue Date",
      "Due Date",
      "Payment Method",
      "Payment Ref",
      "Status",
    ];
    const rows = filteredInvoices.map((inv) => [
      inv.invoiceNumber,
      `"${inv.organizationName.replace(/"/g, '""')}"`,
      `"${inv.organizationEmail || ""}"`,
      `"${inv.planName}"`,
      inv.subtotalUsd.toFixed(2),
      inv.vatAmountUsd.toFixed(2),
      inv.totalAmountUsd.toFixed(2),
      formatShortDate(inv.issuedDate),
      formatShortDate(inv.dueDate),
      formatPaymentMethod(inv.paymentMethod, inv.status),
      `"${inv.paymentRef || ""}"`,
      isInvoiceOverdue(inv) ? "OVERDUE" : inv.status,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `technova-invoices-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredInvoices.length} invoice(s) to CSV.`);
  };

  const handleDownloadSingleInvoice = (inv: PlatformInvoice) => {
    const pdfBytes = buildInvoicePdfBytes(inv, isInvoiceOverdue(inv));
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${inv.invoiceNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded PDF receipt (${inv.invoiceNumber}.pdf).`);
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-slate-500">
            Billing &amp; Treasury <span className="mx-1 text-slate-300">/</span>{" "}
            <span className="text-[#0E9384] font-semibold">Invoicing</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1D2939] tracking-tight mt-0.5">
            Financials &amp; Invoicing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track monthly revenue, manage invoices, and approve pending bank transfer
            verifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportInvoices}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1D2939] bg-white border border-[#E4E7EC] rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Invoices
          </button>

          <button
            onClick={handleRecordWireClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0E9384] rounded-xl hover:bg-[#004532] shadow-sm shadow-[#0E9384]/25 transition"
          >
            <Plus className="w-4 h-4" />
            Record Bank Wire
          </button>
        </div>
      </div>

      {/* 4 Clean KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Invoiced */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-slate-500">
                Total Invoiced {dateRange === "THIS_MONTH" ? "this Month" : "Ledger"}
              </div>
              <div className="text-2xl font-extrabold text-[#1D2939] font-mono mt-1.5">
                ${stats.totalInvoiced.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#EEFFFD] text-[#0E9384] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-500">{stats.invoiceCount} invoices issued</span>
            <span className="font-semibold text-[#0E9384] font-mono">
              VAT: ${stats.totalVat.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card 2: Collected Revenue */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-slate-500">Collected Revenue</div>
              <div className="text-2xl font-extrabold text-[#0E9384] font-mono mt-1.5">
                ${stats.collectedRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
            <span>{stats.settlementRate}% settlement rate</span>
            <span className="font-semibold text-[#1D2939]">{stats.paidCount} paid</span>
          </div>
        </div>

        {/* Card 3: Outstanding / Pending */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-slate-500">
                Outstanding / Pending
              </div>
              <div className="text-2xl font-extrabold text-[#D32F2F] font-mono mt-1.5">
                ${stats.outstandingAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#D32F2F] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-500">{stats.unpaidCount} pending or overdue</span>
            <span
              className={`font-semibold ${
                stats.unpaidCount > 0 ? "text-[#D32F2F]" : "text-[#0E9384]"
              }`}
            >
              {stats.unpaidCount > 0 ? "Action required" : "All settled"}
            </span>
          </div>
        </div>

        {/* Card 4: Active MRR / Payouts */}
        <div className="bg-white rounded-2xl border border-[#E4E7EC] p-5 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-slate-500">Active Monthly MRR</div>
              <div className="text-2xl font-extrabold text-[#1D2939] font-mono mt-1.5">
                ${analytics.financials.totalMrrUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#3852D4] flex items-center justify-center shrink-0">
              <Landmark className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-500">
              {analytics.financials.activeSubscriptionsCount} active plans
            </span>
            <span className="font-semibold text-[#3852D4]">30-day cycle</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] p-3.5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by customer name, invoice ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-[#E4E7EC] rounded-xl text-[#1D2939] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E9384] focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Pills */}
          <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-[#E4E7EC] text-xs">
            {(
              [
                { id: "ALL", label: "All" },
                { id: "PAID", label: "Paid" },
                { id: "PENDING", label: "Pending" },
                { id: "OVERDUE", label: "Overdue" },
              ] as const
            ).map((pill) => (
              <button
                key={pill.id}
                onClick={() => {
                  setStatusFilter(pill.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  statusFilter === pill.id
                    ? "bg-white text-[#1D2939] shadow-xs"
                    : "text-slate-500 hover:text-[#1D2939]"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Date Range Picker */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4E7EC] bg-white text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value as DateRangeFilter);
                setCurrentPage(1);
              }}
              className="bg-transparent font-medium text-xs text-[#1D2939] focus:outline-none cursor-pointer"
            >
              <option value="ALL_TIME">All Billing Periods</option>
              <option value="THIS_MONTH">Current Month</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Clean Invoices Table */}
      <div className="bg-white rounded-2xl border border-[#E4E7EC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-[#E4E7EC] text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-5">Invoice ID</th>
                <th className="py-3.5 px-4">Customer / Organization</th>
                <th className="py-3.5 px-4">Issue &amp; Due Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No invoices match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => {
                  const overdue = isInvoiceOverdue(inv);
                  const isPaid = inv.status === "PAID";

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                      {/* Invoice ID */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => setPreviewInvoice(inv)}
                          className={`font-mono font-bold text-left hover:underline ${
                            overdue ? "text-[#D32F2F]" : "text-[#0E9384]"
                          }`}
                        >
                          {inv.invoiceNumber}
                        </button>
                      </td>

                      {/* Customer / Organization */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#1D2939]">{inv.organizationName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {inv.planName}
                          {inv.organizationEmail ? ` • ${inv.organizationEmail}` : ""}
                        </div>
                      </td>

                      {/* Issue & Due Date */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#1D2939]">
                          {formatShortDate(inv.issuedDate)}
                        </div>
                        <div
                          className={`text-[11px] mt-0.5 ${
                            overdue ? "text-[#D32F2F] font-semibold" : "text-slate-400"
                          }`}
                        >
                          Due {formatShortDate(inv.dueDate)}
                        </div>
                      </td>

                      {/* Amount */}
                      <td
                        className={`py-4 px-4 font-mono font-bold ${
                          overdue ? "text-[#D32F2F]" : "text-[#1D2939]"
                        }`}
                      >
                        ${inv.totalAmountUsd.toFixed(2)}
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                          {inv.paymentMethod === "ONLINE" ? (
                            <CreditCard className="w-3.5 h-3.5 text-[#3852D4]" />
                          ) : (
                            <Landmark className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{formatPaymentMethod(inv.paymentMethod, inv.status)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EEFFFD] text-[#0E9384] border border-[#0E9384]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0E9384]" />
                            Paid
                          </span>
                        ) : overdue ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-[#D32F2F] border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F]" />
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1">
                          {!isPaid && (
                            <button
                              onClick={() => triggerRecordPayment(inv)}
                              title="Verify & Record Payment"
                              className="px-2 py-1 rounded-lg bg-[#EEFFFD] text-[#0E9384] hover:bg-[#0E9384] hover:text-white text-[10px] font-bold transition mr-1"
                            >
                              Verify Pay
                            </button>
                          )}

                          <button
                            onClick={() => handleDownloadSingleInvoice(inv)}
                            title="Download Receipt"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0E9384] hover:bg-[#EEFFFD] transition"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setPreviewInvoice(inv)}
                            title="View Invoice Details"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#1D2939] hover:bg-slate-100 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3.5 border-t border-[#E4E7EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-[#1D2939]">{startEntry}</strong> to{" "}
            <strong className="text-[#1D2939]">{endEntry}</strong> of{" "}
            <strong className="text-[#1D2939]">{filteredInvoices.length}</strong> invoices
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E4E7EC] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                  safePage === page
                    ? "bg-[#0E9384] text-white shadow-xs"
                    : "bg-white border border-[#E4E7EC] text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E4E7EC] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 font-medium"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Details Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E4E7EC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0E9384]">
                  Invoice Summary
                </div>
                <h3 className="text-base font-bold text-[#1D2939] font-mono">
                  {previewInvoice.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setPreviewInvoice(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E4E7EC] space-y-1">
                <div className="font-bold text-[#1D2939] text-sm">
                  {previewInvoice.organizationName}
                </div>
                <div className="text-slate-500">
                  {previewInvoice.organizationEmail || "No business email"}
                </div>
                <div className="text-[11px] font-mono text-[#0E9384] font-semibold pt-1">
                  {previewInvoice.planName} ({previewInvoice.planCode})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-[#E4E7EC]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Issued Date</span>
                  <span className="font-semibold text-[#1D2939]">
                    {formatShortDate(previewInvoice.issuedDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Due Date</span>
                  <span className="font-semibold text-[#1D2939]">
                    {formatShortDate(previewInvoice.dueDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Subtotal</span>
                  <span className="font-mono font-semibold text-[#1D2939]">
                    ${previewInvoice.subtotalUsd.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">VAT (18%)</span>
                  <span className="font-mono font-semibold text-[#1D2939]">
                    ${previewInvoice.vatAmountUsd.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#EEFFFD] border border-[#0E9384]/25">
                <span className="font-bold text-[#004532]">Total Amount</span>
                <span className="text-base font-extrabold font-mono text-[#0E9384]">
                  ${previewInvoice.totalAmountUsd.toFixed(2)} USD
                </span>
              </div>

              {previewInvoice.paymentRef && (
                <div className="text-[11px] font-mono text-slate-500 px-1">
                  Payment Ref: <strong className="text-[#1D2939]">{previewInvoice.paymentRef}</strong>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E4E7EC]">
              <button
                onClick={() => handleDownloadSingleInvoice(previewInvoice)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E4E7EC] text-xs font-semibold text-[#1D2939] hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5" />
                Receipt
              </button>
              {previewInvoice.status !== "PAID" && (
                <button
                  onClick={() => triggerRecordPayment(previewInvoice)}
                  className="px-4 py-2 rounded-xl bg-[#0E9384] hover:bg-[#004532] text-white text-xs font-bold shadow-xs"
                >
                  Record Bank Wire
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pending Invoice Picker when clicking + Record Bank Wire with multiple unpaid invoices */}
      {wireSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E4E7EC] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
              <h3 className="text-base font-bold text-[#1D2939]">
                Select Pending Invoice to Reconcile
              </h3>
              <button
                onClick={() => setWireSelectorOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {unpaidInvoices.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => triggerRecordPayment(inv)}
                  className="w-full text-left p-3 rounded-xl border border-[#E4E7EC] hover:border-[#0E9384] hover:bg-[#EEFFFD]/50 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-mono font-bold text-xs text-[#0E9384]">
                      {inv.invoiceNumber}
                    </div>
                    <div className="font-bold text-xs text-[#1D2939] truncate">
                      {inv.organizationName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Due {formatShortDate(inv.dueDate)}
                    </div>
                  </div>
                  <div className="font-mono font-extrabold text-sm text-[#1D2939] shrink-0">
                    ${inv.totalAmountUsd.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
