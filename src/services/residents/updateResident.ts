
import { supabase } from "@/integrations/supabase/client";
import { ResidentFormData, ServiceResult } from "./types";

/**
 * Updates an existing resident in the database
 */
export const updateResident = async (id: string, resident: Omit<ResidentFormData, 'id'>): Promise<ServiceResult> => {
  try {
    // Format the data for the API
    const formattedResident = {
      full_name: resident.full_name,
      phone_number: resident.phone_number || null,
      block_number: resident.block_number,
      apartment_number: resident.apartment_number,
    };

    const { data, error } = await supabase
      .from('residents')
      .update(formattedResident)
      .eq('id', id)
      .select();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating resident:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update resident" 
    };
  }
};
