import ReportTable from "@/components/reports/ReportTable";
export default function CreditAgingReportPage() { return <ReportTable title="Credit Aging" endpoint="/reports/credit-aging" branchScoped dateScoped={false} filters={["search", "customer", "status", "amount"]} statusOptions={["ACTIVE", "PAID", "OVERDUE", "DEFAULTED", "CANCELLED"]} searchPlaceholder="Agreement, invoice or customer" />; }
