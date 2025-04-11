
import { useState, useCallback, useEffect } from "react";
import { 
  Block, 
  Apartment, 
  getBlocks, 
  getApartmentsByBlockId,
  getResidentByApartment,
  clearCache 
} from "@/services/properties";
import { toast } from "@/hooks/use-toast";

/**
 * Hook to handle property data fetching operations with improved error handling
 */
export const usePropertyFetch = () => {
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<(Block & { apartments: Apartment[] })[]>([]);
  const [residents, setResidents] = useState<Record<string, any>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastSuccessfulFetch, setLastSuccessfulFetch] = useState<number | null>(null);
  // Add a flag to track if we're in the process of fetching to prevent multiple concurrent fetches
  const [isFetching, setIsFetching] = useState(false);
  // Add a flag to track if the user has manually requested a refresh
  const [manualRefreshRequested, setManualRefreshRequested] = useState(false);
  // Add a counter for tracking failed attempts
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Fetch blocks and apartments with improved error handling
  const fetchProperties = useCallback(async () => {
    // If already fetching, don't start another fetch operation
    if (isFetching) return;
    
    // If we've had too many failed attempts in a row, only allow manual refreshes
    if (failedAttempts > 5 && !manualRefreshRequested) {
      console.log("Too many failed attempts, waiting for manual refresh");
      return;
    }
    
    setIsFetching(true);
    setLoading(true);
    setFetchError(null);
    
    try {
      // Add robust retry logic for network issues
      const maxRetries = 3;
      let attempt = 0;
      let error = null;
      let success = false;
      
      while (attempt < maxRetries && !success) {
        try {
          console.log(`Attempt ${attempt + 1} to fetch blocks`);
          const blocksData = await getBlocks();
          
          // Fetch all apartments for blocks in parallel
          const blocksWithApartments = await Promise.all(
            blocksData.map(async (block) => {
              const apartments = await getApartmentsByBlockId(block.id);
              return { ...block, apartments };
            })
          );
          
          setBlocks(blocksWithApartments);
          setLastSuccessfulFetch(Date.now());
          
          // Batch resident data fetching to reduce network requests
          const residentsMap: Record<string, any> = {};
          
          // Create an array of promises for all resident fetches
          const residentPromises = blocksWithApartments.flatMap(block => 
            block.apartments.map(async apartment => {
              try {
                const resident = await getResidentByApartment(block.name, apartment.number);
                if (resident) {
                  const key = `${block.name}-${apartment.number}`;
                  residentsMap[key] = resident;
                }
              } catch (resError) {
                console.error(`Error fetching resident for ${block.name}-${apartment.number}:`, resError);
                // Continue with other fetches even if one fails
              }
            })
          );
          
          // Wait for all resident fetch operations to complete
          await Promise.all(residentPromises);
          setResidents(residentsMap);
          
          // If we got here, we succeeded
          success = true;
          // Reset failed attempts counter on success
          setFailedAttempts(0);
          break;
        } catch (err) {
          error = err;
          attempt++;
          console.log(`Attempt ${attempt} failed, retrying...`);
          // Wait before retrying (exponential backoff)
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
          }
        }
      }
      
      // If we've exhausted all retries and still have an error
      if (!success) {
        console.error("Error fetching properties after retries:", error);
        setFailedAttempts(prev => prev + 1);
        const errorMessage = "Network error: Failed to connect to the server. Please check your internet connection and try again.";
        setFetchError(errorMessage);
        
        // Only show toast on the first few errors to avoid spam
        if (failedAttempts < 3) {
          toast({
            title: "Connection Error",
            description: "We're having trouble connecting to the server. Please check your internet connection.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Unexpected error fetching properties:", error);
      setFailedAttempts(prev => prev + 1);
      setFetchError("Unexpected error: Failed to fetch property data.");
    } finally {
      setLoading(false);
      setIsFetching(false);
      // Reset the manual refresh flag
      setManualRefreshRequested(false);
    }
  }, [isFetching, failedAttempts, manualRefreshRequested]);

  // Force a refresh of data by completely clearing the cache
  const refreshData = useCallback(() => {
    // Clear the cache using our utility function
    clearCache();
    // Mark that a manual refresh was requested
    setManualRefreshRequested(true);
    // Reset failed attempts counter on manual refresh
    setFailedAttempts(0);
    // Add toast to indicate refresh is happening
    toast({
      title: "Refreshing data",
      description: "Fetching the latest property data...",
    });
  }, []);

  // Only automatically fetch properties on initial mount or when manual refresh is requested
  useEffect(() => {
    if (!isFetching && (lastSuccessfulFetch === null || manualRefreshRequested)) {
      fetchProperties();
    }
  }, [fetchProperties, isFetching, lastSuccessfulFetch, manualRefreshRequested]);

  return {
    blocks,
    loading,
    residents,
    fetchProperties,
    refreshData,
    fetchError,
    lastSuccessfulFetch
  };
};
