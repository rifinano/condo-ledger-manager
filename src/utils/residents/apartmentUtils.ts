
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
