
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UpdatePaymentData {
  id: string;
  amount: number;
  payment_date: string;
  payment_for_month: string;
  payment_for_year: string;
  payment_type: string;
  payment_method: string;
  notes: string | null;
}

interface UpdatePaymentResult {
  success: boolean;
  error?: string;
}

export const updatePayment = async (paymentData: UpdatePaymentData): Promise<UpdatePaymentResult> => {
  try {
    // Update the payment in the database
    const { error } = await supabase
      .from('payments')
      .update({
        amount: paymentData.amount,
        payment_date: paymentData.payment_date,
        payment_for_month: paymentData.payment_for_month,
        payment_for_year: paymentData.payment_for_year,
        payment_type: paymentData.payment_type,
        payment_method: paymentData.payment_method,
        notes: paymentData.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentData.id);

    if (error) {
      console.error("Error updating payment:", error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true
    };
  } catch (error: any) {
    console.error("Unexpected error updating payment:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating the payment"
    };
  }
};
