
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

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
  const [newBlockName, setNewBlockName] = useState("");
  const [newBlockApartments, setNewBlockApartments] = useState("10");

  const handleSubmit = () => {
    onAddBlock(newBlockName, parseInt(newBlockApartments));
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="block-name" className="text-right">
              Block Name
            </Label>
            <Input
              id="block-name"
              value={newBlockName}
              onChange={(e) => setNewBlockName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Block C"
            />
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
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={loading}
          >
            Add Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlockDialog;
