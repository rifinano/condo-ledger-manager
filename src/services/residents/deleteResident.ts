
import { supabase } from "@/integrations/supabase/client";
import { ServiceResult } from "./types";

/**
 * Deletes a resident from the database
 */
export const deleteResident = async (id: string): Promise<ServiceResult> => {
  try {
    // Delete the resident record without deleting apartment associations
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
    // Delete all resident records without deleting apartment associations
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
