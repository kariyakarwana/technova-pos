import Link from "next/link";
import {
  CreditCard,
  Share2,
  Store,
  WifiOff,
} from "lucide-react";

export default function HeroSection() {
  return (
    <div className="w-full bg-[#F4F8F6] text-[#0F3B32]">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: HERO
      ───────────────────────────────────────────────────────────── */}
      <section className="pt-8 sm:pt-14 pb-8 sm:pb-12 text-center px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E1F2EC] px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-[#0D5C4E] mb-6 border border-[#CDE8DE] shadow-xs">
            <span className="text-[#0E9384] text-xs">✦</span>
            <span className="tracking-wide uppercase">POS WITH AN AI BUSINESS ASSISTANT</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F3B32] leading-[1.15] max-w-3xl">
            Sell faster. Stock smarter.
            <br />
            <span className="text-[#0E9384]">Run every branch</span> from one screen.
          </h1>

          {/* Supporting Description */}
          <p className="mt-5 text-sm sm:text-base text-[#4A6B63] max-w-2xl leading-relaxed">
            Billing, inventory and reporting that keep working offline, with AI that
            forecasts demand and answers questions about your business.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-[#0D5C4E] hover:bg-[#0B4E42] text-white text-xs sm:text-sm font-semibold px-6 sm:px-7 py-3 shadow-md hover:shadow-lg transition-all"
            >
              Start free trial
            </Link>
            <Link
              href="#preview"
              className="inline-flex items-center justify-center rounded-full bg-white hover:bg-slate-50 text-[#0F3B32] border border-[#D1E3DB] text-xs sm:text-sm font-semibold px-6 sm:px-7 py-3 shadow-xs hover:border-[#B2D4C7] transition-all"
            >
              Watch demo
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: PRODUCT PREVIEW (DASHBOARD MOCKUP)
      ───────────────────────────────────────────────────────────── */}
      <section id="preview" className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Card Container simulating browser app */}
          <div className="rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-5 shadow-2xl border border-[#DDE8E2] overflow-hidden">
            {/* Top Browser Bar */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#F0F4F2] mb-3 sm:mb-4">
              {/* Window dots */}
              <div className="flex items-center gap-1.5 w-16">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
              </div>
              {/* Centered URL bar */}
              <div className="rounded-full bg-[#F4F7F5] border border-[#E2EBE6] px-4 py-1 text-[11px] text-[#6B8B82] font-mono tracking-tight truncate max-w-[220px] sm:max-w-xs">
                pos.technovapos.com/dashboard
              </div>
              <div className="w-16" />
            </div>

            {/* Mockup Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
              {/* Left Sidebar */}
              <div className="md:col-span-3 lg:col-span-2.5 bg-[#0D5C4E] rounded-xl sm:rounded-2xl p-3 text-white flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="bg-[#137A68] text-white font-medium text-xs px-3 py-2 rounded-lg">
                    Dashboard
                  </div>
                  {["Sales", "Inventory", "Suppliers", "Customers", "Reports"].map((item) => (
                    <div
                      key={item}
                      className="text-white/80 hover:text-white text-xs px-3 py-2 font-medium rounded-lg hover:bg-white/10 transition-colors"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Workspace Area */}
              <div className="md:col-span-9 lg:col-span-9.5 flex flex-col gap-3 sm:gap-4">
                {/* 3 Top Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#F8FAF9] rounded-xl p-3.5 border border-[#E6EFEA]">
                    <span className="text-[11px] text-[#6B8B82] font-medium block">
                      Today&apos;s sales
                    </span>
                    <span className="text-base sm:text-lg font-bold text-[#0F3B32] mt-0.5 block">
                      Rs. 148,200
                    </span>
                  </div>

                  <div className="bg-[#F8FAF9] rounded-xl p-3.5 border border-[#E6EFEA]">
                    <span className="text-[11px] text-[#6B8B82] font-medium block">
                      Orders
                    </span>
                    <span className="text-base sm:text-lg font-bold text-[#0F3B32] mt-0.5 block">
                      212
                    </span>
                  </div>

                  <div className="bg-[#FFF5ED] rounded-xl p-3.5 border border-[#FDE3CF]">
                    <span className="text-[11px] text-[#C26B38] font-medium block">
                      Low stock items
                    </span>
                    <span className="text-base sm:text-lg font-bold text-[#9A4616] mt-0.5 block">
                      9
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Chart & AI Assistant */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
                  {/* Sales this week Bar Chart */}
                  <div className="lg:col-span-7 bg-[#F8FAF9] rounded-xl p-4 border border-[#E6EFEA] flex flex-col justify-between">
                    <span className="text-xs font-semibold text-[#0F3B32] block mb-3">
                      Sales this week
                    </span>
                    <div className="flex items-end justify-between gap-2 h-28 pt-2">
                      <div className="h-14 w-full rounded-t-md bg-[#BDE3D5]" />
                      <div className="h-18 w-full rounded-t-md bg-[#BDE3D5]" />
                      <div className="h-16 w-full rounded-t-md bg-[#BDE3D5]" />
                      <div className="h-20 w-full rounded-t-md bg-[#BDE3D5]" />
                      <div className="h-26 w-full rounded-t-md bg-[#0D5C4E]" />
                      <div className="h-20 w-full rounded-t-md bg-[#D4ECE3] border border-dashed border-[#0D5C4E]/40" />
                    </div>
                  </div>

                  {/* AI Assistant Mini Card */}
                  <div className="lg:col-span-5 bg-[#0D5C4E] rounded-xl p-3.5 text-white flex flex-col justify-between gap-2.5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white/95">
                      <span className="text-[#A3D9C9] text-xs">✦</span>
                      <span>AI Assistant</span>
                    </div>
                    <div className="bg-white/15 rounded-lg px-2.5 py-1.5 text-[11px] text-white/90 leading-tight">
                      Which products should I reorder this week?
                    </div>
                    <div className="bg-white rounded-lg p-2.5 text-[11px] text-[#0F3B32] shadow-xs leading-snug">
                      12 active items are running low. 25kg tea is due for purchase orders to your top suppliers.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: FEATURES ("Everything a retail counter needs")
      ───────────────────────────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0E9384] mb-2">
            FEATURES
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F3B32] tracking-tight mb-12 sm:mb-16">
            Everything a retail counter needs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
            {/* Card 1: Multi-branch retail */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5EDE8] shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-[#E1F2EC] flex items-center justify-center text-[#0D5C4E] mb-5">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F3B32] mb-2">
                Multi-branch retail
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6B63] leading-relaxed">
                Sales, inventory and suppliers across every store, with purchase orders in a few clicks.
              </p>
            </div>

            {/* Card 2: Fast checkout */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5EDE8] shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-[#E1F2EC] flex items-center justify-center text-[#0D5C4E] mb-5">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F3B32] mb-2">
                Fast checkout
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6B63] leading-relaxed">
                Sales, returns, refunds and loyalty rewards handled at the counter in a flash, clearing the queue.
              </p>
            </div>

            {/* Card 3: AI that runs with you (FEATURED CARD) */}
            <div className="bg-[#0D5C4E] rounded-2xl p-6 text-white shadow-lg flex flex-col relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-5">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                AI that runs with you
              </h3>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                Ask the assistant about your business, forecast sales and get smart re-stock recommendations.
              </p>
            </div>

            {/* Card 4: Works offline */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5EDE8] shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-[#E1F2EC] flex items-center justify-center text-[#0D5C4E] mb-5">
                <WifiOff className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F3B32] mb-2">
                Works offline
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6B63] leading-relaxed">
                Keep selling when the connection drops. Receipts and analytics sync as soon as you are back online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: HOW IT WORKS ("Up and running in three steps")
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0E9384] mb-2">
            HOW IT WORKS
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F3B32] tracking-tight mb-12 sm:mb-16">
            Up and running in three steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-left">
            <div>
              <span className="text-4xl sm:text-5xl font-extrabold text-[#BCE3D6] block mb-3 font-mono">
                01
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#0F3B32] mb-1.5">
                Add your branches and products
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6B63] leading-relaxed">
                Setup stores, cashiers, stock and suppliers.
              </p>
            </div>

            <div>
              <span className="text-4xl sm:text-5xl font-extrabold text-[#BCE3D6] block mb-3 font-mono">
                02
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#0F3B32] mb-1.5">
                Start selling
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6B63] leading-relaxed">
                Ring up sales on any device, online or offline.
              </p>
            </div>

            <div>
              <span className="text-4xl sm:text-5xl font-extrabold text-[#BCE3D6] block mb-3 font-mono">
                03
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#0F3B32] mb-1.5">
                Let AI guide the next move
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6B63] leading-relaxed">
                Get forecasts and reorder suggestions from your own data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: AI INTELLIGENCE SECTION ("Decisions backed by your own data")
      ───────────────────────────────────────────────────────────── */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0D5C4E] rounded-3xl p-6 sm:p-10 lg:p-14 text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Features */}
              <div className="lg:col-span-7">
                <p className="text-xs font-bold uppercase tracking-wider text-[#A3D9C9] mb-3">
                  AI INTELLIGENCE
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
                  Decisions backed by your own data
                </h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-8 max-w-xl">
                  Predictive models read your sales history so managers can plan stock and staff with confidence.
                </p>

                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      AI Business Assistant
                    </h3>
                    <p className="text-xs sm:text-sm text-white/75 mt-0.5 leading-relaxed">
                      Ask &quot;What are my top sellers this week?&quot; and get an answer in plain language.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Sales Forecasting
                    </h3>
                    <p className="text-xs sm:text-sm text-white/75 mt-0.5 leading-relaxed">
                      Predict revenue from history, seasonality and local events.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Demand Forecasting
                    </h3>
                    <p className="text-xs sm:text-sm text-white/75 mt-0.5 leading-relaxed">
                      Anticipate demand to avoid stockouts and excess stock.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Inventory Intelligence
                    </h3>
                    <p className="text-xs sm:text-sm text-white/75 mt-0.5 leading-relaxed">
                      Smart categorization, variants and automated shrinkage calculations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Assistant Chat Mockup */}
              <div className="lg:col-span-5 bg-[#0B4E42] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/90 pb-2 border-b border-white/10">
                  <span className="text-[#A3D9C9] text-xs">✦</span>
                  <span>AI Assistant</span>
                </div>

                <div className="space-y-2">
                  <div className="bg-white/15 rounded-xl px-3.5 py-2 text-xs text-white/95 self-start inline-block">
                    What are my top sellers this week?
                  </div>
                  <div className="bg-white rounded-xl p-3.5 text-xs text-[#0F3B32] shadow-sm leading-relaxed">
                    Rice 5kg, tea 400g and coconut oil lead this week. Coconut oil is running low, so suggest reordering before the weekend.
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="bg-white/15 rounded-xl px-3.5 py-2 text-xs text-white/95 self-start inline-block">
                    Forecast next week&apos;s sales
                  </div>
                  <div className="bg-white rounded-xl p-3.5 text-xs text-[#0F3B32] shadow-sm leading-relaxed">
                    Pace is about 17% more than this week, driven by the weekend and a local holiday.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7: PRICING ("Simple monthly plans")
      ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0E9384] mb-2">
            PRICING
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F3B32] tracking-tight mb-2">
            Simple monthly plans
          </h2>
          <p className="text-xs sm:text-sm text-[#4A6B63] mb-12 sm:mb-16">
            Unlimited customers on every plan. Prices exclude VAT.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
            {/* Plan 1: Basic */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5EDE8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F3B32] mb-3">Basic</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#0F3B32]">$49</span>
                  <span className="text-xs text-[#4A6B63] ml-1">/month</span>
                </div>
              </div>
              <p className="text-xs text-[#4A6B63] mt-6 pt-4 border-t border-[#EDF3EF] leading-relaxed">
                Up to 10 users, one shop.
              </p>
            </div>

            {/* Plan 2: Standard */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5EDE8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F3B32] mb-3">Standard</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#0F3B32]">$69</span>
                  <span className="text-xs text-[#4A6B63] ml-1">/month</span>
                </div>
              </div>
              <p className="text-xs text-[#4A6B63] mt-6 pt-4 border-t border-[#EDF3EF] leading-relaxed">
                Up to 20 users, one shop, 500 emails
              </p>
            </div>

            {/* Plan 3: Professional (FEATURED CARD) */}
            <div className="bg-[#0D5C4E] rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative transform lg:-translate-y-1">
              <div>
                <h3 className="text-sm font-bold text-white mb-3">Professional</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">$149</span>
                  <span className="text-xs text-white/80 ml-1">/month</span>
                </div>
              </div>
              <p className="text-xs text-white/90 mt-6 pt-4 border-t border-white/20 leading-relaxed">
                Up to 2 branches, WhatsApp bills and AI
              </p>
            </div>

            {/* Plan 4: Enterprise */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5EDE8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0F3B32] mb-3">Enterprise</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#0F3B32]">$199</span>
                  <span className="text-xs text-[#4A6B63] ml-1">/month</span>
                </div>
              </div>
              <p className="text-xs text-[#4A6B63] mt-6 pt-4 border-t border-[#EDF3EF] leading-relaxed">
                Up to 10 branches, 30 users, 1,500 AI requests
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0F3B32] hover:text-[#0E9384] transition-colors"
            >
              <span>Compare all plans</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8: CALL TO ACTION (CTA)
      ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-8 sm:py-16 px-4 sm:px-6 mb-8 sm:mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0D5C4E] rounded-3xl p-8 sm:p-12 lg:p-14 text-center text-white shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Ready to see TechNova in your store?
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
              Book a walkthrough or try the demo yourself.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-white hover:bg-slate-50 text-[#0D5C4E] text-xs sm:text-sm font-semibold px-6 sm:px-7 py-3 shadow-md transition-all"
              >
                Start free trial
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-[#0B4E42] hover:bg-[#094137] text-white border border-white/30 text-xs sm:text-sm font-semibold px-6 sm:px-7 py-3 transition-all"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
