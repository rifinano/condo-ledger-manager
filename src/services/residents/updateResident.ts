
import { supabase } from "@/integrations/supabase/client";
import { ResidentFormData, ServiceResult } from "./types";

/**
 * Updates an existing resident in the database
 */
export const updateResident = async (id: string, resident: Omit<ResidentFormData, 'id'>): Promise<ServiceResult> => {
  try {
    // Begin by getting the current resident data to compare with new data
    const { data: existingResident, error: fetchError } = await supabase
      .from('residents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Step 1: Update the resident record
    const { data, error } = await supabase
      .from('residents')
      .update({
        full_name: resident.full_name,
        phone_number: resident.phone_number || null,
        block_number: resident.block_number,
        apartment_number: resident.apartment_number,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Step 2: Handle apartment association in resident_apartments table
    // Check if the apartment has changed
    if (existingResident && 
        (existingResident.block_number !== resident.block_number || 
         existingResident.apartment_number !== resident.apartment_number)) {
      
      // Delete any existing resident_apartments records for this resident
      const { error: deleteError } = await supabase
        .from('resident_apartments')
        .delete()
        .eq('resident_id', id);
      
      if (deleteError) throw deleteError;
      
      // Add the new apartment association
      const { error: insertError } = await supabase
        .from('resident_apartments')
        .insert({
          resident_id: id,
          block_number: resident.block_number,
          apartment_number: resident.apartment_number
        });
      
      if (insertError) throw insertError;
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating resident:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update resident" 
    };
  }
};
