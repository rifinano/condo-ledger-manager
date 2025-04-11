
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Payment } from "./types";

export const getPayments = async (): Promise<Payment[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    // Use a single query with join to reduce network requests
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        residents:resident_id (
          full_name,
          block_number,
          apartment_number
        )
      `)
      .order('payment_date', { ascending: false });

    clearTimeout(timeoutId);

    if (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error fetching payments",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    // Transform the joined data into the expected format
    // Using type assertion to avoid TypeScript errors with complex joins
    return (data || []).map((item: any) => ({
      id: item.id,
      resident_id: item.resident_id,
      amount: item.amount,
      payment_date: item.payment_date,
      payment_for_month: item.payment_for_month,
      payment_for_year: item.payment_for_year,
      payment_type: item.payment_type,
      payment_method: item.payment_method,
      payment_status: item.payment_status || "unpaid",
      notes: item.notes,
      created_at: item.created_at,
      updated_at: item.updated_at,
      created_by: item.created_by,
      residentName: item.residents ? item.residents.full_name : "Unknown",
      block: item.residents ? item.residents.block_number : "Unknown",
      apartment: item.residents ? item.residents.apartment_number : "Unknown"
    }));
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error("Request timed out fetching payments");
      toast({
        title: "Request timed out",
        description: "The server took too long to respond. Please try again.",
        variant: "destructive",
      });
    } else {
      console.error("Unexpected error fetching payments:", error);
      toast({
        title: "Unexpected error",
        description: "Failed to fetch payments. Please try again.",
        variant: "destructive",
      });
    }
    return [];
  }
};
