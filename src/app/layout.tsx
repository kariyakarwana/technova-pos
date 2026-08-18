import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import "tailwindcss";
import "shadcn/tailwind.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechNova POS System",
  description: "Smart POS Solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="si"
   
      className={`${geistSans.variable} ${notoSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}