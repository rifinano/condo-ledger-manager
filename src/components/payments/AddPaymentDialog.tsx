
import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Resident } from "@/services/paymentsService";
import { useToast } from "@/hooks/use-toast";
import PaymentForm from "./PaymentForm";
import PaymentFormActions from "./PaymentFormActions";
import { usePaymentForm } from "@/hooks/usePaymentForm";

interface AddPaymentDialogProps {
  residents: Resident[];
  refetchPayments: () => void;
  years: string[];
  months: { value: string; label: string }[];
  paymentTypes: string[];
  paymentMethods: string[];
}

const AddPaymentDialog = ({ 
  residents, 
  refetchPayments, 
  years, 
  months, 
  paymentTypes, 
  paymentMethods 
}: AddPaymentDialogProps) => {
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("Residents in AddPaymentDialog:", residents);
  }, [residents]);

  const closeDialog = () => setIsAddingPayment(false);
  
  const {
    newPayment,
    setNewPayment,
    handleSubmit,
    isSubmitting
  } = usePaymentForm(closeDialog, refetchPayments);

  return (
    <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
          <DialogDescription>
            Enter payment details to record a new payment
          </DialogDescription>
        </DialogHeader>
        
        <PaymentForm
          newPayment={newPayment}
          setNewPayment={setNewPayment}
          residents={residents}
          years={years}
          months={months}
          paymentTypes={paymentTypes}
          paymentMethods={paymentMethods}
        />
        
        <PaymentFormActions
          onCancel={closeDialog}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentDialog;
