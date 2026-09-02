import type { Metadata } from "next";
import PosClientView from "@/components/dashboard/pos/PosClientView";

export const metadata: Metadata = {
  title: "Point of Sale | TechNova POS",
  description: "TechNova POS — fast, offline-capable point-of-sale terminal.",
};

/**
 * Server component entry-point for the POS route.
 * All interactive logic lives in PosClientView (client component).
 */
export default function PosPage() {
  return <PosClientView />;
}
