
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cache } from "../cacheUtils";

/**
 * Deletes a block and its associated apartments
 * @param blockId ID of the block to delete
 * @returns Boolean indicating success/failure
 */
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
