import { redirect } from "next/navigation";

export default function LegacyBarcodeProductPage() {
  redirect("/products/barcode");
}
