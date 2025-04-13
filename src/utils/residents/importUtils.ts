
import { ResidentFormData } from '@/services/residents/types';
import { supabase } from '@/integrations/supabase/client';

// Function to check if a location is already occupied by a resident
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

// Function to check if a block exists in the database
export const doesBlockExist = async (blockName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('blocks')
      .select('id')
      .eq('name', blockName)
      .maybeSingle();
    
    if (error) {
      console.error("Error checking block existence:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking block existence:", error);
    return false;
  }
};

// Function to check if an apartment exists in a block
export const doesApartmentExist = async (blockName: string, apartmentNumber: string): Promise<boolean> => {
  try {
    // First get the block ID
    const { data: block, error: blockError } = await supabase
      .from('blocks')
      .select('id')
      .eq('name', blockName)
      .maybeSingle();
    
    if (blockError || !block) {
      console.error("Error finding block:", blockError);
      return false;
    }
    
    // Then check if apartment exists in this block
    const { data: apartment, error: apartmentError } = await supabase
      .from('apartments')
      .select('id')
      .eq('block_id', block.id)
      .eq('number', apartmentNumber)
      .maybeSingle();
    
    if (apartmentError) {
      console.error("Error checking apartment existence:", apartmentError);
      return false;
    }
    
    return !!apartment;
  } catch (error) {
    console.error("Error checking apartment existence:", error);
    return false;
  }
};

// Function to parse month names, numbers, or abbreviations into standard format
export const parseMonth = (moveInMonthName: string | undefined, months: { value: string; label: string }[]): string => {
  if (!moveInMonthName) {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
  }
  
  // Try to match by label first (full month name)
  const monthByLabel = months.find(m => 
    m.label.toLowerCase() === moveInMonthName.toLowerCase())?.value;
  if (monthByLabel) return monthByLabel;
  
  // Then try to match by value (already formatted)
  const monthByValue = months.find(m => m.value === moveInMonthName)?.value;
  if (monthByValue) return monthByValue;
  
  // Then try to match by common abbreviations
  const monthAbbreviations: Record<string, string> = {
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 
    'may': '05', 'jun': '06', 'jul': '07', 'aug': '08', 
    'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
  };
  
  const abbr = moveInMonthName.toLowerCase().substring(0, 3);
  if (abbr in monthAbbreviations) {
    return monthAbbreviations[abbr];
  }
  
  // Try to parse as a number
  if (!isNaN(parseInt(moveInMonthName))) {
    const monthNum = parseInt(moveInMonthName);
    if (monthNum >= 1 && monthNum <= 12) {
      return monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
    }
  }
  
  // Default to current month if no match
  const currentMonth = new Date().getMonth() + 1;
  return currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
};

// Check for conflicts in a batch of imported residents
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

// Prepare resident data from CSV row
export const prepareResidentData = (
  row: string[], 
  months: { value: string; label: string }[]
): Partial<ResidentFormData> => {
  const [fullName, phoneNumber, blockNumber, apartmentNumber, moveInMonthName, moveInYear] = row;
  
  const moveInMonth = parseMonth(moveInMonthName, months);
  const currentYear = new Date().getFullYear().toString();
  
  return {
    full_name: fullName,
    phone_number: phoneNumber || '',
    block_number: blockNumber,
    apartment_number: apartmentNumber,
    move_in_month: moveInMonth,
    move_in_year: moveInYear || currentYear
  };
};
