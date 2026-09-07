import ReportTable from "@/components/reports/ReportTable";
export default function SalesReportPage() { return <ReportTable title="Sales Report" endpoint="/reports/sales" branchScoped cashierScoped filters={["search", "customer", "status", "amount"]} statusOptions={["DRAFT", "COMPLETED", "VOIDED", "PARTIALLY_REFUNDED", "REFUNDED"]} searchPlaceholder="Invoice or customer" />; }
