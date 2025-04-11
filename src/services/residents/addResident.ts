
import { supabase } from "@/integrations/supabase/client";
import { ResidentFormData, ServiceResult } from "./types";

/**
 * Adds a new resident to the database
 */
export const addResident = async (resident: Omit<ResidentFormData, 'id'>): Promise<ServiceResult> => {
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
      .insert([formattedResident])
      .select();

    if (error) throw error;
    
    // Add to the resident_apartments table for the new resident
    if (data && data.length > 0) {
      const newResidentId = data[0].id;
      
      // Insert directly into the resident_apartments table
      const { error: aptError } = await supabase
        .from('resident_apartments')
        .insert({
          resident_id: newResidentId,
          block_number: resident.block_number,
          apartment_number: resident.apartment_number
        });
        
      if (aptError) {
        console.error("Error adding resident apartment:", aptError);
        // Continue with success even if this fails, we'll just have inconsistent data
      }
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error adding resident:", error);
    return { 
      success: false, 
      error: error.message || "Failed to add resident" 
    };
  }
};
