
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Resident } from "./types";

export const getResidents = async (): Promise<Resident[]> => {
  try {
    // Implement robust fetching with retries
    const maxRetries = 3;
    let attempt = 0;
    let error = null;
    
    while (attempt < maxRetries) {
      try {
        // Use the generic query approach since TypeScript definitions don't recognize our tables yet
        const { data, error } = await supabase
          .from('residents')
          .select('*')
          .order('full_name');

        if (error) throw error;
        
        console.log("Successfully fetched residents:", data?.length || 0);
        // Type assertion to ensure compatibility
        return (data || []) as Resident[];
      } catch (err) {
        error = err;
        attempt++;
        console.log(`Resident fetch attempt ${attempt} failed, retrying...`);
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
        }
      }
    }
    
    // If we've exhausted all retries
    console.error("Error fetching residents after retries:", error);
    toast({
      title: "Error fetching residents",
      description: "Could not load resident data. Please try again later.",
      variant: "destructive",
    });
    return [];
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
