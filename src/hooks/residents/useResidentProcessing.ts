
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ResidentFormData } from '@/services/residents/types';
import { useNetworkErrorHandler } from '@/hooks/useNetworkErrorHandler';

interface UseResidentProcessingProps {
  resetForm: () => void;
  setCurrentResident: (resident: Partial<ResidentFormData>) => void;
  handleAddResident: () => Promise<boolean>;
  fetchResidents: () => Promise<void>;
  refreshData: () => Promise<void>;
  months: { value: string; label: string }[];
}

export const useResidentProcessing = ({
  resetForm,
  setCurrentResident,
  handleAddResident,
  fetchResidents,
  refreshData,
  months
}: UseResidentProcessingProps) => {
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(0);
  const { toast } = useToast();
  const { handleNetworkError } = useNetworkErrorHandler();

  const processImportedResidents = async (
    values: string[][], 
    occupiedLocations: Record<string, string>
  ): Promise<number> => {
    let successCount = 0;
    let failureCount = 0;
    const processingErrors: string[] = [];
    const maxConcurrent = 3; // Process up to 3 residents at a time
    
    // Process residents in batches to avoid overwhelming the server
    for (let i = 0; i < values.length; i += maxConcurrent) {
      const batch = values.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(async (row) => {
        try {
          if (row.length < 4) {
            return {
              success: false,
              error: `Invalid row format: ${row.join(', ')}. Not enough columns.`
            };
          }
          
          const [fullName, , blockNumber, apartmentNumber] = row;
          
          if (!fullName || !blockNumber || !apartmentNumber) {
            return {
              success: false,
              error: `Missing required data for: ${fullName || 'Unknown'} at Block ${blockNumber || 'Unknown'}, Apartment ${apartmentNumber || 'Unknown'}`
            };
          }

          // Skip if this location is already marked as occupied
          const locationKey = `${blockNumber}-${apartmentNumber}`;
          if (locationKey in occupiedLocations) {
            return {
              success: false,
              error: `Failed to add resident: ${fullName} at Block ${blockNumber}, Apartment ${apartmentNumber} - Location already occupied by ${occupiedLocations[locationKey]}`
            };
          }
          
          // Verify that the block exists with retry logic
          if (!(await doesBlockExist(blockNumber))) {
            return {
              success: false,
              error: `Failed to add resident: ${fullName} - Block "${blockNumber}" does not exist`
            };
          }
          
          // Verify that the apartment exists in the block with retry logic
          if (!(await doesApartmentExist(blockNumber, apartmentNumber))) {
            return {
              success: false,
              error: `Failed to add resident: ${fullName} - Apartment ${apartmentNumber} does not exist in Block ${blockNumber}`
            };
          }
          
          const residentData = prepareResidentData(row, months);
          
          let addSuccess = false;
          let addAttempt = 0;
          const maxAddAttempts = 3;
          
          while (addAttempt < maxAddAttempts && !addSuccess) {
            try {
              resetForm();
              setCurrentResident(residentData);
              addSuccess = await handleAddResident();
              
              if (addSuccess) {
                occupiedLocations[locationKey] = fullName;
                return { success: true };
              } else {
                // If handleAddResident returns false but doesn't throw, retry
                addAttempt++;
                if (addAttempt < maxAddAttempts) {
                  await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, addAttempt - 1)));
                }
              }
            } catch (error) {
              console.error(`Error adding resident (attempt ${addAttempt + 1}/${maxAddAttempts}):`, error);
              addAttempt++;
              if (addAttempt < maxAddAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, addAttempt - 1)));
              } else {
                return {
                  success: false,
                  error: `Failed to add resident: ${fullName} - ${error instanceof Error ? error.message : String(error)}`
                };
              }
            }
          }
          
          return {
            success: false,
            error: `Failed to add resident: ${fullName} at Block ${blockNumber}, Apartment ${apartmentNumber} after ${maxAddAttempts} attempts`
          };
        } catch (error) {
          console.error("Error processing row:", row, error);
          const errorMsg = error instanceof Error ? error.message : String(error);
          return {
            success: false,
            error: `Error processing resident: ${row[0] || 'Unknown'} - ${errorMsg}`
          };
        }
      });
      
      // Process the batch
      const results = await Promise.all(batchPromises);
      
      // Count successes and failures
      for (const result of results) {
        if (result.success) {
          successCount++;
        } else {
          failureCount++;
          if (result.error) {
            processingErrors.push(result.error);
          }
        }
      }
      
      // If we have more batches to process, add a small delay to avoid overwhelming the server
      if (i + maxConcurrent < values.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Add any processing errors to the import errors
    setImportErrors(prev => [...prev, ...processingErrors]);
    
    if (successCount > 0) {
      try {
        await fetchResidents();
        await refreshData();
      } catch (error) {
        console.error("Error refreshing data after import:", error);
        handleNetworkError(error, "Error refreshing data after import");
      }
      
      toast({
        title: "Import Summary",
        description: `Successfully imported ${successCount} resident${successCount !== 1 ? 's' : ''}. ${failureCount > 0 ? `Failed to import ${failureCount} resident(s).` : ''}`,
        variant: failureCount > 0 ? "destructive" : "default"
      });
    } else if (processingErrors.length > 0) {
      toast({
        title: "Import Failed",
        description: `Failed to import residents. Please check the error details.`,
        variant: "destructive"
      });
    }
    
    return successCount;
  };

  const onImportStart = () => {
    setImportErrors([]);
    setImportSuccess(0);
  };

  return {
    importErrors,
    setImportErrors,
    importSuccess,
    setImportSuccess,
    processImportedResidents,
    onImportStart
  };
};

// Import these utility functions from the modular utils files
import { 
  prepareResidentData 
} from '@/utils/residents/dateUtils';

import {
  doesBlockExist, 
  doesApartmentExist 
} from '@/utils/residents/apartmentUtils';
