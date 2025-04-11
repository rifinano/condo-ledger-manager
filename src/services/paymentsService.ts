
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Payment {
  id: string;
  resident_id: string;
  amount: number;
  payment_date: string;
  payment_for_month: string;
  payment_for_year: string;
  payment_type: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  residentName?: string; // Added after join
  block?: string; // Added after join
  apartment?: string; // Added after join
}

export interface Resident {
  id: string;
  full_name: string;
  phone_number?: string;
  block_number: string;
  apartment_number: string;
  created_at: string;
  updated_at: string;
}

export const getPayments = async () => {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        residents:resident_id (
          id,
          full_name,
          block_number,
          apartment_number
        )
      `)
      .order('payment_date', { ascending: false });

    if (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error fetching payments",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    // Transform data to match the expected format
    return payments.map(payment => ({
      id: payment.id,
      resident_id: payment.resident_id,
      amount: payment.amount,
      payment_date: payment.payment_date,
      payment_for_month: payment.payment_for_month,
      payment_for_year: payment.payment_for_year,
      payment_type: payment.payment_type,
      payment_method: payment.payment_method,
      notes: payment.notes,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      residentName: payment.residents?.full_name || "Unknown",
      block: payment.residents?.block_number || "Unknown",
      apartment: payment.residents?.apartment_number || "Unknown"
    }));
  } catch (error) {
    console.error("Unexpected error fetching payments:", error);
    toast({
      title: "Unexpected error",
      description: "Failed to fetch payments. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

export const getResidents = async () => {
  try {
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .order('full_name');

    if (error) {
      console.error("Error fetching residents:", error);
      toast({
        title: "Error fetching residents",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching residents:", error);
    toast({
      title: "Unexpected error",
      description: "Failed to fetch residents. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

export const togglePaymentStatus = async (paymentId: string, status: boolean) => {
  try {
    if (status) {
      // Create a new payment
      const { error } = await supabase
        .from('payments')
        .update({ payment_status: 'paid' })
        .eq('id', paymentId);

      if (error) throw error;
      
      return { success: true };
    } else {
      // Mark as unpaid
      const { error } = await supabase
        .from('payments')
        .update({ payment_status: 'unpaid' })
        .eq('id', paymentId);

      if (error) throw error;
      
      return { success: true };
    }
  } catch (error: any) {
    console.error("Error toggling payment status:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update payment status" 
    };
  }
};

export const addPayment = async (payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error adding payment:", error);
    return { 
      success: false, 
      error: error.message || "Failed to add payment" 
    };
  }
};
