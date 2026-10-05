"use client";

import { useState } from "react";
import { Camera, X } from "lucide-react";
import { useCameraScanner } from "@/lib/scanning/use-camera-scanner";

export default function BarcodeScannerButton({ onScan }: { onScan(value: string): void }) {
  const [open, setOpen] = useState(false);
  const { videoRef, active, starting, error, start, stop } = useCameraScanner("barcode", (value) => {
    onScan(value);
    setOpen(false);
  });

  function close() {
    stop();
    setOpen(false);
  }

  return <>
    <button type="button" onClick={() => setOpen(true)} className="mt-1 inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#0E9384] bg-teal-50 px-3 text-xs font-semibold text-[#0E9384]">
      <Camera className="h-4 w-4" />Scan
    </button>
    {open && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4">
      <div role="dialog" aria-modal="true" aria-label="Scan product barcode" className="w-full max-w-lg rounded-2xl bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div><h2 className="font-bold">Scan product barcode</h2><p className="text-xs text-slate-500">Place the barcode inside the camera view.</p></div>
          <button type="button" onClick={close} aria-label="Close scanner" className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <video ref={videoRef} playsInline muted className="aspect-video w-full rounded-xl bg-slate-950 object-cover" />
        {error && <p role="alert" className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">{error}</p>}
        <button type="button" onClick={() => void start()} disabled={active || starting} className="mt-3 h-10 rounded-lg bg-[#0E9384] px-4 text-sm font-semibold text-white disabled:opacity-60">
          {starting ? "Starting camera…" : active ? "Scanning…" : "Enable camera"}
        </button>
      </div>
    </div>}
  </>;
}
