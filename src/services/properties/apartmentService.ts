
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Apartment } from "./types";
import { cache, isCacheValid } from "./cacheUtils";

export const getApartmentsByBlockId = async (blockId: string): Promise<Apartment[]> => {
  // Check if cached data exists and is still valid
  if (
    cache.apartments[blockId] && 
    cache.lastFetch.apartments[blockId] && 
    isCacheValid(cache.lastFetch.apartments[blockId])
  ) {
    return cache.apartments[blockId];
  }

  try {
    const { data, error } = await supabase
      .from("apartments")
      .select("*")
      .eq("block_id", blockId)
      .order("number");

    if (error) {
      console.error("Error fetching apartments:", error);
      toast({
        title: "Error fetching apartments",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    // Update cache
    cache.apartments[blockId] = data || [];
    cache.lastFetch.apartments[blockId] = Date.now();

    return data || [];
  } catch (error) {
    console.error("Error fetching apartments:", error);
    return [];
  }
};

export const updateApartment = async (apartment: Partial<Apartment> & { id: string }): Promise<Apartment | null> => {
  try {
    const { data, error } = await supabase
      .from("apartments")
      .update(apartment)
      .eq("id", apartment.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating apartment:", error);
      toast({
        title: "Error updating apartment",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    // Invalidate apartment cache for this block
    if (data.block_id) {
      delete cache.apartments[data.block_id];
    }

    return data;
  } catch (error) {
    console.error("Error updating apartment:", error);
    return null;
  }
};
