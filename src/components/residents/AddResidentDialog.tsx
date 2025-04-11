
import { ResidentFormData } from "@/services/residentsService";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import ResidentForm from "@/components/residents/ResidentForm";
import PaymentFormActions from "@/components/payments/PaymentFormActions";

interface AddResidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentResident: Partial<ResidentFormData>;
  setCurrentResident: (resident: Partial<ResidentFormData>) => void;
  blocks: string[];
  getApartments: (block: string) => string[];
  handleAddResident: () => void;
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
  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
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
        <PaymentFormActions
          onCancel={() => onOpenChange(false)}
          onSubmit={handleAddResident}
          submitLabel="Add Resident"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddResidentDialog;
