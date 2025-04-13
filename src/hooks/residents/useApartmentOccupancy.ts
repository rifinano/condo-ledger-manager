
import { useCallback } from "react";
import { Resident } from "@/services/residents";

/**
 * Hook to check if an apartment is occupied by a resident
 */
export const useApartmentOccupancy = (allResidents: Resident[]) => {
  const isApartmentOccupied = useCallback((
    blockNumber: string, 
    apartmentNumber: string, 
    excludeResidentId?: string
  ) => {
    // If excludeResidentId is provided, don't count that resident's current apartment as occupied
    return allResidents.some(resident => 
      resident.block_number === blockNumber && 
      resident.apartment_number === apartmentNumber &&
      (!excludeResidentId || resident.id !== excludeResidentId)
    );
  }, [allResidents]);

  return { isApartmentOccupied };
};
