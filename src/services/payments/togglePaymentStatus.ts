
import { supabase } from "@/integrations/supabase/client";
import { TogglePaymentStatusResult } from "./types";
import { Database } from "@/integrations/supabase/types";

export const togglePaymentStatus = async (
  paymentId: string, 
  isPaid: boolean
): Promise<TogglePaymentStatusResult> => {
  try {
    const newStatus = isPaid ? "paid" : "unpaid";
    
    // Create an update object with the proper type
    const updateData: Database['public']['Tables']['payments']['Update'] = {
      payment_status: newStatus
    };
    
    // Update the payment status in the database
    const { error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', paymentId as any);

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling payment status:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update payment status" 
    };
  }
};
