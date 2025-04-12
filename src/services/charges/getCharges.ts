
import { supabase } from "@/integrations/supabase/client";
import { Charge } from "./types";

export const getCharges = async (): Promise<Charge[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    console.log("Calling Supabase to get charges");
    const { data, error } = await supabase
      .from('charges')
      .select('*')
      .order('created_at', { ascending: false });

    clearTimeout(timeoutId);

    if (error) {
      console.error("Supabase error fetching charges:", error);
      throw new Error(error.message);
    }

    console.log("Successfully retrieved charges from Supabase:", data);
    
    // Transform the data to ensure the category is either "In" or "Out"
    const transformedData = data?.map(charge => ({
      ...charge,
      // Ensure category is one of the allowed values in the Charge interface
      category: (charge.category === "In" || charge.category === "Out") 
        ? charge.category as "In" | "Out" 
        : "In" // Default to "In" if the category is invalid
    })) || [];
    
    return transformedData;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error("Request timed out fetching charges");
      throw new Error("The server took too long to respond. Please try again.");
    } else {
      console.error("Unexpected error fetching charges:", error);
      throw new Error("Failed to fetch charges. Please try again.");
    }
  }
};
