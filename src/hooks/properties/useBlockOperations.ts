
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  addBlock, 
  deleteBlock,
  updateBlockName 
} from "@/services/properties";

export const useBlockOperations = (refreshData: () => void) => {
  const { toast } = useToast();
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [isDeletingBlock, setIsDeletingBlock] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [currentBlockName, setCurrentBlockName] = useState<string | null>(null);

  const handleAddBlock = async (name: string, apartmentCount: number) => {
    if (!name || !apartmentCount) {
      toast({
        title: "Missing information",
        description: "Please provide both block name and number of apartments",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(apartmentCount) || apartmentCount <= 0) {
      toast({
        title: "Invalid input",
        description: "Number of apartments must be a positive number",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addBlock(name, apartmentCount);
      if (result) {
        await refreshData();
        setIsAddingBlock(false);
        
        toast({
          title: "Block added",
          description: `${name} with ${apartmentCount} apartments has been added`,
        });
      }
    } catch (error) {
      console.error("Error adding block:", error);
      toast({
        title: "Error",
        description: "Failed to add block.",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteBlock = (blockId: string, blockName: string, hasResidents: boolean) => {
    if (hasResidents) {
      toast({
        title: "Cannot delete block",
        description: "Remove all residents from this block before deleting it.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentBlockId(blockId);
    setCurrentBlockName(blockName);
    setIsDeletingBlock(true);
  };

  const handleDeleteBlock = async () => {
    if (!currentBlockId) return;
    
    try {
      const success = await deleteBlock(currentBlockId);
      if (success) {
        refreshData();
        setIsDeletingBlock(false);
        setCurrentBlockId(null);
        setCurrentBlockName(null);
        
        toast({
          title: "Block deleted",
          description: "The block and its apartments have been deleted",
        });
      }
    } catch (error) {
      console.error("Error deleting block:", error);
      toast({
        title: "Error",
        description: "Failed to delete block.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBlockName = async (blockId: string, newName: string): Promise<boolean> => {
    try {
      const success = await updateBlockName(blockId, newName);
      if (success) {
        refreshData();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating block name:", error);
      toast({
        title: "Error",
        description: "Failed to update block name.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isAddingBlock,
    setIsAddingBlock,
    isDeletingBlock,
    setIsDeletingBlock,
    currentBlockId,
    currentBlockName,
    handleAddBlock,
    confirmDeleteBlock,
    handleDeleteBlock,
    handleUpdateBlockName
  };
};
