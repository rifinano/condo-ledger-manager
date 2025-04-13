
import { detectImportConflicts, getExistingResidentDetails } from '@/utils/residents/conflictUtils';

/**
 * Hook for detecting conflicts in imported resident data
 */
export const useImportConflictDetection = () => {
  /**
   * Detect all types of conflicts in the import data
   */
  const detectAllConflicts = async (
    validRows: string[][],
    isApartmentOccupied: (blockNumber: string, apartmentNumber: string) => boolean
  ): Promise<{
    importErrors: string[],
    occupiedLocations: Record<string, string>
  }> => {
    // Detect conflicts in the import batch
    const importErrors = detectImportConflicts(validRows);
    
    // Efficiently check for occupied locations
    const occupiedLocations: Record<string, string> = {};
    const locationCheckPromises: Promise<void>[] = [];
    
    for (const row of validRows) {
      const [, , blockNumber, apartmentNumber] = row;
      
      if (isApartmentOccupied(blockNumber, apartmentNumber)) {
        const locationKey = `${blockNumber}-${apartmentNumber}`;
        
        // Create a promise to get resident details
        const checkPromise = async () => {
          const existingResidentDetails = await getExistingResidentDetails(blockNumber, apartmentNumber);
          occupiedLocations[locationKey] = existingResidentDetails;
          
          const locationError = `Location already occupied: Block ${blockNumber}, Apartment ${apartmentNumber} occupied by ${existingResidentDetails}`;
          if (!importErrors.includes(locationError)) {
            importErrors.push(locationError);
          }
        };
        
        locationCheckPromises.push(checkPromise());
      }
    }
    
    // Wait for all location checks to complete
    await Promise.all(locationCheckPromises);
    
    return { importErrors, occupiedLocations };
  };

  return {
    detectAllConflicts
  };
};
