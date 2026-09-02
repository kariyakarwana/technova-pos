import ReportTable from "@/components/reports/ReportTable";
export default function InventoryReportPage() { return <ReportTable title="Inventory & Low Stock" endpoint="/reports/inventory" branchScoped dateScoped={false} />; }
