
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
    
    // Transform the data to include the category property
    const transformedData = data?.map(charge => ({
      ...charge,
      category: charge.category || "In" // Default to "In" if category is not set
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
