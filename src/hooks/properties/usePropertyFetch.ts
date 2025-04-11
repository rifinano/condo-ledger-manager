
import { useState, useCallback } from "react";
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

  // Fetch blocks and apartments with improved error handling
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    
    try {
      // Add robust retry logic for network issues
      const maxRetries = 3;
      let attempt = 0;
      let error = null;
      
      while (attempt < maxRetries) {
        try {
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
      if (attempt === maxRetries) {
        console.error("Error fetching properties after retries:", error);
        const errorMessage = "Network error: Failed to connect to the server. Please check your internet connection and try again.";
        setFetchError(errorMessage);
        toast({
          title: "Connection Error",
          description: "We're having trouble connecting to the server. Please check your internet connection.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error fetching properties:", error);
      setFetchError("Unexpected error: Failed to fetch property data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Force a refresh of data by completely clearing the cache
  const refreshData = useCallback(() => {
    // Clear the cache using our utility function
    clearCache();
    // Add toast to indicate refresh is happening
    toast({
      title: "Refreshing data",
      description: "Fetching the latest property data...",
    });
  }, []);

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
