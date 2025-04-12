
import { supabase } from "@/integrations/supabase/client";

export const deleteCharge = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('charges')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting charge:", error);
      throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting charge:", error);
    return { 
      success: false, 
      error: error.message || "Failed to delete charge" 
    };
  }
};
