"use client";

import { useEffect } from "react";

export default function OfflineBootstrap() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    let active = true;
    const prepare = () => {
      if (!navigator.onLine) return;
      void navigator.serviceWorker.ready.then((registration) => {
        if (active) registration.active?.postMessage({ type: "PREPARE_OFFLINE" });
      });
    };
    void navigator.serviceWorker.register("/offline-sw.js", { scope: "/" }).then(prepare).catch(() => undefined);
    window.addEventListener("online", prepare);
    return () => {
      active = false;
      window.removeEventListener("online", prepare);
    };
  }, []);

  return null;
}
