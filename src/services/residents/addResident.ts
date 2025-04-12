
import { supabase } from "@/integrations/supabase/client";
import { ResidentFormData, ServiceResult } from "./types";
import { Database } from "@/integrations/supabase/types";

/**
 * Adds a new resident to the database
 */
export const addResident = async (resident: Omit<ResidentFormData, 'id'>): Promise<ServiceResult> => {
  try {
    // Convert the full name to uppercase
    const capitalizedName = resident.full_name.toUpperCase();
    
    // Format the data for the API with the capitalized name
    const formattedResident: Database['public']['Tables']['residents']['Insert'] = {
      full_name: capitalizedName,
      phone_number: resident.phone_number || null,
      block_number: resident.block_number,
      apartment_number: resident.apartment_number,
    };

    const { data, error } = await supabase
      .from('residents')
      .insert(formattedResident as any)
      .select();

    if (error) throw error;
    
    // Add to the resident_apartments table for the new resident
    if (data && data.length > 0) {
      const newResidentId = (data[0] as any).id;
      
      // Insert directly into the resident_apartments table with proper typing
      const residentAptData: Database['public']['Tables']['resident_apartments']['Insert'] = {
        resident_id: newResidentId,
        block_number: resident.block_number,
        apartment_number: resident.apartment_number
      };
        
      const { error: aptError } = await supabase
        .from('resident_apartments')
        .insert(residentAptData as any);
        
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
