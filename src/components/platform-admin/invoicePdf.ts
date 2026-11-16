import type { PlatformInvoice } from "./types";

function escapePdfText(input: string): string {
  // Replace non-ASCII characters cleanly for standard Type1 WinAnsi fonts, then escape (, ), \
  const ascii = input.replace(/[^\x20-\x7E]/g, " ");
  return ascii
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "Pending";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Pending";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function fmtMethod(method: string | null | undefined): string {
  switch ((method || "BANK_TRANSFER").toUpperCase()) {
    case "BANK_TRANSFER":
      return "Bank Wire / Transfer";
    case "ONLINE":
      return "Online Portal";
    case "CASH":
      return "Direct Cash";
    case "CHEQUE":
      return "Cheque";
    default:
      return method || "Bank Transfer";
  }
}

export function buildInvoicePdfBytes(
  inv: PlatformInvoice,
  isOverdue: boolean
): Uint8Array {
  const statusLabel = isOverdue ? "OVERDUE" : inv.status;
  const statusRgb =
    inv.status === "PAID"
      ? "0.055 0.576 0.518" // #0E9384
      : isOverdue
      ? "0.827 0.184 0.184" // #D32F2F
      : "0.012 0.412 0.631"; // #0369A1

  const cmds: string[] = [];

  // 1. Top Header Banner (#0E9384)
  cmds.push("0.055 0.576 0.518 rg");
  cmds.push("0 742 595 100 re f");

  // Header Left Text (White)
  cmds.push("1 1 1 rg");
  cmds.push("BT /F2 20 Tf 40 798 Td (TechNova POS) Tj ET");
  cmds.push("BT /F1 9 Tf 40 780 Td (ROOT CLOUD SAAS  -  B2B SUBSCRIPTION RECEIPT) Tj ET");

  // Header Right Text (White)
  cmds.push("BT /F2 13 Tf 420 798 Td (INVOICE RECEIPT) Tj ET");
  cmds.push(`BT /F3 11 Tf 420 780 Td (${escapePdfText(inv.invoiceNumber)}) Tj ET`);

  // 2. Status Pill Box (top right below banner)
  cmds.push(`${statusRgb} rg`);
  cmds.push("420 692 135 24 re f");
  cmds.push("1 1 1 rg");
  cmds.push(`BT /F2 10 Tf 436 700 Td (STATUS: ${escapePdfText(statusLabel)}) Tj ET`);

  // 3. Billed To Section (Left)
  cmds.push("0.055 0.576 0.518 rg");
  cmds.push("BT /F2 9 Tf 40 705 Td (BILLED ORGANIZATION) Tj ET");
  cmds.push("0.114 0.161 0.224 rg");
  cmds.push(`BT /F2 13 Tf 40 686 Td (${escapePdfText(inv.organizationName)}) Tj ET`);
  cmds.push("0.392 0.455 0.545 rg");
  cmds.push(
    `BT /F1 10 Tf 40 668 Td (${escapePdfText(inv.organizationEmail || "No business email on file")}) Tj ET`
  );
  cmds.push(
    `BT /F1 10 Tf 40 652 Td (Subscription Plan: ${escapePdfText(inv.planName)} (${escapePdfText(inv.planCode)})) Tj ET`
  );

  // 4. Invoice Dates Box (Right)
  cmds.push("0.392 0.455 0.545 rg");
  cmds.push(`BT /F1 9 Tf 420 668 Td (Issued Date:  ${escapePdfText(fmtDate(inv.issuedDate))}) Tj ET`);
  cmds.push(`BT /F1 9 Tf 420 652 Td (Due Date:     ${escapePdfText(fmtDate(inv.dueDate))}) Tj ET`);
  cmds.push(`BT /F1 9 Tf 420 636 Td (Paid Date:    ${escapePdfText(fmtDate(inv.paidAt))}) Tj ET`);

  // Horizontal Divider
  cmds.push("0.894 0.906 0.925 RG 1 w");
  cmds.push("40 612 m 555 612 l S");

  // 5. Line Items Table Header (#EEFFFD fill + #0E9384 border)
  cmds.push("0.933 1 0.992 rg");
  cmds.push("40 562 515 26 re f");
  cmds.push("0.055 0.576 0.518 RG 0.8 w");
  cmds.push("40 562 515 26 re S");

  cmds.push("0 0.271 0.196 rg");
  cmds.push("BT /F2 9 Tf 52 571 Td (DESCRIPTION) Tj ET");
  cmds.push("BT /F2 9 Tf 340 571 Td (BILLING CYCLE) Tj ET");
  cmds.push("BT /F2 9 Tf 465 571 Td (AMOUNT (USD)) Tj ET");

  // Table Row 1: Plan Subtotal
  cmds.push("0.114 0.161 0.224 rg");
  cmds.push(
    `BT /F2 10 Tf 52 536 Td (${escapePdfText(inv.planName)} Commercial Subscription) Tj ET`
  );
  cmds.push("0.392 0.455 0.545 rg");
  cmds.push("BT /F1 10 Tf 340 536 Td (30-Day Monthly) Tj ET");
  cmds.push("0.114 0.161 0.224 rg");
  cmds.push(`BT /F3 10 Tf 465 536 Td ($${inv.subtotalUsd.toFixed(2)}) Tj ET`);

  cmds.push("0.894 0.906 0.925 RG 0.5 w");
  cmds.push("40 520 m 555 520 l S");

  // Table Row 2: VAT 18%
  cmds.push("0.114 0.161 0.224 rg");
  cmds.push("BT /F1 10 Tf 52 496 Td (Value Added Tax (Inland Revenue 18% VAT)) Tj ET");
  cmds.push("0.392 0.455 0.545 rg");
  cmds.push("BT /F1 10 Tf 340 496 Td (Tax 18.0%) Tj ET");
  cmds.push("0.114 0.161 0.224 rg");
  cmds.push(`BT /F3 10 Tf 465 496 Td ($${inv.vatAmountUsd.toFixed(2)}) Tj ET`);

  cmds.push("0.894 0.906 0.925 RG 0.5 w");
  cmds.push("40 480 m 555 480 l S");

  // 6. Totals Summary (Right Aligned)
  cmds.push("0.392 0.455 0.545 rg");
  cmds.push("BT /F1 10 Tf 340 450 Td (Subtotal:) Tj ET");
  cmds.push("0.114 0.161 0.224 rg");
  cmds.push(`BT /F3 10 Tf 465 450 Td ($${inv.subtotalUsd.toFixed(2)}) Tj ET`);

  cmds.push("0.392 0.455 0.545 rg");
  cmds.push("BT /F1 10 Tf 340 432 Td (VAT (18%):) Tj ET");
  cmds.push("0.114 0.161 0.224 rg");
  cmds.push(`BT /F3 10 Tf 465 432 Td ($${inv.vatAmountUsd.toFixed(2)}) Tj ET`);

  // Highlighted Total Bar (#004532)
  cmds.push("0 0.271 0.196 rg");
  cmds.push("330 390 225 28 re f");
  cmds.push("1 1 1 rg");
  cmds.push("BT /F2 11 Tf 342 400 Td (TOTAL (USD):) Tj ET");
  cmds.push(`BT /F3 12 Tf 465 400 Td ($${inv.totalAmountUsd.toFixed(2)}) Tj ET`);

  // 7. Payment & Reconciliation Details Box
  cmds.push("0.973 0.98 0.988 rg");
  cmds.push("40 270 515 88 re f");
  cmds.push("0.894 0.906 0.925 RG 0.8 w");
  cmds.push("40 270 515 88 re S");

  cmds.push("0.055 0.576 0.518 rg");
  cmds.push("BT /F2 9 Tf 52 338 Td (PAYMENT & RECONCILIATION DETAILS) Tj ET");
  cmds.push("0.114 0.161 0.224 rg");
  cmds.push(
    `BT /F1 10 Tf 52 316 Td (Payment Method:       ${escapePdfText(fmtMethod(inv.paymentMethod))}) Tj ET`
  );
  cmds.push(
    `BT /F1 10 Tf 52 298 Td (Wire / Slip Ref:      ${escapePdfText(inv.paymentRef || "Awaiting Bank Settlement")}) Tj ET`
  );
  cmds.push(
    `BT /F1 10 Tf 52 280 Td (Verification Status:  ${escapePdfText(statusLabel)}) Tj ET`
  );

  // 8. Footer
  cmds.push("0.894 0.906 0.925 RG 0.6 w");
  cmds.push("40 80 m 555 80 l S");
  cmds.push("0.58 0.639 0.722 rg");
  cmds.push(
    "BT /F1 8 Tf 40 62 Td (TechNova POS Cloud Platform  |  B2B SaaS Treasury & Invoicing  |  Digitally Generated Receipt) Tj ET"
  );
  cmds.push(
    `BT /F3 8 Tf 40 48 Td (Document ID: ${escapePdfText(inv.id)}   Generated: ${escapePdfText(new Date().toISOString().slice(0, 10))}) Tj ET`
  );

  const contentStream = cmds.join("\n");
  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(contentStream);

  // Build PDF objects with exact byte offsets
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
    "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n",
    `7 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
  ];

  const header = "%PDF-1.4\n";
  const parts: Uint8Array[] = [encoder.encode(header)];
  let currentOffset = parts[0].length;
  const offsets: number[] = [];

  for (const objStr of objects) {
    offsets.push(currentOffset);
    const bytes = encoder.encode(objStr);
    parts.push(bytes);
    currentOffset += bytes.length;
  }

  const xrefOffset = currentOffset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  parts.push(encoder.encode(xref));

  const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const p of parts) {
    result.set(p, pos);
    pos += p.length;
  }
  return result;
}
