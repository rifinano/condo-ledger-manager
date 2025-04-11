
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface PaymentFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const PaymentFormActions = ({ 
  onCancel, 
  onSubmit,
  isSubmitting = false 
}: PaymentFormActionsProps) => {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onCancel} type="button">
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Payment'}
      </Button>
    </DialogFooter>
  );
};

export default PaymentFormActions;
