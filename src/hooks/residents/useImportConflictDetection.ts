
import { useState } from 'react';
import { detectImportConflicts, getExistingResidentDetails } from '@/utils/residents/conflictUtils';
import { useToast } from '@/hooks/use-toast';
import { useNetworkErrorHandler } from '@/hooks/useNetworkErrorHandler';

/**
 * Hook for detecting conflicts in imported resident data
 */
export const useImportConflictDetection = () => {
  const { toast } = useToast();
  const { handleNetworkError } = useNetworkErrorHandler();
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);

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
    setIsCheckingConflicts(true);
    
    try {
      // Detect conflicts in the import batch
      const importErrors = detectImportConflicts(validRows);
      
      // Efficiently check for occupied locations
      const occupiedLocations: Record<string, string> = {};
      const locationCheckPromises: Promise<void>[] = [];
      
      for (const row of validRows) {
        if (row.length < 4) continue;
        
        const [, , blockNumber, apartmentNumber] = row;
        
        if (isApartmentOccupied(blockNumber, apartmentNumber)) {
          const locationKey = `${blockNumber}-${apartmentNumber}`;
          
          // Create a promise to get resident details
          const checkPromise = async () => {
            try {
              const existingResidentDetails = await getExistingResidentDetails(blockNumber, apartmentNumber);
              occupiedLocations[locationKey] = existingResidentDetails;
              
              const locationError = `Location already occupied: Block ${blockNumber}, Apartment ${apartmentNumber} occupied by ${existingResidentDetails}`;
              if (!importErrors.includes(locationError)) {
                importErrors.push(locationError);
              }
            } catch (error) {
              console.error("Error checking location occupancy:", error);
              const fallbackName = "another resident (connection error)";
              occupiedLocations[locationKey] = fallbackName;
              
              const locationError = `Location already occupied: Block ${blockNumber}, Apartment ${apartmentNumber} occupied by ${fallbackName}`;
              if (!importErrors.includes(locationError)) {
                importErrors.push(locationError);
              }
            }
          };
          
          locationCheckPromises.push(checkPromise());
        }
      }
      
      // Wait for all location checks to complete with timeout
      try {
        const timeoutPromise = new Promise<void>((_, reject) => {
          setTimeout(() => reject(new Error("Location checks timed out")), 15000);
        });
        
        await Promise.race([
          Promise.all(locationCheckPromises),
          timeoutPromise
        ]);
      } catch (error) {
        console.error("Error during location checks:", error);
        toast({
          title: "Warning",
          description: "Some location checks timed out. Results may be incomplete.",
          variant: "destructive"
        });
        
        // Add a general error to the import errors
        importErrors.push("Some location checks failed due to connection issues. Please try again or proceed with caution.");
      }
      
      return { importErrors, occupiedLocations };
    } catch (error) {
      console.error("Error detecting conflicts:", error);
      handleNetworkError(error, "Failed to check for conflicts");
      
      // Return default values so the import can continue with available data
      return { 
        importErrors: ["Failed to fully check for conflicts due to connection issues. Proceed with caution."], 
        occupiedLocations: {} 
      };
    } finally {
      setIsCheckingConflicts(false);
    }
  };

  return {
    detectAllConflicts,
    isCheckingConflicts
  };
};
