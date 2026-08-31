import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicProductDetails, { type PublicProduct } from "@/components/public/qr/PublicProductDetails";
export const metadata: Metadata = { title: "Verified Product | TechNova POS" };
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
export default async function PublicProductPage({ params }: { params: Promise<{ token: string }> }) { const { token } = await params; const response = await fetch(`${API_URL}/qr/product/${encodeURIComponent(token)}`, { cache: "no-store" }); if (!response.ok) notFound(); return <PublicProductDetails value={(await response.json()) as PublicProduct} token={token} />; }
