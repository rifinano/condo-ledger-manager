
import { useState } from "react";

/**
 * Hook for managing resident data refresh functionality
 */
export const useResidentRefresh = (
  fetchResidents: () => Promise<void>,
  refreshPropertyData: () => void
) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const handleRetry = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      setHasAttemptedFetch(false); // Allow a new fetch attempt
      await fetchResidents();
      refreshPropertyData();
    } catch (error) {
      console.error("Error retrying data fetch:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    setIsRefreshing,
    hasAttemptedFetch,
    setHasAttemptedFetch,
    handleRetry
  };
};
