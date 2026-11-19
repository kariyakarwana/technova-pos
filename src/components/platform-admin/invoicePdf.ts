import type { PlatformInvoice } from './types';

const clean = (value: string) => value.replace(/[^\x20-\x7e]/g, ' ');
const escape = (value: string) => clean(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
const date = (value?: string | null) => value ? new Date(value).toISOString().slice(0, 10) : 'Not recorded';

/** Prints issued snapshots, including every line item, with continuation pages. */
export function buildInvoicePdfBytes(inv: PlatformInvoice, isOverdue: boolean): Uint8Array {
  const currency = inv.currency ?? 'USD';
  const money = (value: number | string) => `${currency} ${Number(value).toFixed(2)}`;
  const status = inv.status === 'PAID' ? 'PAID' : isOverdue ? 'OVERDUE' : inv.status;
  const rows = [
    'NxCodeWorks | TechNova POS',
    inv.status === 'PAID' ? 'PAID INVOICE / PAYMENT RECEIPT' : 'SUBSCRIPTION INVOICE',
    `Invoice: ${inv.invoiceNumber}`, `Status: ${status}`, '',
    `Billed to: ${inv.organizationName}`, `Email: ${inv.organizationEmail ?? 'Not recorded'}`,
    `Plan at issue: ${inv.planName} (${inv.planCode})`,
    `Issued: ${date(inv.issuedDate)}   Payment deadline: ${date(inv.dueDate)}`,
    `Service period: ${date(inv.periodStart)} to ${date(inv.periodEnd)}`, '',
    'ITEM / QUANTITY / AMOUNT',
  ];
  if (inv.lineItems?.length) {
    for (const line of inv.lineItems) rows.push(`${line.description} | Qty ${line.quantity} | ${money(line.amountUsd)}`);
  } else rows.push(`Historical invoice subtotal | ${money(inv.subtotalUsd)}`, 'Detailed historic line snapshots were not recorded.');
  rows.push('', `Subtotal: ${money(inv.subtotalUsd)}`,
    `Tax${inv.vatRateSnapshot == null ? ' (historic rate not recorded)' : ` (${(inv.vatRateSnapshot * 100).toFixed(2)}%)`}: ${money(inv.vatAmountUsd)}`,
    `TOTAL: ${money(inv.totalAmountUsd)}`, '',
    `Payment method: ${inv.paymentMethod ?? 'Not recorded'}`, `Payment reference: ${inv.paymentRef ?? 'Awaiting verified manual settlement'}`,
    `Paid: ${date(inv.paidAt)}`, inv.status === 'PAID' ? 'Payment recorded by the platform administrator.' : 'This invoice is not proof of payment. Online settlement is disabled.',
    '', `Document ID: ${inv.id}`);
  const wrapped = rows.flatMap(row => clean(row).match(/.{1,88}(?:\s|$)|.{1,88}/g) ?? ['']);
  const pages: string[][] = [];
  for (let i = 0; i < wrapped.length; i += 44) pages.push(wrapped.slice(i, i + 44));
  const objects: string[] = ['', '', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  const children: number[] = [];
  pages.forEach((lines, index) => {
    const pageId = objects.length + 1, streamId = pageId + 1;
    children.push(pageId);
    const commands = ['0.08 0.16 0.2 rg', ...lines.map((line, i) => `BT /F1 ${i === 0 && index === 0 ? 15 : 10} Tf 42 ${790 - i * 16} Td (${escape(line)}) Tj ET`), `BT /F1 9 Tf 42 35 Td (TechNova | Page ${index + 1} of ${pages.length}) Tj ET`].join('\n');
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${streamId} 0 R >>`);
    objects.push(`<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`);
  });
  objects[0] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[1] = `<< /Type /Pages /Kids [${children.map(id => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`;
  let output = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((object, i) => { offsets.push(output.length); output += `${i + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = output.length;
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) output += `${String(offset).padStart(10, '0')} 00000 n \n`;
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(output);
}
