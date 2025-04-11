
import { useCallback, useState } from "react";
import { getResidents, Resident } from "@/services/residents";
import { getBlocks } from "@/services/propertiesService";

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
  
  const fetchResidents = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetching) return;
    
    setIsLoading(true);
    setIsFetching(true);
    
    try {
      const data = await getResidents();
      
      // Get the blocks from the database to ensure we have updated block names
      const blocksData = await getBlocks();
      const blockNames = new Set(blocksData.map(block => block.name));
      
      // Filter residents to show only those with valid blocks
      // This prevents issues if blocks are deleted but residents still reference them
      const validResidents = data.filter(resident => 
        blockNames.has(resident.block_number) || blockNames.size === 0
      );
      
      setResidents(validResidents || []);
      setAllResidents(validResidents || []);
      setTotalCount(validResidents.length);
      return;
    } catch (error) {
      console.error("Error fetching residents:", error);
      throw error; // Re-throw so the parent component can handle it
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [setResidents, setIsLoading, isFetching]);

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
    isFetching
  };
};
