
import { supabase } from "@/integrations/supabase/client";
import { TogglePaymentStatusResult } from "./types";

export const togglePaymentStatus = async (
  paymentId: string, 
  isPaid: boolean
): Promise<TogglePaymentStatusResult> => {
  try {
    const newStatus = isPaid ? "paid" : "unpaid";
    
    // Update the payment status in the database
    const { error } = await supabase
      .from('payments')
      .update({ payment_status: newStatus })
      .eq('id', paymentId);

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
