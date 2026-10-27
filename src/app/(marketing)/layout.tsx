import type {
  ReactNode,
} from "react";

import Footer from "@/components/landing/footer";
import Navbar from "@/components/landing/navbar";

type MarketingLayoutProps = {
  children: ReactNode;
};

export default function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F8F6] text-[#0F3B32]">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}