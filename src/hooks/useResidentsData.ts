
import { useCallback, useState } from "react";
import { getResidents, Resident } from "@/services/residents";
import { getBlocks } from "@/services/propertiesService";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to fetch and filter residents data
 */
export const useResidentsData = (
  setResidents: (residents: Resident[]) => void,
  setIsLoading: (loading: boolean) => void,
  searchTerm: string
) => {
  const [totalCount, setTotalCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [allResidents, setAllResidents] = useState<Resident[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchResidents = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetching) return;
    
    setIsLoading(true);
    setIsFetching(true);
    setError(null); // Reset error state
    
    try {
      // Add retry mechanism for network issues
      const maxRetries = 3;
      let attempt = 0;
      let lastError = null;
      
      while (attempt < maxRetries) {
        try {
          console.log(`Attempt ${attempt + 1} to fetch residents data`);
          const data = await getResidents();
          
          // If we succeeded, get the blocks as well
          let blocksData = [];
          try {
            blocksData = await getBlocks();
          } catch (blockError) {
            console.error("Error fetching blocks, proceeding with residents only:", blockError);
            // Continue with empty blocks list
          }
          
          const blockNames = new Set(blocksData.map(block => block.name));
          
          // Filter residents to show only those with valid blocks
          // This prevents issues if blocks are deleted but residents still reference them
          // If we don't have any blocks, show all residents
          const validResidents = blockNames.size === 0 ? 
            data : 
            data.filter(resident => blockNames.has(resident.block_number));
          
          setResidents(validResidents || []);
          setAllResidents(validResidents || []);
          setTotalCount(validResidents.length);
          return;
        } catch (err) {
          lastError = err;
          attempt++;
          console.log(`Residents fetch attempt ${attempt} failed, ${attempt < maxRetries ? "retrying..." : "giving up."}`);
          // Wait before retrying (exponential backoff)
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
          }
        }
      }
      
      // If we get here, all retries failed
      throw lastError;
    } catch (error: any) {
      console.error("Error fetching residents after all retries:", error);
      setError("Failed to fetch residents data. Please check your connection and try again.");
      setResidents([]);
      setAllResidents([]);
      setTotalCount(0);
      
      // Show toast notification only once
      toast({
        title: "Connection Error",
        description: "Could not load resident data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [setResidents, setIsLoading, isFetching, toast]);

  const filterResidents = useCallback((residents: Resident[]) => {
    if (!searchTerm.trim()) return residents;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return residents.filter(resident => {
      // Search in main resident properties
      const mainPropsMatch = 
        resident.full_name.toLowerCase().includes(lowerSearchTerm) ||
        (resident.phone_number && resident.phone_number.toLowerCase().includes(lowerSearchTerm)) ||
        resident.block_number.toLowerCase().includes(lowerSearchTerm) ||
        resident.apartment_number.toLowerCase().includes(lowerSearchTerm);
        
      // Search in all associated apartments
      const apartmentsMatch = resident.apartments?.some(apt => 
        apt.block_number.toLowerCase().includes(lowerSearchTerm) ||
        apt.apartment_number.toLowerCase().includes(lowerSearchTerm)
      );
        
      return mainPropsMatch || apartmentsMatch;
    });
  }, [searchTerm]);

  // Check if an apartment is already occupied by another resident
  const isApartmentOccupied = useCallback((blockNumber: string, apartmentNumber: string, excludeResidentId?: string) => {
    // If excludeResidentId is provided, don't count that resident's current apartment as occupied
    return allResidents.some(resident => 
      resident.block_number === blockNumber && 
      resident.apartment_number === apartmentNumber &&
      (!excludeResidentId || resident.id !== excludeResidentId)
    );
  }, [allResidents]);

  return {
    fetchResidents,
    filterResidents,
    isApartmentOccupied,
    totalCount,
    isFetching,
    error
  };
};
