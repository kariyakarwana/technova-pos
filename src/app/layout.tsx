import type { Metadata } from "next";

import { Geist_Mono, Noto_Sans } from "next/font/google";

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "TechNova POS System",

    template:
      "%s | TechNova POS",
  },

  description:
    "Intelligent point-of-sale, inventory and retail management for modern businesses.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`
        ${geistMono.variable}
        ${notoSans.variable}
        h-full
        overflow-hidden
        antialiased
      `}
    >
      <body className="min-h-full overflow-x-hidden bg-white font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}
