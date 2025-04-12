
import React, { useState, useEffect } from "react";
import { Building2, Pencil, Check, X } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Block, Apartment } from "@/services/properties";
import { useToast } from "@/hooks/use-toast";

interface BlockHeaderProps {
  block: Block & { apartments: Apartment[] };
  onDeleteBlock: (blockId: string) => void;
  onUpdateBlockName: (blockId: string, newName: string) => Promise<boolean>;
  isApartmentOccupied: (blockName: string, apartmentNumber: string) => boolean;
  occupiedCount: number;
}

const BlockHeader: React.FC<BlockHeaderProps> = ({
  block,
  onDeleteBlock,
  onUpdateBlockName,
  isApartmentOccupied,
  occupiedCount
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [blockLetter, setBlockLetter] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const { toast } = useToast();
  
  const blockLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const blockNumbers = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
  
  useEffect(() => {
    if (block.name) {
      const matches = block.name.match(/Block ([A-Z])(?:(\d+))?/);
      if (matches) {
        setBlockLetter(matches[1] || "");
        setBlockNumber(matches[2] || "");
      }
    }
  }, [block.name]);

  const handleDeleteBlock = () => {
    const hasOccupiedApartments = block.apartments.some(apt => 
      isApartmentOccupied(block.name, apt.number)
    );

    if (hasOccupiedApartments) {
      toast({
        title: "Cannot delete block",
        description: "This block has occupied apartments. Please reassign or delete all residents before deleting this block.",
        variant: "destructive"
      });
      return;
    }

    onDeleteBlock(block.id);
  };

  const startEditingName = () => {
    setIsEditingName(true);
  };

  const cancelEditingName = () => {
    const matches = block.name.match(/Block ([A-Z])(?:(\d+))?/);
    if (matches) {
      setBlockLetter(matches[1] || "");
      setBlockNumber(matches[2] || "");
    }
    setIsEditingName(false);
  };

  const saveBlockName = async () => {
    if (!blockLetter) {
      toast({
        title: "Invalid name",
        description: "Block letter is required",
        variant: "destructive"
      });
      return;
    }

    const newName = blockNumber 
      ? `Block ${blockLetter}${blockNumber}` 
      : `Block ${blockLetter}`;
    
    const success = await onUpdateBlockName(block.id, newName);
    if (success) {
      setIsEditingName(false);
      toast({
        title: "Block updated",
        description: `Block name has been updated to "${newName}"`,
      });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Building2 className="h-5 w-5 mr-2 text-syndicate-600" />
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <div className="flex space-x-2">
              <div className="w-24">
                <Select value={blockLetter} onValueChange={setBlockLetter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Letter" />
                  </SelectTrigger>
                  <SelectContent>
                    {blockLetters.map(letter => (
                      <SelectItem key={letter} value={letter}>
                        {letter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <Select value={blockNumber} onValueChange={setBlockNumber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Number (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="no-number" value="">None</SelectItem>
                    {blockNumbers.map(number => (
                      <SelectItem key={number} value={number}>
                        {number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={saveBlockName}
              className="p-1 h-8 w-8"
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={cancelEditingName}
              className="p-1 h-8 w-8"
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <CardTitle>{block.name}</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={startEditingName}
              className="ml-2 p-1 h-7 w-7"
            >
              <Pencil className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <DeleteBlockButton onDelete={handleDeleteBlock} />
      </div>
    </div>
  );
};

// Sub-component to handle delete action
const DeleteBlockButton: React.FC<{ onDelete: () => void }> = ({ onDelete }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-red-600 hover:text-red-700"
      onClick={onDelete}
    >
      <Trash2 className="h-4 w-4 mr-1" /> Delete
    </Button>
  );
};

// Import Trash2 specifically for the DeleteBlockButton
import { Trash2 } from "lucide-react";

export default BlockHeader;
