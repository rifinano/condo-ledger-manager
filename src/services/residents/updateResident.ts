
import { supabase } from "@/integrations/supabase/client";
import { ResidentFormData, ServiceResult } from "./types";

/**
 * Updates an existing resident in the database
 */
export const updateResident = async (id: string, resident: Omit<ResidentFormData, 'id'>): Promise<ServiceResult> => {
  try {
    // Use the database function to ensure all operations happen in a single transaction
    const { data, error } = await supabase
      .rpc('update_resident_with_apartment', {
        p_resident_id: id,
        p_full_name: resident.full_name,
        p_phone_number: resident.phone_number || null,
        p_block_number: resident.block_number,
        p_apartment_number: resident.apartment_number
      });

    if (error) throw error;
    
    // The operation was successful, return the data
    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating resident:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update resident" 
    };
  }
};
