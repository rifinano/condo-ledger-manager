
import { supabase } from "@/integrations/supabase/client";
import { ServiceResult } from "./types";

/**
 * Deletes a resident from the database
 */
export const deleteResident = async (id: string): Promise<ServiceResult> => {
  try {
    // First delete any associated apartment records
    const { error: apartmentError } = await supabase
      .from('resident_apartments')
      .delete()
      .eq('resident_id', id);
    
    if (apartmentError) throw apartmentError;
    
    // Then delete the resident record
    const { error } = await supabase
      .from('residents')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting resident:", error);
    return { 
      success: false, 
      error: error.message || "Failed to delete resident" 
    };
  }
};

/**
 * Deletes all residents from the database
 */
export const deleteAllResidents = async (): Promise<ServiceResult> => {
  try {
    // First delete all resident apartment associations
    const { error: apartmentError } = await supabase
      .from('resident_apartments')
      .delete()
      .neq('resident_id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (apartmentError) throw apartmentError;
    
    // Then delete all resident records
    const { error } = await supabase
      .from('residents')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting all residents:", error);
    return { 
      success: false, 
      error: error.message || "Failed to delete all residents" 
    };
  }
};
