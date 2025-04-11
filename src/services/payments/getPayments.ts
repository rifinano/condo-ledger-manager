
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
      .order('payment_date', { ascending: false })
      .abortSignal(controller.signal);

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
    return data.map((item: any) => ({
      ...item,
      residentName: item.residents ? item.residents.full_name : "Unknown",
      block: item.residents ? item.residents.block_number : "Unknown",
      apartment: item.residents ? item.residents.apartment_number : "Unknown",
      payment_status: item.payment_status || "unpaid" // Ensure payment_status is defined
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
