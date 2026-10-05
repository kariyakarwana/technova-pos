"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { IScannerControls } from "@zxing/browser";

type ScanMode = "qr" | "barcode";

function cameraError(reason: unknown): string {
  if (reason instanceof DOMException) {
    if (reason.name === "NotAllowedError" || reason.name === "SecurityError") {
      return "Camera access was blocked. Allow camera permission for this site in your browser settings and try again.";
    }
    if (reason.name === "NotFoundError" || reason.name === "OverconstrainedError") {
      return "No usable camera was found on this device.";
    }
    if (reason.name === "NotReadableError") {
      return "The camera is in use by another app. Close it and try again.";
    }
  }
  return reason instanceof Error ? reason.message : "Unable to start the camera.";
}

export function useCameraScanner(mode: ScanMode, onScan: (value: string) => void) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const sessionRef = useRef(0);
  const onScanRef = useRef(onScan);
  const [active, setActive] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const release = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    const video = videoRef.current;
    if (video?.srcObject instanceof MediaStream) {
      video.srcObject.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  }, []);

  const stop = useCallback(() => {
    sessionRef.current += 1;
    release();
    setActive(false);
    setStarting(false);
  }, [release]);

  useEffect(() => () => {
    sessionRef.current += 1;
    release();
  }, [release]);

  const start = useCallback(async () => {
    if (active || starting) return;
    setError(null);

    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError("Camera scanning requires HTTPS (or localhost) and a browser with camera access.");
      return;
    }

    const video = videoRef.current;
    if (!video) {
      setError("Camera preview is not ready. Please try again.");
      return;
    }

    const session = ++sessionRef.current;
    setStarting(true);
    try {
      // ZXing works where the native BarcodeDetector API is unavailable.
      const { BrowserQRCodeReader, BrowserMultiFormatReader } = await import("@zxing/browser");
      if (session !== sessionRef.current) return;
      const reader = mode === "qr" ? new BrowserQRCodeReader() : new BrowserMultiFormatReader();
      if (mode === "barcode") {
        const { BarcodeFormat } = await import("@zxing/library");
        reader.possibleFormats = [
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.ITF,
        ];
      }
      if (session !== sessionRef.current) return;
      const controls = await reader.decodeFromConstraints(
        { video: { facingMode: { ideal: "environment" } }, audio: false },
        video,
        (result) => {
          if (!result || session !== sessionRef.current) return;
          const value = result.getText().trim();
          if (!value) return;
          stop();
          onScanRef.current(value);
        },
      );
      if (session !== sessionRef.current) {
        controls.stop();
        return;
      }
      controlsRef.current = controls;
      setActive(true);
    } catch (reason) {
      if (session === sessionRef.current) {
        release();
        setError(cameraError(reason));
      }
    } finally {
      if (session === sessionRef.current) setStarting(false);
    }
  }, [active, starting, mode, release, stop]);

  return { videoRef, active, starting, error, start, stop };
}
