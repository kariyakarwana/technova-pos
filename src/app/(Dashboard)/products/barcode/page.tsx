import type { Metadata } from "next";
import BarcodeClientView from "@/components/dashboard/products/barcode/BarcodeClientView";

export const metadata: Metadata = {
  title: "Print Barcodes | TechNova POS",
  description: "Generate and print customized barcodes, product labels, and pricing tags.",
};

export default function BarcodePage() {
  return <BarcodeClientView />;
}
