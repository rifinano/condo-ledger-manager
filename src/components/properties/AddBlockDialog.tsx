
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AddBlockDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBlock: (name: string, apartmentCount: number) => void;
  loading: boolean;
}

const AddBlockDialog: React.FC<AddBlockDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onAddBlock, 
  loading 
}) => {
  const [blockLetter, setBlockLetter] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const [newBlockApartments, setNewBlockApartments] = useState("10");
  
  const blockLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const blockNumbers = Array.from({ length: 10 }, (_, i) => `${i + 1}`);

  const handleSubmit = () => {
    const blockName = blockNumber 
      ? `Block ${blockLetter}${blockNumber}` 
      : `Block ${blockLetter}`;
      
    onAddBlock(blockName, parseInt(newBlockApartments));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-syndicate-600 hover:bg-syndicate-700">
          <Plus className="mr-2 h-4 w-4" /> Add Block
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Block</DialogTitle>
          <DialogDescription>
            Add a new residential block with apartments
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <Label>Block Identifier</Label>
            <div className="flex items-center space-x-2">
              <div className="w-1/2">
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
              <div className="w-1/2">
                <Select value={blockNumber} onValueChange={setBlockNumber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Number (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {blockNumbers.map(number => (
                      <SelectItem key={number} value={number}>
                        {number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apartment-count" className="text-right">
              Apartments
            </Label>
            <Input
              id="apartment-count"
              type="number"
              value={newBlockApartments}
              onChange={(e) => setNewBlockApartments(e.target.value)}
              className="col-span-3"
              min="1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={loading || !blockLetter}
          >
            Add Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlockDialog;
