
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

export const addBlock = async (name: string, apartmentCount: number): Promise<Block | null> => {
  try {
    // 1. Add the block
    const blockInsert: Database['public']['Tables']['blocks']['Insert'] = { name };
    
    const { data: blockData, error: blockError } = await supabase
      .from("blocks")
      .insert(blockInsert as any)
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
      .insert(apartmentInserts as any);

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

export const updateBlockName = async (blockId: string, newName: string): Promise<boolean> => {
  try {
    // 1. Find the current block to get the old name
    const { data: blockData, error: blockFetchError } = await supabase
      .from("blocks")
      .select("name")
      .eq('id', blockId as any)
      .single();

    if (blockFetchError) {
      console.error("Error fetching block for name update:", blockFetchError);
      toast({
        title: "Error updating block name",
        description: blockFetchError.message,
        variant: "destructive",
      });
      return false;
    }

    const oldBlockName = blockData.name;
    console.log(`Updating block name from "${oldBlockName}" to "${newName}"`);

    // 2. Update the block name
    const { error: blockUpdateError } = await supabase
      .from("blocks")
      .update({ name: newName })
      .eq('id', blockId as any);

    if (blockUpdateError) {
      console.error("Error updating block name:", blockUpdateError);
      toast({
        title: "Error updating block name",
        description: blockUpdateError.message,
        variant: "destructive",
      });
      return false;
    }

    // 3. Update all residents with the old block_number to have the new block_number
    const { data: residentUpdateData, error: residentUpdateError } = await supabase
      .from("residents")
      .update({ block_number: newName })
      .eq('block_number', oldBlockName as any)
      .select('id');

    if (residentUpdateError) {
      console.error("Error updating resident block references:", residentUpdateError);
      toast({
        title: "Warning",
        description: "Block name updated but some resident data may not have been updated.",
        variant: "destructive",
      });
      // We don't fail the entire operation if resident updates fail
    } else {
      console.log(`Updated ${residentUpdateData?.length || 0} resident records with the new block name`);
    }

    // 4. Update all resident_apartments with the old block_number to have the new block_number
    const { data: apartmentUpdateData, error: apartmentUpdateError } = await supabase
      .from("resident_apartments")
      .update({ block_number: newName })
      .eq('block_number', oldBlockName as any)
      .select('id');

    if (apartmentUpdateError) {
      console.error("Error updating resident_apartments block references:", apartmentUpdateError);
      toast({
        title: "Warning",
        description: "Block name updated but some apartment assignments may not have been updated.",
        variant: "destructive",
      });
      // We don't fail the entire operation if apartment updates fail
    } else {
      console.log(`Updated ${apartmentUpdateData?.length || 0} resident apartment assignments with the new block name`);
    }

    // Invalidate all relevant caches
    cache.blocks = null;
    cache.residents = {}; // Clear the entire resident cache
    
    toast({
      title: "Block updated",
      description: `Block name changed from "${oldBlockName}" to "${newName}" and all resident records have been updated.`,
    });

    return true;
  } catch (error) {
    console.error("Error updating block name:", error);
    return false;
  }
};

export const deleteBlock = async (blockId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("blocks")
      .delete()
      .eq('id', blockId as any);

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
