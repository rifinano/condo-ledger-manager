
import { useState, useEffect } from "react";
import { ResidentFormData } from "@/services/residents/types";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import ResidentForm from "@/components/residents/ResidentForm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EditResidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentResident: Partial<ResidentFormData>;
  setCurrentResident: (resident: Partial<ResidentFormData>) => void;
  blocks: string[];
  getApartments: (block: string) => string[];
  isApartmentOccupied?: (blockNumber: string, apartmentNumber: string, excludeResidentId?: string) => boolean;
  currentResidentId?: string;
  handleUpdateResident: () => Promise<boolean>;
  resetForm: () => void;
  months: { value: string; label: string }[];
  years: string[];
}

const EditResidentDialog = ({
  open,
  onOpenChange,
  currentResident,
  setCurrentResident,
  blocks,
  getApartments,
  isApartmentOccupied,
  currentResidentId,
  handleUpdateResident,
  resetForm,
  months,
  years
}: EditResidentDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apartmentOccupiedError, setApartmentOccupiedError] = useState(false);

  // Update apartment occupied error when relevant props change
  useEffect(() => {
    if (isApartmentOccupied && currentResident.block_number && currentResident.apartment_number) {
      const isOccupied = isApartmentOccupied(
        currentResident.block_number, 
        currentResident.apartment_number, 
        currentResidentId
      );
      setApartmentOccupiedError(isOccupied);
    } else {
      setApartmentOccupiedError(false);
    }
  }, [currentResident.block_number, currentResident.apartment_number, isApartmentOccupied, currentResidentId]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // Check if the apartment is already occupied by another resident before submitting
    if (isApartmentOccupied && 
        currentResident.block_number && 
        currentResident.apartment_number && 
        isApartmentOccupied(currentResident.block_number, currentResident.apartment_number, currentResidentId)) {
      return; // Don't proceed if apartment is occupied by another resident
    }
    
    setIsSubmitting(true);
    try {
      const result = await handleUpdateResident();
      if (result) {
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isSubmitting) {
      onOpenChange(open);
      if (!open) resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Resident</DialogTitle>
          <DialogDescription>
            Update resident information
          </DialogDescription>
        </DialogHeader>
        <ResidentForm
          resident={currentResident}
          onResidentChange={setCurrentResident}
          blocks={blocks}
          getApartments={getApartments}
          isApartmentOccupied={isApartmentOccupied}
          currentResidentId={currentResidentId}
          months={months}
          years={years}
          isEditing={true}
          showMoveInDate={true}
        />
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || apartmentOccupiedError}
            type="button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Resident"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditResidentDialog;
