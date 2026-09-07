import ReportTable from "@/components/reports/ReportTable";

export default function LowStockReportPage() {
  return <ReportTable title="Low Stock Report" endpoint="/reports/low-stock" branchScoped dateScoped={false} filters={["search", "product"]} searchPlaceholder="SKU, product or category" />;
}
