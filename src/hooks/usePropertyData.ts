
import { useEffect, useState, useCallback } from "react";
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

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Helper function to get block names for dropdowns
  const getBlockNames = (): string[] => {
    return blocks.map(block => block.name);
  };

  // Helper function to get apartments for a specific block
  const getApartments = (blockName: string): string[] => {
    const block = blocks.find(b => b.name === blockName);
    if (!block) return [];
    
    // Sort apartment numbers numerically
    return [...block.apartments]
      .sort((a, b) => {
        const numA = parseInt(a.number, 10);
        const numB = parseInt(b.number, 10);
        return numA - numB;
      })
      .map(apt => apt.number);
  };

  const isApartmentOccupied = (blockName: string, apartmentNumber: string) => {
    const key = `${blockName}-${apartmentNumber}`;
    return !!residents[key];
  };

  const getResidentName = (blockName: string, apartmentNumber: string) => {
    const key = `${blockName}-${apartmentNumber}`;
    const resident = residents[key];
    return resident ? resident.full_name : null;
  };

  // Month and year data for resident forms
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - 5 + i).toString());

  return {
    blocks,
    loading,
    fetchProperties,
    isApartmentOccupied,
    getResidentName,
    residents,
    getBlockNames,
    getApartments,
    months,
    years
  };
};
