
import { supabase } from "@/integrations/supabase/client";
import { ResidentFormData, ServiceResult } from "./types";

/**
 * Adds a new resident to the database
 */
export const addResident = async (resident: ResidentFormData): Promise<ServiceResult> => {
  try {
    // Check if this apartment is already occupied
    const { data: existingResident, error: checkError } = await supabase
      .from('residents')
      .select('id, full_name')
      .eq('block_number', resident.block_number)
      .eq('apartment_number', resident.apartment_number)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking existing resident:", checkError);
      throw new Error(`Database error: ${checkError.message}`);
    }
    
    if (existingResident) {
      return { 
        success: false, 
        error: `Apartment ${resident.apartment_number} in ${resident.block_number} is already occupied by ${existingResident.full_name}.` 
      };
    }
    
    // Insert new resident record
    const { data, error } = await supabase
      .from('residents')
      .insert({
        full_name: resident.full_name,
        phone_number: resident.phone_number || null,
        block_number: resident.block_number,
        apartment_number: resident.apartment_number,
        move_in_month: resident.move_in_month,
        move_in_year: resident.move_in_year,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as any)
      .select()
      .single();

    if (error) {
      console.error("Error inserting resident:", error);
      throw error;
    }
    
    // Insert apartment association
    const { error: aptError } = await supabase
      .from('resident_apartments')
      .insert({
        resident_id: data.id,
        block_number: resident.block_number,
        apartment_number: resident.apartment_number,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as any);
    
    if (aptError) {
      console.error("Error inserting resident apartment:", aptError);
      // If apartment association fails, clean up the resident record
      await supabase.from('residents').delete().eq('id', data.id);
      throw aptError;
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
