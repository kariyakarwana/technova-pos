"use client";

import { Printer, RefreshCw } from "lucide-react";
import Code128Barcode from "./Code128Barcode";
import type {
  BarcodeLabelSettings,
  BarcodeProductItem,
} from "./BarcodeTypes";

type PrintableLabel = {
  key: string;
  product: BarcodeProductItem;
};

export default function BarcodePreviewCard({
  products,
  quantities,
  settings,
  onReset,
  onPrint,
}: {
  products: BarcodeProductItem[];
  quantities: Record<string, number>;
  settings: BarcodeLabelSettings;
  onReset(): void;
  onPrint(): void;
}) {
  const labels: PrintableLabel[] = products.flatMap((product) =>
    Array.from(
      { length: Math.max(1, Math.min(100, quantities[product.id] ?? 1)) },
      (_, copyIndex) => ({ key: `${product.id}-${copyIndex}`, product }),
    ),
  );

  return (
    <section className="space-y-4">
      <div className="barcode-print-root rounded-2xl border border-[var(--brand-stroke)] bg-white p-6 shadow-xs">
        <div className="barcode-preview-heading mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
              Label preview
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {labels.length} label{labels.length === 1 ? "" : "s"} ready to print
            </p>
          </div>
          <span className="rounded-lg bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-[#0E9384]">
            {settings.paperSize} wide
          </span>
        </div>

        {labels.length > 0 ? (
          <div className="barcode-print-grid flex flex-wrap items-start gap-3">
            {labels.map(({ key, product }) => (
              <article
                key={key}
                className="barcode-label flex shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white px-2 py-2 text-center"
                style={{ width: settings.paperSize, minHeight: "28mm" }}
              >
                {settings.showName && (
                  <p className="w-full truncate text-[9px] font-bold text-slate-900">
                    {product.name}
                  </p>
                )}
                {settings.showSku && (
                  <p className="w-full truncate font-mono text-[7px] text-slate-500">
                    {product.sku}
                  </p>
                )}
                {product.barcodeCode && (
                  <Code128Barcode
                    value={product.barcodeCode}
                    height={40}
                    className="my-1 w-full"
                  />
                )}
                <div className="flex w-full items-end justify-between gap-1">
                  {settings.showValue && (
                    <p className="min-w-0 truncate font-mono text-[7px] font-semibold text-slate-700">
                      {product.barcodeCode}
                    </p>
                  )}
                  {settings.showPrice && (
                    <p className="ml-auto shrink-0 text-[8px] font-bold text-slate-900">
                      LKR {product.price.toLocaleString()}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid min-h-36 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                No products selected
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Select products with a barcode to build the print sheet.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="barcode-print-actions flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onReset}
          disabled={labels.length === 0}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#004532] px-5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#003828] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Clear queue
        </button>
        <button
          type="button"
          onClick={onPrint}
          disabled={labels.length === 0}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[var(--brand-green)] px-6 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#0B6E63] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Printer className="h-3.5 w-3.5" />
          Print labels
        </button>
      </div>
    </section>
  );
}
