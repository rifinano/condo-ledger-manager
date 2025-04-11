
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Block {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Apartment {
  id: string;
  number: string;
  block_id: string;
  created_at: string;
  updated_at: string;
}

// Cache mechanism for frequently accessed data
const cache = {
  blocks: null as Block[] | null,
  apartments: {} as Record<string, Apartment[]>,
  residents: {} as Record<string, any>,
  lastFetch: {
    blocks: 0,
    apartments: {} as Record<string, number>,
    residents: {} as Record<string, number>
  }
};

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const getBlocks = async (): Promise<Block[]> => {
  // Check if cached data exists and is still valid
  const now = Date.now();
  if (cache.blocks && (now - cache.lastFetch.blocks) < CACHE_EXPIRATION) {
    return cache.blocks;
  }

  try {
    const { data, error } = await supabase
      .from("blocks")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching blocks:", error);
      toast({
        title: "Error fetching blocks",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    // Update cache
    cache.blocks = data || [];
    cache.lastFetch.blocks = now;

    return data || [];
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return [];
  }
};

export const getApartmentsByBlockId = async (blockId: string): Promise<Apartment[]> => {
  // Check if cached data exists and is still valid
  const now = Date.now();
  if (
    cache.apartments[blockId] && 
    cache.lastFetch.apartments[blockId] && 
    (now - cache.lastFetch.apartments[blockId]) < CACHE_EXPIRATION
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
    cache.lastFetch.apartments[blockId] = now;

    return data || [];
  } catch (error) {
    console.error("Error fetching apartments:", error);
    return [];
  }
};

export const addBlock = async (name: string, apartmentCount: number): Promise<Block | null> => {
  try {
    // 1. Add the block
    const { data: blockData, error: blockError } = await supabase
      .from("blocks")
      .insert([{ name }])
      .select()
      .single();

    if (blockError) {
      console.error("Error adding block:", blockError);
      toast({
        title: "Error adding block",
        description: blockError.message,
        variant: "destructive",
      });
      return null;
    }

    // 2. Add the apartments for this block
    const apartments = Array.from({ length: apartmentCount }, (_, i) => {
      // Ensure apartment numbers are properly zero-padded
      const aptNum = (i + 1).toString().padStart(2, '0');
      return {
        number: `${aptNum}`,
        block_id: blockData.id,
        floor: 1  // Default floor value since it's required by the database
      };
    });

    const { error: apartmentsError } = await supabase
      .from("apartments")
      .insert(apartments);

    if (apartmentsError) {
      console.error("Error adding apartments:", apartmentsError);
      toast({
        title: "Error adding apartments",
        description: apartmentsError.message,
        variant: "destructive",
      });
      // We don't return null here because the block was successfully created
    }

    // Invalidate blocks cache
    cache.blocks = null;

    return blockData;
  } catch (error) {
    console.error("Error adding block:", error);
    return null;
  }
};

export const deleteBlock = async (blockId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("blocks")
      .delete()
      .eq("id", blockId);

    if (error) {
      console.error("Error deleting block:", error);
      toast({
        title: "Error deleting block",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    // Invalidate caches
    cache.blocks = null;
    delete cache.apartments[blockId];

    return true;
  } catch (error) {
    console.error("Error deleting block:", error);
    return false;
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

export const getResidentByApartment = async (blockName: string, apartmentNumber: string) => {
  const cacheKey = `${blockName}-${apartmentNumber}`;
  const now = Date.now();
  
  // Check if cached data exists and is still valid
  if (
    cache.residents[cacheKey] && 
    cache.lastFetch.residents[cacheKey] && 
    (now - cache.lastFetch.residents[cacheKey]) < CACHE_EXPIRATION
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
