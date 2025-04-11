
import { supabase } from "@/integrations/supabase/client";
import { ResidentFormData, ServiceResult } from "./types";

/**
 * Updates an existing resident in the database by deleting the old record and creating a new one
 */
export const updateResident = async (id: string, resident: Omit<ResidentFormData, 'id'>): Promise<ServiceResult> => {
  try {
    // Begin by getting the current resident data for reference
    const { data: existingResident, error: fetchError } = await supabase
      .from('residents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;

    // Start a transaction by deleting the existing resident
    // First, delete any associated records in resident_apartments table
    const { error: deleteApartmentError } = await supabase
      .from('resident_apartments')
      .delete()
      .eq('resident_id', id);
      
    if (deleteApartmentError) throw deleteApartmentError;
    
    // Then delete the resident record itself
    const { error: deleteResidentError } = await supabase
      .from('residents')
      .delete()
      .eq('id', id);
    
    if (deleteResidentError) throw deleteResidentError;
    
    // Now insert the new resident data with the same ID
    const { data: newResident, error: insertError } = await supabase
      .from('residents')
      .insert({
        id: id, // Keep the same ID for continuity
        full_name: resident.full_name,
        phone_number: resident.phone_number || null,
        block_number: resident.block_number,
        apartment_number: resident.apartment_number,
        created_at: existingResident.created_at, // Preserve original creation date
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (insertError) throw insertError;
    
    // Add the new apartment association
    const { error: insertApartmentError } = await supabase
      .from('resident_apartments')
      .insert({
        resident_id: id,
        block_number: resident.block_number,
        apartment_number: resident.apartment_number
      });
    
    if (insertApartmentError) throw insertApartmentError;
    
    return { success: true, data: newResident };
  } catch (error: any) {
    console.error("Error updating resident:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update resident" 
    };
  }
};
