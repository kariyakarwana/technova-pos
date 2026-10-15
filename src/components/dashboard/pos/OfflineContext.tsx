"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface OfflineContextValue {
  isOffline: boolean;
  isChecking: boolean;
  toggleOffline: () => void;
  setOffline: (value: boolean) => void;
  retryConnection: () => Promise<boolean>;
}

const OfflineContext = createContext<OfflineContextValue>({
  isOffline: false,
  isChecking: false,
  toggleOffline: () => {},
  setOffline: () => {},
  retryConnection: async () => true,
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

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !navigator.onLine;
    }
    return false;
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);

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
      if (navigator.onLine) handleOnline();

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

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

  return (
    <OfflineContext.Provider
      value={{
        isOffline,
        isChecking,
        toggleOffline,
        setOffline: setIsOffline,
        retryConnection,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOfflineMode() {
  return useContext(OfflineContext);
}
