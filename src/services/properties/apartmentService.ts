
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Apartment } from "./types";
import { cache, isCacheValid } from "./cacheUtils";
import { Database } from "@/integrations/supabase/types";

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
      .eq("block_id", blockId as any)
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

    // Type assertion to ensure compatibility
    const apartmentsData = (data || []) as Apartment[];
    
    // Update cache
    cache.apartments[blockId] = apartmentsData;
    cache.lastFetch.apartments[blockId] = Date.now();

    return apartmentsData;
  } catch (error) {
    console.error("Error fetching apartments:", error);
    return [];
  }
};

export const updateApartment = async (apartment: Partial<Apartment> & { id: string }): Promise<Apartment | null> => {
  try {
    // Create a typed update object that matches Supabase's expected format
    const updateData: Database['public']['Tables']['apartments']['Update'] = {
      ...(apartment.number && { number: apartment.number }),
      ...(apartment.block_id && { block_id: apartment.block_id }),
      ...(apartment.floor && { floor: apartment.floor })
    };
    
    const { data, error } = await supabase
      .from("apartments")
      .update(updateData)
      .eq("id", apartment.id as any)
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

    // Type assertion to ensure compatibility
    const updatedApartment = data as unknown as Apartment;

    // Invalidate apartment cache for this block
    if (updatedApartment.block_id) {
      delete cache.apartments[updatedApartment.block_id];
    }

    return updatedApartment;
  } catch (error) {
    console.error("Error updating apartment:", error);
    return null;
  }
};
