
import { useCallback } from "react";
import { Resident } from "@/services/residents";

/**
 * Hook to filter residents based on search criteria
 */
export const useResidentsFilter = (searchTerm: string) => {
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

  return { filterResidents };
};
