
import { supabase } from "@/integrations/supabase/client";
import { ResidentFormData, ServiceResult } from "./types";

/**
 * Updates an existing resident in the database
 */
export const updateResident = async (id: string, resident: Omit<ResidentFormData, 'id'>): Promise<ServiceResult> => {
  try {
    // Instead of using the RPC function, we'll update the resident directly and handle the apartment update separately
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
    
    // If the resident was updated successfully, update or create the resident_apartment record
    if (data) {
      // First check if there's an existing entry for this resident that needs to be updated
      const { data: existingApartments, error: fetchError } = await supabase
        .from('resident_apartments')
        .select('*')
        .eq('resident_id', id);
        
      if (fetchError) throw fetchError;
      
      if (existingApartments && existingApartments.length > 0) {
        // Update existing apartment record
        const { error: updateError } = await supabase
          .from('resident_apartments')
          .update({
            block_number: resident.block_number,
            apartment_number: resident.apartment_number,
            updated_at: new Date().toISOString()
          })
          .eq('resident_id', id);
        
        if (updateError) throw updateError;
      } else {
        // Create new apartment record
        const { error: insertError } = await supabase
          .from('resident_apartments')
          .insert({
            resident_id: id,
            block_number: resident.block_number,
            apartment_number: resident.apartment_number
          });
        
        if (insertError) throw insertError;
      }
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
