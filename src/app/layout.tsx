import type {
  Metadata,
} from "next";

import {
  Geist,
  Geist_Mono,
  Noto_Sans,
} from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: [
    "400",
    "500",
    "600",
    "700",
    "800",
  ],
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
        ${geistSans.variable}
        ${geistMono.variable}
        ${notoSans.variable}
        h-full
        antialiased
      `}
    >
      <body className="min-h-full bg-white font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}