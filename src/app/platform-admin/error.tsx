"use client";
export default function PlatformError({ reset }: { reset: () => void }) {
  return <main className="m-10 rounded-xl border bg-white p-8"><h1 className="text-xl font-semibold">Platform administration is unavailable</h1><p className="my-4">We could not load the current organization and billing data. Please retry or check the API connection.</p><button onClick={reset} className="rounded bg-teal-700 px-4 py-2 text-white">Retry</button></main>;
}
