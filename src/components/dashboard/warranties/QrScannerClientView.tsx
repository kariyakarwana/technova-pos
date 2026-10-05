"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CameraOff, Keyboard, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { productQrToken } from "@/lib/scanning/product-qr";
import { useCameraScanner } from "@/lib/scanning/use-camera-scanner";

export default function QrScannerClientView() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);

  function navigate(value: string) {
    const extracted = productQrToken(value);
    if (!extracted) {
      setLookupError("This is not a TechNova product QR label. Scan a product label or enter its token.");
      return;
    }
    setLookupError(null);
    router.push(`/qr/product/${encodeURIComponent(extracted)}`);
  }

  const { videoRef, active, starting, error, start, stop } = useCameraScanner("qr", navigate);

  function submit(event: FormEvent) {
    event.preventDefault();
    navigate(token);
  }

  return (
    <main className="bg-[#F8FAFC] p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-[#0E9384]">Serialized product lookup</p>
          <h1 className="mt-1 text-3xl font-bold">QR Scanner</h1>
          <p className="mt-2 text-sm text-slate-500">Scan a TechNova serialized label or enter its token manually.</p>
        </div>
        <BackButton href="/warranties" label="Back to Warranties" className="self-start sm:self-auto" />
      </header>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card className="overflow-hidden">
          <div className="relative flex min-h-[460px] items-center justify-center bg-slate-950">
            <video ref={videoRef} muted playsInline className={`absolute inset-0 h-full w-full object-cover ${active ? "opacity-100" : "opacity-0"}`} />
            <div className="pointer-events-none absolute h-60 w-60 rounded-3xl border-2 border-[#2DD4BF] shadow-[0_0_0_9999px_rgba(0,0,0,.28)]">
              <span className="absolute left-3 right-3 top-1/2 h-0.5 bg-[#2DD4BF] shadow-[0_0_14px_#2DD4BF]" />
            </div>
            {!active && <div className="text-center text-white">
              <Camera className="mx-auto h-9 w-9" />
              <p className="mt-3 font-semibold">Rear camera preview</p>
              <p className="mt-1 text-xs text-white/60">Permission is requested only after you start scanning.</p>
            </div>}
          </div>
          <CardContent className="flex items-center justify-between p-4">
            <span className="text-sm text-slate-600">Align the complete QR label inside the frame.</span>
            {active || starting ? (
              <Button onClick={stop} variant="outline"><CameraOff className="mr-2 h-4 w-4" />Stop</Button>
            ) : (
              <Button onClick={() => void start()} className="bg-[#025148]"><Camera className="mr-2 h-4 w-4" />Enable camera</Button>
            )}
          </CardContent>
        </Card>
        <Card className="h-fit">
          <CardHeader><CardTitle className="flex items-center gap-2"><Keyboard className="h-5 w-5 text-[#0E9384]" />Manual lookup</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <label className="space-y-2 text-sm font-medium">QR token or product URL
                <Input value={token} onChange={(event) => setToken(event.target.value)} placeholder="Paste QR token or URL" autoComplete="off" />
              </label>
              <Button className="w-full bg-[#025148]" disabled={!token.trim()}><QrCode className="mr-2 h-4 w-4" />View product details</Button>
            </form>
            {(error || lookupError) && <p role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{error || lookupError}</p>}
            <div className="mt-5 rounded-xl bg-teal-50 p-4 text-sm text-teal-800"><b>Privacy:</b> public lookup exposes safe product, serial and warranty information only.</div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
