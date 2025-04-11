
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface PaymentFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  cancelLabel?: string;
  submitLabel?: string;
  submitLoadingLabel?: string;
}

const PaymentFormActions = ({ 
  onCancel, 
  onSubmit,
  isSubmitting = false,
  cancelLabel = "Cancel",
  submitLabel = "Add Payment",
  submitLoadingLabel = "Adding..."
}: PaymentFormActionsProps) => {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onCancel} type="button">
        {cancelLabel}
      </Button>
      <Button onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? submitLoadingLabel : submitLabel}
      </Button>
    </DialogFooter>
  );
};

export default PaymentFormActions;
