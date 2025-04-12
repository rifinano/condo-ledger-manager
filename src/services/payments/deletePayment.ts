
import { supabase } from "@/integrations/supabase/client";

export const deletePayment = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Deleting payment with ID:", id);
    
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase error deleting payment:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    console.log("Payment successfully deleted");
    return { success: true };
  } catch (error: any) {
    console.error("Exception when deleting payment:", error);
    return { 
      success: false, 
      error: error.message || "Failed to delete payment" 
    };
  }
};
