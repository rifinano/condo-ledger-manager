
import { supabase } from '@/integrations/supabase/client';
import { useNetworkErrorHandler } from '@/hooks/useNetworkErrorHandler';

/**
 * Function to check if a location is already occupied by a resident
 */
export const getExistingResidentDetails = async (blockNumber: string, apartmentNumber: string): Promise<string> => {
  let retryCount = 0;
  const maxRetries = 3;
  
  while (retryCount < maxRetries) {
    try {
      const { data, error } = await supabase
        .from('residents')
        .select('full_name')
        .eq('block_number', blockNumber)
        .eq('apartment_number', apartmentNumber)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      return data?.full_name || "another resident";
    } catch (error) {
      retryCount++;
      console.error(`Error fetching existing resident (attempt ${retryCount}/${maxRetries}):`, error);
      
      // If we've reached max retries, return a fallback value
      if (retryCount >= maxRetries) {
        console.warn("Max retries reached when fetching resident details");
        return "another resident (connection error)";
      }
      
      // Wait with exponential backoff before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
    }
  }
  
  // This is a fallback in case the loop exits unexpectedly
  return "another resident";
};

/**
 * Check for conflicts in a batch of imported residents
 */
export const detectImportConflicts = (values: string[][]): string[] => {
  const importErrors: string[] = [];
  const importBatchLocations = new Map<string, string>();
  
  for (const row of values) {
    if (row.length < 4) continue;
    
    const [fullName, , blockNumber, apartmentNumber] = row;
    if (!blockNumber || !apartmentNumber) continue;
    
    const locationKey = `${blockNumber}-${apartmentNumber}`;
    
    if (importBatchLocations.has(locationKey)) {
      const existingName = importBatchLocations.get(locationKey);
      if (existingName !== fullName) {
        const conflictError = `Conflict in import: Both "${existingName}" and "${fullName}" are being assigned to Block ${blockNumber}, Apartment ${apartmentNumber}`;
        if (!importErrors.includes(conflictError)) {
          importErrors.push(conflictError);
        }
      }
    } else {
      importBatchLocations.set(locationKey, fullName);
    }
  }
  
  return importErrors;
};
