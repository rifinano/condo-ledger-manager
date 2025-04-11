
import { supabase } from "@/integrations/supabase/client";
import { ServiceResult } from "./types";
import { Database } from "@/integrations/supabase/types";

/**
 * Adds an apartment assignment to a resident
 */
export const addResidentApartment = async (
  residentId: string, 
  blockNumber: string, 
  apartmentNumber: string
): Promise<ServiceResult> => {
  try {
    // Create properly typed apartment data
    const residentAptData: Database['public']['Tables']['resident_apartments']['Insert'] = {
      resident_id: residentId,
      block_number: blockNumber,
      apartment_number: apartmentNumber
    };
    
    // Insert directly into the resident_apartments table
    const { data, error } = await supabase
      .from('resident_apartments')
      .insert(residentAptData);
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error adding resident apartment:", error);
    return {
      success: false,
      error: error.message || "Failed to add apartment for resident"
    };
  }
};

/**
 * Removes an apartment assignment from a resident
 */
export const removeResidentApartment = async (
  residentId: string, 
  blockNumber: string, 
  apartmentNumber: string
): Promise<ServiceResult> => {
  try {
    // Delete directly from the resident_apartments table
    const { error } = await supabase
      .from('resident_apartments')
      .delete()
      .match({
        resident_id: residentId as any,
        block_number: blockNumber as any,
        apartment_number: apartmentNumber as any
      });
      
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error removing resident apartment:", error);
    return {
      success: false,
      error: error.message || "Failed to remove apartment from resident"
    };
  }
};
