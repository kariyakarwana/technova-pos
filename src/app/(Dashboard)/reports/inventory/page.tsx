import ReportTable from "@/components/reports/ReportTable";
export default function InventoryReportPage() { return <ReportTable title="Inventory Valuation" endpoint="/reports/inventory" branchScoped dateScoped={false} filters={["search", "product"]} searchPlaceholder="SKU, product or category" />; }
