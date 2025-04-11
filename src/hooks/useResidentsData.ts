
import { useCallback, useEffect } from "react";
import { getResidents, Resident } from "@/services/residentsService";
import { getBlocks } from "@/services/propertiesService";

/**
 * Hook to fetch and filter residents data
 */
export const useResidentsData = (
  setResidents: (residents: Resident[]) => void,
  setIsLoading: (loading: boolean) => void,
  searchTerm: string
) => {
  const fetchResidents = useCallback(async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  }, [setResidents, setIsLoading]);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  const filterResidents = (residents: Resident[]) => {
    return residents.filter(resident => 
      resident.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.block_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.apartment_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return {
    fetchResidents,
    filterResidents
  };
};
