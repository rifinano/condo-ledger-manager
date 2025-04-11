
import { useState } from "react";
import { ResidentFormData } from "@/services/residentsService";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ResidentForm from "@/components/residents/ResidentForm";

interface AddResidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentResident: Partial<ResidentFormData>;
  setCurrentResident: (resident: Partial<ResidentFormData>) => void;
  blocks: string[];
  getApartments: (block: string) => string[];
  handleAddResident: () => Promise<boolean>;
  resetForm: () => void;
  months: { value: string; label: string }[];
  years: string[];
}

const AddResidentDialog = ({
  open,
  onOpenChange,
  currentResident,
  setCurrentResident,
  blocks,
  getApartments,
  handleAddResident,
  resetForm,
  months,
  years
}: AddResidentDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await handleAddResident();
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
          <DialogTitle>Add New Resident</DialogTitle>
          <DialogDescription>
            Enter resident details to add them to your property
          </DialogDescription>
        </DialogHeader>
        <ResidentForm
          resident={currentResident}
          onResidentChange={setCurrentResident}
          blocks={blocks}
          getApartments={getApartments}
          months={months}
          years={years}
        />
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Resident"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddResidentDialog;
