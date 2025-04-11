
import { supabase } from "@/integrations/supabase/client";
import { ResidentFormData, ServiceResult } from "./types";
import { Database } from "@/integrations/supabase/types";

/**
 * Updates an existing resident in the database
 */
export const updateResident = async (id: string, resident: Omit<ResidentFormData, 'id'>): Promise<ServiceResult> => {
  try {
    // Create a type-safe update object
    const residentUpdate: Database['public']['Tables']['residents']['Update'] = {
      full_name: resident.full_name,
      phone_number: resident.phone_number || null,
      block_number: resident.block_number,
      apartment_number: resident.apartment_number,
      updated_at: new Date().toISOString()
    };

    // Update the resident record
    const { data, error } = await supabase
      .from('residents')
      .update(residentUpdate)
      .eq('id', id as any)
      .select()
      .single();

    if (error) throw error;
    
    // Step 2: Update apartment association
    // First, check if there are existing apartment associations
    const { data: existingApartments } = await supabase
      .from('resident_apartments')
      .select('*')
      .eq('resident_id', id as any);
    
    // Delete existing apartment associations
    if (existingApartments && existingApartments.length > 0) {
      const { error: deleteError } = await supabase
        .from('resident_apartments')
        .delete()
        .eq('resident_id', id as any);
      
      if (deleteError) throw deleteError;
    }
    
    // Create properly typed apartment data
    const residentAptData: Database['public']['Tables']['resident_apartments']['Insert'] = {
      resident_id: id,
      block_number: resident.block_number,
      apartment_number: resident.apartment_number
    };
    
    // Create new apartment association
    const { error: insertError } = await supabase
      .from('resident_apartments')
      .insert(residentAptData);
    
    if (insertError) throw insertError;
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating resident:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update resident" 
    };
  }
};
