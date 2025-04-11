
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

  // Add robust retry logic for network issues
  const maxRetries = 3;
  let attempt = 0;
  let fetchError = null;
  
  while (attempt < maxRetries) {
    try {
      const { data, error } = await supabase
        .from("residents")
        .select("*")
        .eq("block_number", blockName as any)
        .eq("apartment_number", apartmentNumber as any)
        .maybeSingle();

      if (error) throw error;

      // Update cache
      cache.residents[cacheKey] = data;
      cache.lastFetch.residents[cacheKey] = now;

      return data;
    } catch (error) {
      fetchError = error;
      attempt++;
      console.log(`Resident fetch attempt ${attempt} failed, retrying...`);
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }
  
  // If we've exhausted all retries
  console.error("Error fetching resident after retries:", fetchError);
  return null;
};
