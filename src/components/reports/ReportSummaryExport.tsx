"use client";

import ReportExportActions from "./ReportExportActions";

export default function ReportSummaryExport({ rows }: { rows: Array<{ metric: string; value: string | number; detail: string }> }) {
  return <ReportExportActions title="Business Summary Report" rows={rows} />;
}
