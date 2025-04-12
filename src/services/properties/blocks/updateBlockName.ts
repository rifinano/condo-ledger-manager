
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cache } from "../cacheUtils";

/**
 * Updates a block's name and updates all resident references
 * @param blockId ID of the block to update
 * @param newName New name for the block
 * @returns Boolean indicating success/failure
 */
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
