
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Block } from "../types";
import { cache, isCacheValid } from "../cacheUtils";
import { Database } from "@/integrations/supabase/types";

/**
 * Fetches all blocks from the database
 * @returns Array of Block objects
 */
export const getBlocks = async (): Promise<Block[]> => {
  // Check if cached data exists and is still valid
  if (cache.blocks && isCacheValid(cache.lastFetch.blocks)) {
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

    // Type assertion to ensure compatibility
    const blocksData = (data as unknown as Block[]) || [];
    
    // Update cache
    cache.blocks = blocksData;
    cache.lastFetch.blocks = Date.now();

    return blocksData;
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return [];
  }
};
