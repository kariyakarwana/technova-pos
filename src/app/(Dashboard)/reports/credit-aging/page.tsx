import ReportTable from "@/components/reports/ReportTable";
export default function CreditAgingReportPage() { return <ReportTable title="Credit Aging" endpoint="/reports/credit-aging" dateScoped={false} />; }
