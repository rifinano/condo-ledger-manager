
import { useState } from "react";
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
  handleUpdateResident,
  resetForm,
  months,
  years
}: EditResidentDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
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
          months={months}
          years={years}
          isEditing={true}
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
            disabled={isSubmitting}
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
