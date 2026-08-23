import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  LayoutGrid,
  Leaf,
  Play,
  Sparkles,
  Store,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";


export default function HeroSection() {
  return (
    <div className="overflow-hidden bg-white w-full">


      <div className="pt-0 pb-12 lg:pt-2 lg:pb-10 w-full">

        <div className="w-full px-3 sm:px-4 lg:px-6">

          <div className="mb-6">
            <div
              style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}
              className="group inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-3 text-teal-700 text-sm font-medium border border-teal-200 shadow-sm transition-all duration-300 hover:bg-teal-600 hover:text-white hover:border-teal-600 cursor-pointer"
            >
              <Leaf className="h-4 w-4 text-teal-600 group-hover:text-white transition-colors duration-300 shrink-0" />
              <span>NEXT-GEN ENTERPRISE PLATFORM</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-center w-full">

            <div className="lg:pt-1 lg:pr-8">
              <div className="max-w-2xl">

                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl" style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}>
                  Orchestrate Your <br />
                  <span className="text-teal-600">
                    Business with the <br />
                    Ultimate POS System
                  </span>
                </h1>

                <p className="mt-6 text-lg text-slate-600 leading-relaxed" style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}>
                  Streamline sales, track multi-branch inventory in real-time, and automate daily store operations with our intelligent POS suite. Engineered for high-efficiency retail environments where speed, accuracy, and seamless customer checkout are paramount.
                </p>


                <div className="mt-8 flex flex-wrap items-center gap-4">


                  <Link href="/register">
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-white font-semibold shadow-md transition-all hover:bg-teal-700 cursor-pointer"
                      style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 text-white" />
                    </button>
                  </Link>


                  <Link href="/demo">
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-slate-700 font-semibold border border-slate-300 shadow-sm transition-all hover:bg-slate-50 cursor-pointer"
                      style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-400 text-teal-600">
                        <Play className="h-3 w-3 fill-current" />
                      </span>
                      View Demo
                    </button>
                  </Link>

                </div>

              </div>
            </div>


            <div className="relative flex justify-center lg:justify-end w-full">
              <div className="relative w-full max-w-2xl">
                <Image
                  width={2432}
                  height={1442}
                  src="/posmachine.png"
                  alt="Ultimate POS System Product Screenshot"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </div>


      <section className="bg-slate-50 py-12 lg:py-12 border-t border-slate-100 w-full">
        <div className="w-full px-3 sm:px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl" style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}>
              Core Capabilities
            </h2>
            <p className="mt-4 text-base text-slate-600" style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}>
              Designed for scale and reliability, TechNova provides the essential tools to build, manage, and optimize your business infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
            <div className="bg-gradient-to-r from-[#025148] to-[#0E9384] rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl w-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 border-2 border-white/70 shadow-md">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}>
                  Core Retail Management
                </h3>
                <ul className="space-y-3 text-sm text-white/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>User & Role Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Multi-Branch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Inventory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Supplier/PO</span>
                  </li>
                </ul>
              </div>
            </div>


            <div className="bg-gradient-to-r from-[#025148] to-[#0E9384] rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl w-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 border-2 border-white/70 shadow-md">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}>
                  POS Operations & Billing
                </h3>
                <ul className="space-y-3 text-sm text-white/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Sales processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Returns/Refunds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Loyalty Programs</span>
                  </li>
                </ul>
              </div>
            </div>


            <div className="bg-gradient-to-r from-[#025148] to-[#0E9384] rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl w-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 border-2 border-white/70 shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}>
                  Intelligent AI Capabilities
                </h3>
                <ul className="space-y-3 text-sm text-white/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>AI Business Assistant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Sales Forecasting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Smart Recommendations</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#025148] to-[#0E9384] rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl w-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 border-2 border-white/70 shadow-md">
                  <LayoutGrid className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}>
                  Advanced Technical Features
                </h3>
                <ul className="space-y-3 text-sm text-white/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Offline POS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Reporting & Analytics</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          <div className="bg-gradient-to-r from-[#025148] to-[#0E9384] py-19 text-white my-12 rounded-2xl w-full px-4 sm:px-6 shadow-xl">
            <div className="text-center flex flex-col items-center">

              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}>
                Ready to scale your retail operations?
              </h2>

              <p className="text-base sm:text-lg text-white/90 max-w-2xl mb-8">
                Deploy the TechNova POS suite today and transform your daily sales, inventory, and customer data into actionable, growth-driven retail strategies.
              </p>

              <Link href="/register">
                <Button className="bg-white text-[#025148] hover:bg-slate-100 font-semibold px-8 py-6 rounded-xl shadow-lg flex items-center gap-2 text-base cursor-pointer">
                  Initialize Setup 🚀
                </Button>
              </Link>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}