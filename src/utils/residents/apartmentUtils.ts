
import { supabase } from '@/integrations/supabase/client';

/**
 * Function to check if a block exists in the database with retry logic
 */
export const doesBlockExist = async (blockName: string): Promise<boolean> => {
  const maxRetries = 3;
  let retryCount = 0;
  let lastError = null;
  
  while (retryCount < maxRetries) {
    try {
      const { data, error } = await supabase
        .from('blocks')
        .select('id')
        .eq('name', blockName)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      return !!data;
    } catch (error) {
      lastError = error;
      retryCount++;
      console.error(`Error checking block existence (attempt ${retryCount}/${maxRetries}):`, error);
      
      // Only wait before retrying if we're not on the last attempt
      if (retryCount < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
      }
    }
  }
  
  console.error("All retries failed when checking block existence:", lastError);
  // Return false after all retries to allow the process to continue with error handling
  return false;
};

/**
 * Function to check if an apartment exists in a block with retry logic
 */
export const doesApartmentExist = async (blockName: string, apartmentNumber: string): Promise<boolean> => {
  const maxRetries = 3;
  let retryCount = 0;
  let lastError = null;
  
  while (retryCount < maxRetries) {
    try {
      // First get the block ID
      const { data: block, error: blockError } = await supabase
        .from('blocks')
        .select('id')
        .eq('name', blockName)
        .maybeSingle();
      
      if (blockError || !block) {
        throw blockError || new Error(`Block ${blockName} not found`);
      }
      
      // Then check if apartment exists in this block
      const { data: apartment, error: apartmentError } = await supabase
        .from('apartments')
        .select('id')
        .eq('block_id', block.id.toString())
        .eq('number', apartmentNumber)
        .maybeSingle();
      
      if (apartmentError) {
        throw apartmentError;
      }
      
      return !!apartment;
    } catch (error) {
      lastError = error;
      retryCount++;
      console.error(`Error checking apartment existence (attempt ${retryCount}/${maxRetries}):`, error);
      
      // Only wait before retrying if we're not on the last attempt
      if (retryCount < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
      }
    }
  }
  
  console.error("All retries failed when checking apartment existence:", lastError);
  // Return false after all retries to allow the process to continue with error handling
  return false;
};

/**
 * Get all valid apartments in a block with improved error handling
 */
export const getBlockApartments = async (blockName: string): Promise<string[]> => {
  const maxRetries = 3;
  let retryCount = 0;
  let lastError = null;
  
  while (retryCount < maxRetries) {
    try {
      // First get the block ID
      const { data: block, error: blockError } = await supabase
        .from('blocks')
        .select('id')
        .eq('name', blockName)
        .maybeSingle();
      
      if (blockError || !block) {
        throw blockError || new Error(`Block ${blockName} not found`);
      }
      
      // Then get all apartments in this block
      const { data: apartments, error: apartmentsError } = await supabase
        .from('apartments')
        .select('number')
        .eq('block_id', block.id.toString());
      
      if (apartmentsError || !apartments) {
        throw apartmentsError || new Error("Failed to fetch apartments");
      }
      
      return apartments.map(apt => apt.number);
    } catch (error) {
      lastError = error;
      retryCount++;
      console.error(`Error getting block apartments (attempt ${retryCount}/${maxRetries}):`, error);
      
      // Only wait before retrying if we're not on the last attempt
      if (retryCount < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
      }
    }
  }
  
  console.error("All retries failed when getting block apartments:", lastError);
  // Return empty array after all retries to allow the process to continue with error handling
  return [];
};

/**
 * Check if there are any available apartments in a block
 */
export const hasAvailableApartments = async (blockName: string): Promise<boolean> => {
  try {
    const apartments = await getBlockApartments(blockName);
    return apartments.length > 0;
  } catch (error) {
    console.error("Error checking available apartments:", error);
    return false;
  }
};

/**
 * Get list of missing apartments to create
 */
export const getMissingApartments = async (
  blockName: string, 
  requestedApartmentNumbers: string[]
): Promise<string[]> => {
  try {
    const existingApartments = await getBlockApartments(blockName);
    return requestedApartmentNumbers.filter(apt => !existingApartments.includes(apt));
  } catch (error) {
    console.error("Error getting missing apartments:", error);
    return requestedApartmentNumbers;
  }
};
