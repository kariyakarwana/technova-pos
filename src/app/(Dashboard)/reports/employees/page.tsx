import ReportTable from "@/components/reports/ReportTable";
export default function EmployeesReportPage() { return <ReportTable title="Employee Access Report" endpoint="/reports/employees" branchScoped filters={["search", "role", "status"]} statusOptions={["PENDING_VERIFICATION", "ACTIVE", "INACTIVE", "SUSPENDED"]} searchPlaceholder="Employee name or email" />; }
