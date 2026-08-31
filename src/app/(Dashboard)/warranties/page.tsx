import type { Metadata } from "next";
import WarrantyDashboardClientView, { type WarrantyPolicy } from "@/components/dashboard/warranties/WarrantyDashboardClientView";
import { serverApi } from "@/lib/api/server";

export const metadata: Metadata = { title: "QR & Warranty | TechNova POS" };
export default async function WarrantiesPage() { let policies: WarrantyPolicy[] = []; let loadError: string | undefined; try { policies = await serverApi<WarrantyPolicy[]>("/warranties/policies"); } catch (error) { loadError = error instanceof Error ? error.message : "Unable to load warranty policies."; } return <WarrantyDashboardClientView policies={policies} loadError={loadError} />; }
