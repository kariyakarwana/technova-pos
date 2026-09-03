import ReportTable from "@/components/reports/ReportTable";
export default function SalesReportPage() { return <ReportTable title="Sales Report" endpoint="/reports/sales" branchScoped cashierScoped />; }
