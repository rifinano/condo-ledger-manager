
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
  
  const fetchResidents = useCallback(async () => {
    setIsLoading(true);
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
      setTotalCount(validResidents.length);
    } catch (error) {
      console.error("Error fetching residents:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setResidents, setIsLoading]);

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

  return {
    fetchResidents,
    filterResidents,
    totalCount
  };
};
