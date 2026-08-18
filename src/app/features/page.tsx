"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
    Store,
    Users,
    RefreshCw,
    Truck,
    ClipboardCheck,
    PackageCheck,
    LineChart,
    CreditCard,
    RotateCcw,
    Award,
    Bot,
    TrendingUp,
    Radio,
    Lightbulb,
    WifiOff,
    Database,
    ShieldCheck,
    CheckCircle2,
} from "lucide-react";

export default function FeaturesPage() {
    const resilienceFeatures = [
        {
            icon: WifiOff,
            title: 'Offline POS Mode',
            description: 'Uninterrupted sales processing during network failures. The system continues to function securely offline.',
        },
        {
            icon: Database,
            title: 'Automatic Synchronization',
            description: 'Once connectivity is restored, all offline transactions and inventory changes sync seamlessly to the cloud.',
        },
        {
            icon: ShieldCheck,
            title: 'Secure Audit Logging',
            description: 'Immutable records of all system activities, providing total traceability and compliance for your operations.',
        },
    ];

    return (
        <div
            className="w-full bg-white font-sans text-slate-900 overflow-x-hidden"
            style={{
                fontFamily: "var(--font-noto-sans), sans-serif",
            }}
        >

            <section
                className="w-full text-white py-16 sm:py-20 px-4 sm:px-6 text-center"
                style={{ background: "linear-gradient(to bottom right, #025148, #0E9384)" }}
            >
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                        Comprehensive
                        <br />
                        Features & Capabilities
                    </h1>
                    <p className="text-white/75 text-sm sm:text-base max-w-2xl mx-auto mt-5 leading-relaxed">
                        Explore the full suite of tools within our unified,
                        scalable Point-of-Sale ecosystem, engineered for modern
                        retailers demanding absolute reliability and predictive
                        intelligence.
                    </p>
                </div>
            </section>


            <section className="w-full bg-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="mb-8 sm:mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#0E9384]">
                            Core Retail Operations
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mt-2 leading-relaxed">
                            Streamline your entire business topology from a
                            single dashboard. Manage users, track branch
                            performance, and scale effortlessly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-gradient-to-br from-[#005B52] via-[#087D71] to-[#119B8D] p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-11 h-11 border border-white/40 rounded-xl flex items-center justify-center mb-5 text-white bg-white/10">
                                <Store className="w-5 h-5" strokeWidth={1.8} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                Branch Management
                            </h3>
                            <p className="text-white text-opacity-95 text-xs sm:text-sm leading-relaxed font-normal">
                                Complete oversight of multi-location operations.
                                Monitor realtime metrics, transfer inventory
                                between branches, and centralize reporting while
                                allowing localized control.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-[#005B52] via-[#087D71] to-[#119B8D] p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-11 h-11 border border-white/40 rounded-xl flex items-center justify-center mb-5 text-white bg-white/10">
                                <Users className="w-5 h-5" strokeWidth={1.8} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                User Management (RBAC)
                            </h3>
                            <p className="text-white text-opacity-95 text-xs sm:text-sm leading-relaxed font-normal">
                                Granular Role-Based Access Control. Assign
                                cashiers, managers, and admins with specific
                                permissions. Securely track all staff activities
                                and shift operations.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-[#005B52] via-[#087D71] to-[#119B8D] p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="w-11 h-11 border border-white/40 rounded-xl flex items-center justify-center mb-5 text-white bg-white/10">
                                <RefreshCw className="w-5 h-5" strokeWidth={1.8} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                Multi-Location Sync
                            </h3>
                            <p className="text-white text-opacity-95 text-xs sm:text-sm leading-relaxed font-normal">
                                Ensure data consistency across your entire
                                network. Prices, inventory levels, and customer
                                profiles sync reliably, providing a single
                                source of truth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-14 sm:py-16 border-y border-slate-100 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-100 h-[260px] sm:h-[350px] lg:h-[400px] shadow-sm">
                        <Image
                            src="/tab.webp"
                            alt="End-to-End Stock Control"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0E9384] bg-[#0E9384]/10 px-3 py-1 rounded-full">
                                INVENTORY & SUPPLY CHAIN
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#0E9384] mt-3">
                                End-to-End Stock Control
                            </h2>
                            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                                Redefine your entire supply chain seamlessly
                                from ordering to receiving and tracking,
                                ensuring optimal stock levels at all times.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <div className="text-[#0B132B] flex items-center gap-2 font-semibold text-sm">
                                    <Truck className="w-4 h-4 text-[#0E9384]" strokeWidth={1.8} />
                                    Supplier Management
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                                    Streamline purchase orders, suppliers,
                                    catalog parameters, and performance tracking.
                                </p>
                            </div>

                            <div>
                                <div className="text-[#0B132B] flex items-center gap-2 font-semibold text-sm">
                                    <ClipboardCheck className="w-4 h-4 text-[#0E9384]" strokeWidth={1.8} />
                                    Purchase Order Tracking
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                                    Create, track, and fulfill purchase orders
                                    with automated status updates.
                                </p>
                            </div>

                            <div>
                                <div className="text-[#0B132B] flex items-center gap-2 font-semibold text-sm">
                                    <PackageCheck className="w-4 h-4 text-[#0E9384]" strokeWidth={1.8} />
                                    Goods Receiving (GRN)
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                                    Automated inventory receiving with batch
                                    tracking and discrepancy flagging.
                                </p>
                            </div>

                            <div>
                                <div className="text-[#0B132B] flex items-center gap-2 font-semibold text-sm">
                                    <LineChart className="w-4 h-4 text-[#0E9384]" strokeWidth={1.8} />
                                    Real-time Stock Tracking
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                                    Gain visibility into store-wide turnover
                                    with automated alerts on low stock.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-gradient-to-br from-[#005B52] via-[#087D71] to-[#119B8D] py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-9">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                            Sales & Billing
                        </h2>
                        <p className="text-white/75 text-xs sm:text-sm mt-2">
                            Fuel lightning-fast transactions, delight your
                            customers, and speed up operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-white rounded-2xl p-6 text-slate-800 flex flex-col justify-between shadow-xl w-full">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-[#0E9384]/10 flex items-center justify-center mb-6 border-2 border-[#0E9384] shadow-md">
                                    <Store className="w-6 h-6 text-[#0E9384]" />
                                </div>
                                <h3 className="text-lg font-bold mb-4 text-[#0E9384]">
                                    Sales Processing
                                </h3>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#0E9384] shrink-0" />
                                        <span>Fast Transactions</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#0E9384] shrink-0" />
                                        <span>Barcode Scanning</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#0E9384] shrink-0" />
                                        <span>Quick Checkout</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 text-slate-800 flex flex-col justify-between shadow-xl w-full">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-[#0E9384]/10 flex items-center justify-center mb-6 border-2 border-[#0E9384] shadow-md">
                                    <CreditCard className="w-6 h-6 text-[#0E9384]" />
                                </div>
                                <h3 className="text-lg font-bold mb-4 text-[#0E9384]">
                                    Multiple Payments
                                </h3>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#0E9384] shrink-0" />
                                        <span>Card & Cash</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#0E9384] shrink-0" />
                                        <span>Mobile Payments</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#0E9384] shrink-0" />
                                        <span>Split Payments</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 text-slate-800 flex flex-col justify-between shadow-xl w-full">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-[#0E9384]/10 flex items-center justify-center mb-6 border-2 border-[#0E9384] shadow-md">
                                    <RotateCcw className="w-6 h-6 text-[#0E9384]" />
                                </div>
                                <h3 className="text-lg font-bold mb-4 text-[#0E9384]">
                                    Returns & Refunds
                                </h3>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#0E9384] shrink-0" />
                                        <span>Secure Procedures</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#0E9384] shrink-0" />
                                        <span>Flexible Returns</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#0E9384] shrink-0" />
                                        <span>Inventory Logging</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 text-slate-800 flex flex-col justify-between shadow-xl w-full">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-[#0E9384]/10 flex items-center justify-center mb-6 border-2 border-[#0E9384] shadow-md">
                                    <Award className="w-6 h-6 text-[#0E9384]" />
                                </div>
                                <h3 className="text-lg font-bold mb-4 text-[#0E9384]">
                                    Loyalty Programs
                                </h3>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#0E9384] shrink-0" />
                                        <span>Customer Relations</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#0E9384] shrink-0" />
                                        <span>Track Memberships</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#0E9384] shrink-0" />
                                        <span>Targeted Promos</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        
            <section className="w-full bg-white py-14 sm:py-16 border-y border-slate-100 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Content */}
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0E9384] bg-[#0E9384]/10 px-3 py-1 rounded-full">
                            AI INTELLIGENCE
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#0E9384] mt-3">
                            Intelligent Decision Support
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed max-w-lg">
                            Transform data into action. Our predictive models analyze historical trends to optimize your future operations.
                        </p>

                        <div className="space-y-4 mt-7">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full border border-[#0E9384] flex items-center justify-center text-[#0E9384] shrink-0">
                                    <Bot className="w-4 h-4" strokeWidth={1.7} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">
                                        AI Business Assistant
                                    </h4>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                        Conversational Interface for instant insights. Ask questions like &quot;What are my top sellers this week?&quot; in natural language.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full border border-[#0E9384] flex items-center justify-center text-[#0E9384] shrink-0">
                                    <TrendingUp className="w-4 h-4" strokeWidth={1.7} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">
                                        Sales Forecasting
                                    </h4>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                        Predict future revenue based on historical data, seasonality, and local events to plan better.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full border border-[#0E9384] flex items-center justify-center text-[#0E9384] shrink-0">
                                    <Radio className="w-4 h-4" strokeWidth={1.7} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">
                                        Demand Forecasting
                                    </h4>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                        Anticipate product demand accurately to avoid stockouts and reduce excess inventory costs.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full border border-[#0E9384] flex items-center justify-center text-[#0E9384] shrink-0">
                                    <Lightbulb className="w-4 h-4" strokeWidth={1.7} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">
                                        Inventory Intelligence
                                    </h4>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                        Smart categorization, variant management, and automated shrinkage calculations powered by machine learning.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

            
                    <div className="relative rounded-2xl overflow-hidden h-[340px] sm:h-[420px] lg:h-[480px] shadow-sm bg-slate-100">
                        <Image
                            src="/robot.jpg"
                            alt="Intelligent Decision Support"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            <section className="w-full bg-[#005A51] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            Infrastructure & Resilience
                        </h2>
                        <p className="text-white/80 text-base sm:text-lg mt-4 leading-relaxed">
                            Engineered for absolute reliability, ensuring your operations never stop even when the internet does.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {resilienceFeatures.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-[20px] text-center flex flex-col items-center shadow-sm hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="w-14 h-14 rounded-full border border-[#109A8C] mx-auto flex items-center justify-center text-[#109A8C] mb-6">
                                        <Icon
                                            className="w-7 h-7"
                                            strokeWidth={1.5}
                                        />
                                    </div>

                                    <h3 className="text-xl font-semibold text-[#0E9384] tracking-tight">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm text-[#4F565C] leading-relaxed mt-4">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}