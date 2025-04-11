
import { supabase } from "@/integrations/supabase/client";
import { AddPaymentResult, PaymentFormData } from "./types";
import { Database } from "@/integrations/supabase/types";

export const addPayment = async (
  payment: PaymentFormData
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
    
    // Verify resident exists before adding payment - use simple count query for efficiency
    const { count, error: countError } = await supabase
      .from('residents')
      .select('id', { count: 'exact', head: true })
      .eq('id', payment.resident_id as any);
      
    if (countError || count === 0) {
      console.error("Resident verification error:", countError);
      throw new Error("Selected resident does not exist or could not be verified");
    }
    
    // Create a complete payment object with all required fields
    const paymentRecord: Database['public']['Tables']['payments']['Insert'] = {
      resident_id: payment.resident_id,
      amount: payment.amount,
      payment_date: payment.payment_date,
      payment_for_month: payment.payment_for_month,
      payment_for_year: payment.payment_for_year,
      payment_type: payment.payment_type,
      payment_method: payment.payment_method,
      notes: payment.notes,
      payment_status: "paid",
      created_by: user.id
    };
    
    console.log("Adding payment with data:", paymentRecord);
    
    // Insert the complete payment object into the database
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentRecord)
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
