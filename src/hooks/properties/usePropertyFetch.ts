
import { useState, useCallback } from "react";
import { 
  Block, 
  Apartment, 
  getBlocks, 
  getApartmentsByBlockId,
  getResidentByApartment,
  clearCache 
} from "@/services/properties";

/**
 * Hook to handle property data fetching operations
 */
export const usePropertyFetch = () => {
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<(Block & { apartments: Apartment[] })[]>([]);
  const [residents, setResidents] = useState<Record<string, any>>({});

  // Fetch blocks and apartments
  const fetchProperties = useCallback(async () => {
    setLoading(true);
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
      
      // Batch resident data fetching to reduce network requests
      const residentsMap: Record<string, any> = {};
      
      // Create an array of promises for all resident fetches
      const residentPromises = blocksWithApartments.flatMap(block => 
        block.apartments.map(async apartment => {
          const resident = await getResidentByApartment(block.name, apartment.number);
          if (resident) {
            const key = `${block.name}-${apartment.number}`;
            residentsMap[key] = resident;
          }
        })
      );
      
      // Wait for all resident fetch operations to complete
      await Promise.all(residentPromises);
      setResidents(residentsMap);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Force a refresh of data by completely clearing the cache
  const refreshData = useCallback(() => {
    // Clear the cache using our utility function
    clearCache();
  }, []);

  return {
    blocks,
    loading,
    residents,
    fetchProperties,
    refreshData
  };
};
