
import { Block, Apartment } from "@/services/properties";

/**
 * Hook to provide property helper functions
 */
export const usePropertyHelpers = (
  blocks: (Block & { apartments: Apartment[] })[], 
  residents: Record<string, any>
) => {
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

  return {
    getBlockNames,
    getApartments,
    isApartmentOccupied,
    getResidentName
  };
};
