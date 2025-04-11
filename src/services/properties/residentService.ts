
import { supabase } from "@/integrations/supabase/client";
import { cache, isCacheValid } from "./cacheUtils";

export const getResidentByApartment = async (blockName: string, apartmentNumber: string) => {
  const cacheKey = `${blockName}-${apartmentNumber}`;
  const now = Date.now();
  
  // Check if cached data exists and is still valid
  if (
    cache.residents[cacheKey] && 
    cache.lastFetch.residents[cacheKey] && 
    isCacheValid(cache.lastFetch.residents[cacheKey])
  ) {
    return cache.residents[cacheKey];
  }

  try {
    const { data, error } = await supabase
      .from("residents")
      .select("*")
      .eq("block_number", blockName)
      .eq("apartment_number", apartmentNumber)
      .maybeSingle();

    if (error) {
      console.error("Error fetching resident:", error);
      return null;
    }

    // Update cache
    cache.residents[cacheKey] = data;
    cache.lastFetch.residents[cacheKey] = now;

    return data;
  } catch (error) {
    console.error("Error fetching resident:", error);
    return null;
  }
};
