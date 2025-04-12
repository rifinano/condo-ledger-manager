
import { supabase } from "@/integrations/supabase/client";

export const deleteCharge = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Deleting charge with ID from database:", id);
    
    const { error } = await supabase
      .from('charges')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase error deleting charge:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    console.log("Charge successfully deleted from Supabase");
    return { success: true };
  } catch (error: any) {
    console.error("Exception when deleting charge:", error);
    return { 
      success: false, 
      error: error.message || "Failed to delete charge" 
    };
  }
};
