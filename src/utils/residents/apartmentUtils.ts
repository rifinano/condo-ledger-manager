
import { supabase } from '@/integrations/supabase/client';

/**
 * Function to check if a block exists in the database
 */
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

/**
 * Function to check if an apartment exists in a block
 */
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
      .eq('block_id', block.id.toString())
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

/**
 * Get all valid apartments in a block
 */
export const getBlockApartments = async (blockName: string): Promise<string[]> => {
  try {
    // First get the block ID
    const { data: block, error: blockError } = await supabase
      .from('blocks')
      .select('id')
      .eq('name', blockName)
      .maybeSingle();
    
    if (blockError || !block) {
      console.error("Error finding block:", blockError);
      return [];
    }
    
    // Then get all apartments in this block
    const { data: apartments, error: apartmentsError } = await supabase
      .from('apartments')
      .select('number')
      .eq('block_id', block.id.toString());
    
    if (apartmentsError || !apartments) {
      console.error("Error fetching apartments:", apartmentsError);
      return [];
    }
    
    return apartments.map(apt => apt.number);
  } catch (error) {
    console.error("Error getting block apartments:", error);
    return [];
  }
};

/**
 * Check if there are any available apartments in a block
 */
export const hasAvailableApartments = async (blockName: string): Promise<boolean> => {
  const apartments = await getBlockApartments(blockName);
  return apartments.length > 0;
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
