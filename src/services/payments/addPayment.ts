
import { supabase } from "@/integrations/supabase/client";
import { AddPaymentResult } from "./types";

export const addPayment = async (
  payment: Omit<any, 'id' | 'created_at' | 'updated_at' | 'payment_status'>
): Promise<AddPaymentResult> => {
  try {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Authentication error:", userError);
      throw new Error("You must be logged in to add a payment");
    }
    
    if (!user) {
      console.error("No authenticated user found");
      throw new Error("You must be logged in to add a payment");
    }
    
    // Verify resident exists before adding payment
    const { data: resident, error: residentError } = await supabase
      .from('residents')
      .select('id, full_name')
      .eq('id', payment.resident_id)
      .single();
      
    if (residentError || !resident) {
      console.error("Resident verification error:", residentError);
      throw new Error("Selected resident does not exist or could not be verified");
    }
    
    // Add payment_status field with default value "paid" and include created_by field
    const paymentWithStatus = {
      ...payment,
      payment_status: "paid" as const,
      created_by: user.id // Use the authenticated user ID
    };
    
    console.log("Adding payment with data:", paymentWithStatus);
    
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentWithStatus)
      .select();

    if (error) {
      console.error("Error adding payment:", error);
      throw error;
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error adding payment:", error);
    return { 
      success: false, 
      error: error.message || "Failed to add payment" 
    };
  }
};
