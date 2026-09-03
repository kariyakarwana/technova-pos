import ReportTable from "@/components/reports/ReportTable";
export default function WarrantiesReportPage() { return <ReportTable title="Warranty Report" endpoint="/reports/warranties" branchScoped filters={["search", "customer", "product", "status"]} statusOptions={["PENDING", "ACTIVE", "EXPIRED", "VOIDED", "CLAIMED"]} searchPlaceholder="Serial number or customer" />; }
