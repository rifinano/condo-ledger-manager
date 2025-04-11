
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
