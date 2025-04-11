
import React from "react";
import { Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Apartment, Block } from "@/services/properties";

interface EditApartmentSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  apartment: Apartment | null;
  blocks: (Block & { apartments: Apartment[] })[];
  getResidentName: (blockName: string, apartmentNumber: string) => string | null;
  onEditDetails: () => void;
  onManageResidents: () => void;
}

const EditApartmentSheet: React.FC<EditApartmentSheetProps> = ({
  isOpen,
  onOpenChange,
  apartment,
  blocks,
  getResidentName,
  onEditDetails,
  onManageResidents,
}) => {
  if (!apartment) return null;

  const block = blocks.find(b => b.id === apartment.block_id);
  const blockName = block ? block.name : "Unknown Block";
  const residentName = getResidentName(blockName, apartment.number);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Apartment</SheetTitle>
          <SheetDescription>
            Edit apartment details or manage residents
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Apartment Details</h3>
            <div className="flex items-center">
              <Home className="mr-2 h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">{apartment.number}</p>
                <p className="text-sm text-gray-500">{blockName}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Current Resident</h3>
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-gray-500" />
              <div>
                {residentName ? (
                  <p className="font-medium">{residentName}</p>
                ) : (
                  <p className="text-gray-500">No resident assigned</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <SheetFooter className="flex flex-col space-y-2 sm:space-y-0">
          <Button onClick={onEditDetails} className="w-full">
            Edit Apartment Details
          </Button>
          <Button onClick={onManageResidents} variant="outline" className="w-full">
            Manage Residents
          </Button>
          <SheetClose asChild>
            <Button variant="ghost" className="w-full">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditApartmentSheet;
