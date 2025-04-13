
import { supabase } from "@/integrations/supabase/client";
import { ServiceResult } from "./types";

/**
 * Deletes a resident from the database
 */
export const deleteResident = async (id: string): Promise<ServiceResult> => {
  try {
    console.log("Deleting resident with ID:", id);
    
    // Delete the resident record
    const { error } = await supabase
      .from('residents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase error deleting resident:", error);
      throw error;
    }
    
    console.log("Resident deleted successfully");
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
    console.log("Deleting all residents");
    
    // Delete all resident records
    const { error } = await supabase
      .from('residents')
      .delete()
      .gt('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (error) {
      console.error("Supabase error deleting all residents:", error);
      throw error;
    }
    
    console.log("All residents deleted successfully");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting all residents:", error);
    return { 
      success: false, 
      error: error.message || "Failed to delete all residents" 
    };
  }
};
