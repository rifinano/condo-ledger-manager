
import { supabase } from "@/integrations/supabase/client";
import { ResidentFormData, ServiceResult } from "./types";

/**
 * Updates an existing resident in the database
 */
export const updateResident = async (id: string, resident: Omit<ResidentFormData, 'id'>): Promise<ServiceResult> => {
  try {
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
    
    // Step 2: Handle resident_apartments table
    if (data) {
      // First, get all existing apartments for this resident
      const { data: existingApartments, error: fetchError } = await supabase
        .from('resident_apartments')
        .select('*')
        .eq('resident_id', id);
        
      if (fetchError) throw fetchError;
      
      if (existingApartments && existingApartments.length > 0) {
        // Delete all existing apartment records for this resident
        const { error: deleteError } = await supabase
          .from('resident_apartments')
          .delete()
          .eq('resident_id', id);
        
        if (deleteError) throw deleteError;
      }
      
      // Create a new apartment record with the updated information
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
