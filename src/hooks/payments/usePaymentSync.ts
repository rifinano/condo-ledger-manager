
import { useEffect, useRef, useState } from "react";

/**
 * Hook to handle automatic data synchronization with debouncing
 */
export const usePaymentSync = (
  refreshAllData: () => Promise<void>,
  refetchResidents: () => void,
  refetchPayments: () => void
) => {
  // Using refs to track if the component is mounted
  const isMountedRef = useRef(true);
  // Track if we're currently experiencing network issues
  const [hasNetworkIssue, setHasNetworkIssue] = useState(false);
  // Add debounce timeout ref
  const debounceTimeoutRef = useRef<number | null>(null);
  
  // Function to safely refresh data with error handling
  const safeRefresh = async () => {
    try {
      if (isMountedRef.current && !hasNetworkIssue) {
        await refreshAllData();
        setHasNetworkIssue(false);
      }
    } catch (error) {
      console.error("Error during data refresh:", error);
      setHasNetworkIssue(true);
      
      // Try again after 30 seconds if we had a network issue
      setTimeout(() => {
        setHasNetworkIssue(false);
      }, 30000);
    }
  };
  
  // Debounced refresh function
  const debouncedRefresh = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = window.setTimeout(() => {
      if (document.visibilityState === 'visible' && !hasNetworkIssue) {
        refetchResidents();
        refetchPayments();
      }
    }, 1000) as unknown as number;
  };
  
  // Auto-refresh when the component mounts, but only once
  useEffect(() => {
    // Only refresh if the component is mounted
    if (isMountedRef.current) {
      safeRefresh();
    }
    
    // Set up an interval to periodically refresh data (every 5 minutes)
    // Using a longer interval to reduce server load
    const refreshInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && !hasNetworkIssue) {
        debouncedRefresh();
      }
    }, 1000 * 60 * 5);
    
    // Add visibility change listener to refresh data when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !hasNetworkIssue) {
        debouncedRefresh();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      isMountedRef.current = false;
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Clear any pending debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [refreshAllData, refetchResidents, refetchPayments, hasNetworkIssue]);
};
