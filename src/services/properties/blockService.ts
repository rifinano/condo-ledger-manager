
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Block } from "./types";
import { cache, isCacheValid } from "./cacheUtils";
import { Database } from "@/integrations/supabase/types";

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
    const blocksData = (data || []) as Block[];
    
    // Update cache
    cache.blocks = blocksData;
    cache.lastFetch.blocks = Date.now();

    return blocksData;
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return [];
  }
};

export const addBlock = async (name: string, apartmentCount: number): Promise<Block | null> => {
  try {
    // 1. Add the block
    const blockInsert: Database['public']['Tables']['blocks']['Insert'] = { name };
    
    const { data: blockData, error: blockError } = await supabase
      .from("blocks")
      .insert(blockInsert)
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

    // Properly type the blockData for TypeScript
    const newBlock = blockData as unknown as Block;

    // 2. Add the apartments for this block
    const apartments = Array.from({ length: apartmentCount }, (_, i) => {
      // Ensure apartment numbers are properly zero-padded
      const aptNum = (i + 1).toString().padStart(2, '0');
      return {
        number: `${aptNum}`,
        block_id: newBlock.id,
        floor: 1  // Default floor value since it's required by the database
      };
    });

    // Type assertion for array of apartments
    const apartmentInserts = apartments as unknown as Database['public']['Tables']['apartments']['Insert'][];

    const { error: apartmentsError } = await supabase
      .from("apartments")
      .insert(apartmentInserts);

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

    return newBlock;
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
      .eq('id', blockId);

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
