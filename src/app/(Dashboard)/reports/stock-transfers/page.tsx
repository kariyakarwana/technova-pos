import ReportTable from "@/components/reports/ReportTable";
export default function StockTransfersReportPage() { return <ReportTable title="Stock Transfer Report" endpoint="/reports/stock-transfers" branchScoped filters={["search", "status"]} statusOptions={["DRAFT", "SUBMITTED", "IN_TRANSIT", "RECEIVED", "CANCELLED"]} searchPlaceholder="Transfer number or reason" />; }
