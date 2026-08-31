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
      setIsOffline(false);
    }

    function handleOffline() {
      setIsOffline(true);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

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
      if (typeof window !== "undefined" && !navigator.onLine) {
        setIsOffline(true);
        return false;
      }

      // Check network connectivity with a lightweight ping/head request
      try {
        await fetch("/favicon.ico", {
          method: "HEAD",
          cache: "no-store",
        });
        setIsOffline(false);
        return true;
      } catch {
        // If navigator.onLine is true but fetch fails, verify with navigator
        const online = typeof window !== "undefined" ? navigator.onLine : true;
        setIsOffline(!online);
        return online;
      }
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
