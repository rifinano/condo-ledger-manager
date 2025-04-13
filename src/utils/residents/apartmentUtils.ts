
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a block exists in the database
 */
export const doesBlockExist = async (blockNumber: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('blocks')
      .select('id')
      .eq('name', blockNumber)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking if block exists:", error);
    return false;
  }
};

/**
 * Check if an apartment exists in a block
 */
export const doesApartmentExist = async (blockName: string, apartmentNumber: string): Promise<boolean> => {
  try {
    // First get the block ID
    const { data: block, error: blockError } = await supabase
      .from('blocks')
      .select('id')
      .eq('name', blockName)
      .maybeSingle();
    
    if (blockError || !block) return false;
    
    // Now check if the apartment exists in this block
    const { data, error } = await supabase
      .from('apartments')
      .select('id')
      .eq('block_id', block.id)
      .eq('number', apartmentNumber)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking if apartment exists:", error);
    return false;
  }
};

/**
 * Get the block ID from a block name
 */
export const getBlockId = async (blockName: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('blocks')
      .select('id')
      .eq('name', blockName)
      .maybeSingle();
    
    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error("Error getting block ID:", error);
    return null;
  }
};

/**
 * Get all apartments in a block
 */
export const getBlockApartments = async (blockName: string): Promise<string[]> => {
  try {
    // First get the block ID
    const blockId = await getBlockId(blockName);
    if (!blockId) return [];
    
    // Get all apartments in this block
    const { data, error } = await supabase
      .from('apartments')
      .select('number')
      .eq('block_id', blockId)
      .order('number');
      
    if (error) throw error;
    return (data || []).map(apt => apt.number);
  } catch (error) {
    console.error("Error getting block apartments:", error);
    return [];
  }
};

/**
 * Check if a block has available apartments
 */
export const hasAvailableApartments = async (blockName: string): Promise<boolean> => {
  try {
    const apartments = await getBlockApartments(blockName);
    return apartments.length > 0;
  } catch (error) {
    console.error("Error checking if block has available apartments:", error);
    return false;
  }
};

/**
 * Get missing apartments for a block
 */
export const getMissingApartments = async (blockName: string, requiredApartments: string[]): Promise<string[]> => {
  try {
    const existingApartments = await getBlockApartments(blockName);
    return requiredApartments.filter(apt => !existingApartments.includes(apt));
  } catch (error) {
    console.error("Error getting missing apartments:", error);
    return requiredApartments;
  }
};
