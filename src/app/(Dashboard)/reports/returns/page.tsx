import ReportTable from "@/components/reports/ReportTable";
export default function ReturnsReportPage() { return <ReportTable title="Returns & Refunds Report" endpoint="/reports/returns" branchScoped filters={["search", "customer", "status", "resolution", "amount"]} statusOptions={["REQUESTED", "APPROVED", "COMPLETED", "REJECTED", "CANCELLED"]} searchPlaceholder="Return, invoice or reason" />; }
