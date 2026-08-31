import type { Metadata } from "next";
import WarrantyActivationForm from "@/components/public/warranty/WarrantyActivationForm";
export const metadata: Metadata = { title: "Activate Warranty | TechNova POS" };
export default async function ActivateWarrantyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) { const { token = "" } = await searchParams; return <WarrantyActivationForm token={token} />; }
