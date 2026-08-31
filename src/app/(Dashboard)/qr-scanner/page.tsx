import type { Metadata } from "next";
import QrScannerClientView from "@/components/dashboard/warranties/QrScannerClientView";
export const metadata: Metadata = { title: "QR Scanner | TechNova POS" };
export default function QrScannerPage() { return <QrScannerClientView />; }
