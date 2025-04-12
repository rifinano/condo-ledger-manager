
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Charge } from "./types";

export const getCharges = async (): Promise<Charge[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    const { data, error } = await supabase
      .from('charges')
      .select('*')
      .order('created_at', { ascending: false });

    clearTimeout(timeoutId);

    if (error) {
      console.error("Error fetching charges:", error);
      toast({
        title: "Error fetching charges",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    return data || [];
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error("Request timed out fetching charges");
      toast({
        title: "Request timed out",
        description: "The server took too long to respond. Please try again.",
        variant: "destructive",
      });
    } else {
      console.error("Unexpected error fetching charges:", error);
      toast({
        title: "Unexpected error",
        description: "Failed to fetch charges. Please try again.",
        variant: "destructive",
      });
    }
    return [];
  }
};
