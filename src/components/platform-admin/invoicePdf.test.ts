import { describe, expect, it } from 'vitest';
import { buildInvoicePdfBytes } from './invoicePdf';
import type { PlatformInvoice } from './types';

describe('issued invoice PDF', () => {
  const invoice: PlatformInvoice = { id: 'qa-invoice', invoiceNumber: 'QA-001', organizationId: 'qa-org', organizationName: 'QA Organization', organizationEmail: 'qa@example.test', planName: 'Historic plan', planCode: 'OLD', subtotalUsd: 100, vatAmountUsd: 7.5, vatRateSnapshot: 0.075, totalAmountUsd: 107.5, currency: 'USD', status: 'PENDING', issuedDate: '2026-11-18', dueDate: '2026-11-25', paidAt: null, paymentMethod: 'BANK_TRANSFER', paymentRef: null };
  it('prints stored tax and distinguishes an unpaid invoice from a receipt', () => {
    const pdf = new TextDecoder().decode(buildInvoicePdfBytes(invoice, false));
    expect(pdf).toContain('7.50%');
    expect(pdf).toContain('not proof of payment');
    expect(pdf).not.toContain('18%');
    expect(pdf).not.toContain('PAID INVOICE / PAYMENT RECEIPT');
  });
  it('paginates all invoice lines without dropping later add-ons', () => {
    const pdf = new TextDecoder().decode(buildInvoicePdfBytes({ ...invoice, lineItems: Array.from({ length: 75 }, (_, i) => ({ description: `Addon ${i + 1}`, quantity: 1, amountUsd: '1.00' })) }, false));
    expect(pdf).toContain('Addon 75');
    expect(pdf).toContain('/Count 3');
  });
});
