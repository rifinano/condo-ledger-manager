
import { useEffect } from "react";

/**
 * Hook to handle automatic data synchronization
 */
export const usePaymentSync = (
  refreshAllData: () => Promise<void>,
  refetchResidents: () => void,
  refetchPayments: () => void
) => {
  // Auto-refresh when the component mounts
  useEffect(() => {
    refreshAllData();
    // Set up an interval to periodically refresh data (every 5 minutes)
    const refreshInterval = setInterval(() => {
      refetchResidents();
      refetchPayments();
    }, 1000 * 60 * 5);
    
    return () => clearInterval(refreshInterval);
  }, [refreshAllData, refetchResidents, refetchPayments]);
};
