"use client";

import { useOfflineMode } from "./OfflineContext";
import PosOfflineBanner from "./PosOfflineBanner";

export default function OfflineBannerController() {
  const { isOffline, isChecking, retryConnection } = useOfflineMode();

  if (!isOffline) return null;

  return (
    <PosOfflineBanner
      isChecking={isChecking}
      onRetry={retryConnection}
    />
  );
}
