"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { OFFLINE_QUEUE_CHANGED, queuedSales, synchronizeOfflineSales } from "./offlineSales";

interface OfflineContextValue {
  userId: string;
  isOffline: boolean;
  isChecking: boolean;
  isSyncing: boolean;
  queued: number;
  legacyQueued: number;
  syncRevision: number;
  syncMessage: string | null;
  toggleOffline: () => void;
  setOffline: (value: boolean) => void;
  retryConnection: () => Promise<boolean>;
  syncNow: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextValue>({
  userId: "",
  isOffline: false,
  isChecking: false,
  isSyncing: false,
  queued: 0,
  legacyQueued: 0,
  syncRevision: 0,
  syncMessage: null,
  toggleOffline: () => {},
  setOffline: () => {},
  retryConnection: async () => true,
  syncNow: async () => {},
});

async function canReachBackend(): Promise<boolean> {
  if (typeof window !== "undefined" && !navigator.onLine) return false;
  try {
    const response = await fetch("/api/backend/health", {
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function OfflineProvider({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !navigator.onLine;
    }
    return false;
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [queued, setQueued] = useState(0);
  const [legacyQueued, setLegacyQueued] = useState(0);
  const [syncRevision, setSyncRevision] = useState(0);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const refreshQueue = useCallback(() => {
    try {
      const queue = queuedSales(userId);
      setQueued(queue.pending.length);
      setLegacyQueued(queue.legacyCount);
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : "Unable to read saved sales.");
    }
  }, [userId]);

  useEffect(() => {
    refreshQueue();
    window.addEventListener(OFFLINE_QUEUE_CHANGED, refreshQueue);
    window.addEventListener("storage", refreshQueue);
    return () => {
      window.removeEventListener(OFFLINE_QUEUE_CHANGED, refreshQueue);
      window.removeEventListener("storage", refreshQueue);
    };
  }, [refreshQueue]);

  useEffect(() => {
    function handleOnline() {
      void canReachBackend().then((reachable) => setIsOffline(!reachable));
    }

    function handleOffline() {
      setIsOffline(true);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      if (navigator.onLine && !isOffline) handleOnline();
      // Detect a new outage promptly, then avoid spamming failed health checks.
      const timer = window.setInterval(handleOnline, isOffline ? 60000 : 15000);

      return () => {
        window.clearInterval(timer);
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, [isOffline]);

  const toggleOffline = useCallback(() => {
    setIsOffline((prev) => !prev);
  }, []);

  const retryConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const reachable = await canReachBackend();
      setIsOffline(!reachable);
      return reachable;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const syncNow = useCallback(async () => {
    if (isOffline) return;
    setIsSyncing(true);
    try {
      const result = await synchronizeOfflineSales(userId);
      refreshQueue();
      if (result.applied || result.rejected || result.error) {
        setSyncMessage(result.error ?? `${result.applied} sale(s) synchronized${result.rejected ? `; ${result.rejected} rejected. Review the batch details below.` : "."}`);
        setSyncRevision((current) => current + 1);
      }
    } finally {
      setIsSyncing(false);
    }
  }, [isOffline, refreshQueue, userId]);

  useEffect(() => {
    if (isOffline) return;
    void syncNow();
    const timer = window.setInterval(() => void syncNow(), 30000);
    return () => window.clearInterval(timer);
  }, [isOffline, syncNow]);

  return (
    <OfflineContext.Provider
      value={{
        userId,
        isOffline,
        isChecking,
        isSyncing,
        queued,
        legacyQueued,
        syncRevision,
        syncMessage,
        toggleOffline,
        setOffline: setIsOffline,
        retryConnection,
        syncNow,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOfflineMode() {
  return useContext(OfflineContext);
}
