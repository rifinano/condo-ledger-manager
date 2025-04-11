
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Payment } from "./types";

export const getPayments = async (): Promise<Payment[]> => {
  try {
    // First, fetch all payments with proper error handling
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
