"use client";
export default function BillingError({ reset }: { reset: () => void }) {
  return <section className="m-6 rounded-xl border bg-white p-6"><h1 className="text-xl font-semibold">Billing information is unavailable</h1><p className="my-4">We could not retrieve your subscription. Retry or contact NxCodeWorks if your organization has not been assigned a plan.</p><button onClick={reset} className="rounded bg-teal-700 px-4 py-2 text-white">Retry</button></section>;
}
