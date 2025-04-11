
import { useEffect, useState } from "react";
import { 
  Block, 
  Apartment, 
  getBlocks, 
  getApartmentsByBlockId,
  getResidentByApartment 
} from "@/services/propertiesService";

/**
 * Hook to manage property data including blocks, apartments, and residents
 */
export const usePropertyData = () => {
  const [blocks, setBlocks] = useState<(Block & { apartments: Apartment[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [residents, setResidents] = useState<Record<string, any>>({});

  // Fetch blocks and apartments
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const blocksData = await getBlocks();
      
      const blocksWithApartments = await Promise.all(
        blocksData.map(async (block) => {
          const apartments = await getApartmentsByBlockId(block.id);
          return { ...block, apartments };
        })
      );
      
      setBlocks(blocksWithApartments);
      
      // Fetch residents for each apartment
      const residentsMap: Record<string, any> = {};
      
      for (const block of blocksWithApartments) {
        for (const apartment of block.apartments) {
          const resident = await getResidentByApartment(block.name, apartment.number);
          if (resident) {
            const key = `${block.name}-${apartment.number}`;
            residentsMap[key] = resident;
          }
        }
      }
      
      setResidents(residentsMap);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const isApartmentOccupied = (blockName: string, apartmentNumber: string) => {
    const key = `${blockName}-${apartmentNumber}`;
    return !!residents[key];
  };

  const getResidentName = (blockName: string, apartmentNumber: string) => {
    const key = `${blockName}-${apartmentNumber}`;
    const resident = residents[key];
    return resident ? resident.full_name : null;
  };

  return {
    blocks,
    loading,
    fetchProperties,
    isApartmentOccupied,
    getResidentName,
    residents
  };
};
