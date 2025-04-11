
import { ResidentFormData } from "@/services/residentsService";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import ResidentForm from "@/components/residents/ResidentForm";
import { Button } from "@/components/ui/button";

interface EditResidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentResident: Partial<ResidentFormData>;
  setCurrentResident: (resident: Partial<ResidentFormData>) => void;
  blocks: string[];
  getApartments: (block: string) => string[];
  handleUpdateResident: () => void;
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
  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateResident}>
            Update Resident
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditResidentDialog;
