import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { addPayment } from "@/services/payments";
import { PaymentFormData } from "@/services/payments/types";

export interface PaymentFormState {
  resident_id: string;
  amount: string;
  payment_date: string;
  payment_for_month: string;
  payment_for_year: string;
  payment_type: string;
  payment_method: string;
  notes: string;
}

const initialPayment: PaymentFormState = {
  resident_id: "",
  amount: "",
  payment_date: new Date().toISOString().split("T")[0],
  payment_for_month: new Date().toISOString().split("-")[1],
  payment_for_year: new Date().getFullYear().toString(),
  payment_type: "",
  payment_method: "Cash",
  notes: ""
};

export const usePaymentForm = (
  onSuccess: () => void,
  refetchPayments: () => void
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPayment, setNewPayment] = useState<PaymentFormState>(initialPayment);

  const resetForm = useCallback(() => {
    setNewPayment(initialPayment);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!newPayment.resident_id || !newPayment.amount || !newPayment.payment_date || !newPayment.payment_type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formattedPayment: PaymentFormData = {
        resident_id: newPayment.resident_id,
        amount: parseFloat(newPayment.amount),
        payment_date: newPayment.payment_date,
        payment_for_month: newPayment.payment_for_month,
        payment_for_year: newPayment.payment_for_year,
        payment_type: newPayment.payment_type,
        payment_method: newPayment.payment_method,
        notes: newPayment.notes || null
      };

      console.log("Submitting payment form with data:", formattedPayment);
      
      const result = await addPayment(formattedPayment);
      
      if (result.success) {
        toast({
          title: "Payment added",
          description: "The payment has been recorded successfully"
        });
        resetForm();
        onSuccess();
        refetchPayments();
      } else {
        toast({
          title: "Error adding payment",
          description: result.error || "Failed to add payment",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error adding payment",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [newPayment, toast, onSuccess, refetchPayments, resetForm]);

  return {
    newPayment,
    setNewPayment,
    handleSubmit,
    resetForm,
    isSubmitting
  };
};
