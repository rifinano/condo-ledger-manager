
import { supabase } from '@/integrations/supabase/client';

/**
 * Function to check if a location is already occupied by a resident
 */
export const getExistingResidentDetails = async (blockNumber: string, apartmentNumber: string): Promise<string> => {
  try {
    const { data } = await supabase
      .from('residents')
      .select('full_name')
      .eq('block_number', blockNumber)
      .eq('apartment_number', apartmentNumber)
      .maybeSingle();
    
    return data?.full_name || "another resident";
  } catch (error) {
    console.error("Error fetching existing resident:", error);
    return "another resident";
  }
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
