import type { Metadata } from "next";
import WarrantyDashboardClientView, { type WarrantyPolicy } from "@/components/dashboard/warranties/WarrantyDashboardClientView";
import { serverApi } from "@/lib/api/server";

export const metadata: Metadata = { title: "QR & Warranty | TechNova POS" };
export default async function WarrantiesPage() { let policies: WarrantyPolicy[] = []; let products: Array<{ id: string; sku: string; name: string }> = []; let loadError: string | undefined; try { const [policyRows, productRows] = await Promise.all([serverApi<WarrantyPolicy[]>("/warranties/policies"), serverApi<{ data: Array<{ id: string; sku: string; name: string }> }>("/catalog/products?page=1&pageSize=100&status=ACTIVE")]); policies = policyRows; products = productRows.data; } catch (error) { loadError = error instanceof Error ? error.message : "Unable to load warranty policies."; } return <WarrantyDashboardClientView policies={policies} products={products} loadError={loadError} />; }
