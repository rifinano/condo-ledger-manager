
import React, { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface BlockNameEditorProps {
  blockId: string;
  blockName: string;
  onUpdateBlockName: (blockId: string, newName: string) => Promise<boolean>;
}

const BlockNameEditor: React.FC<BlockNameEditorProps> = ({
  blockId,
  blockName,
  onUpdateBlockName
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [blockLetter, setBlockLetter] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const { toast } = useToast();
  
  const blockLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const blockNumbers = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
  
  useEffect(() => {
    if (blockName) {
      const matches = blockName.match(/Block ([A-Z])(?:(\d+))?/);
      if (matches) {
        setBlockLetter(matches[1] || "");
        setBlockNumber(matches[2] || "");
      }
    }
  }, [blockName]);

  const startEditingName = () => {
    setIsEditingName(true);
  };

  const cancelEditingName = () => {
    const matches = blockName.match(/Block ([A-Z])(?:(\d+))?/);
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
    
    const success = await onUpdateBlockName(blockId, newName);
    if (success) {
      setIsEditingName(false);
      toast({
        title: "Block updated",
        description: `Block name has been updated to "${newName}"`,
      });
    }
  };

  if (isEditingName) {
    return (
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
                <SelectItem key="none" value="">None</SelectItem>
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
    );
  }

  return (
    <div className="flex items-center">
      <CardTitle>{blockName}</CardTitle>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={startEditingName}
        className="ml-2 p-1 h-7 w-7"
      >
        <Pencil className="h-4 w-4 text-gray-500" />
      </Button>
    </div>
  );
};

export default BlockNameEditor;
