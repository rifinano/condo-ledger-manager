
import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Apartment, Block } from "@/services/propertiesService";

interface EditApartmentSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  apartment: Apartment | null;
  blocks: (Block & { apartments: Apartment[] })[];
  getResidentName: (blockName: string, apartmentNumber: string) => string | null;
  onManageResidents: () => void;
  onEditDetails: () => void;
}

const EditApartmentSheet: React.FC<EditApartmentSheetProps> = ({
  isOpen,
  onOpenChange,
  apartment,
  blocks,
  getResidentName,
  onManageResidents,
  onEditDetails,
}) => {
  if (!apartment) return null;

  // Find the block this apartment belongs to
  const block = blocks.find((b) => b.apartments.some((a) => a.id === apartment.id));
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Apartment</SheetTitle>
          <SheetDescription>
            {apartment && (
              <div className="mt-2">
                <p className="text-sm">
                  Apartment: <span className="font-medium">{apartment.number}</span>
                </p>
                
                {block && (
                  <p className="text-sm">
                    Block: <span className="font-medium">{block.name}</span>
                  </p>
                )}
              </div>
            )}
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onEditDetails}
          >
            Edit Details
          </Button>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Current Resident</h4>
            {block && (
              <div>
                {(() => {
                  const resident = getResidentName(block.name, apartment.number);
                  return resident ? (
                    <div className="p-3 border rounded-md mb-3">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-syndicate-600" />
                        <p className="font-medium">{resident}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 border rounded-md mb-3 text-gray-500">
                      No resident assigned
                    </div>
                  );
                })()}
              </div>
            )}
            
            <Button 
              className="w-full mt-4"
              variant="outline"
              onClick={onManageResidents}
            >
              Manage Residents
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditApartmentSheet;
