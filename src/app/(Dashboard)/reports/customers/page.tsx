import ReportTable from "@/components/reports/ReportTable";
export default function CustomersReportPage() { return <ReportTable title="Customer Report" endpoint="/reports/customers" branchScoped filters={["search", "status"]} statusOptions={["ACTIVE", "INACTIVE", "ARCHIVED"]} searchPlaceholder="Number, name, email or phone" />; }
