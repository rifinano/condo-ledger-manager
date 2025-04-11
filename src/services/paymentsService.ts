
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
  payment_status: "paid" | "unpaid"; // Added payment status
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
    // First, fetch all payments
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .order('payment_date', { ascending: false });

    if (paymentsError) {
      console.error("Error fetching payments:", paymentsError);
      toast({
        title: "Error fetching payments",
        description: paymentsError.message,
        variant: "destructive",
      });
      return [];
    }

    // Fetch all residents to join manually
    const { data: residents, error: residentsError } = await supabase
      .from('residents')
      .select('*');

    if (residentsError) {
      console.error("Error fetching residents:", residentsError);
      toast({
        title: "Error fetching residents for payment details",
        description: residentsError.message,
        variant: "destructive",
      });
      // Return payments without resident info if residents fetch fails
      return payments.map((payment: any) => ({
        ...payment,
        residentName: "Unknown",
        block: "Unknown",
        apartment: "Unknown",
        payment_status: payment.payment_status || "unpaid" // Ensure payment_status is defined
      }));
    }

    // Create a map of residents for faster lookups
    const residentsMap = new Map();
    residents.forEach((resident: any) => {
      residentsMap.set(resident.id, resident);
    });

    // Join the payments with residents data manually
    return payments.map((payment: any) => {
      const resident = residentsMap.get(payment.resident_id);
      return {
        ...payment,
        residentName: resident ? resident.full_name : "Unknown",
        block: resident ? resident.block_number : "Unknown",
        apartment: resident ? resident.apartment_number : "Unknown",
        payment_status: payment.payment_status || "unpaid" // Ensure payment_status is defined
      };
    });
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
    // Use the generic query approach since TypeScript definitions don't recognize our tables yet
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

export const togglePaymentStatus = async (paymentId: string, isPaid: boolean) => {
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

export const addPayment = async (payment: Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'payment_status'>) => {
  try {
    // Add payment_status field with default value "paid"
    const paymentWithStatus = {
      ...payment,
      payment_status: "paid" as const
    };
    
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentWithStatus])
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
