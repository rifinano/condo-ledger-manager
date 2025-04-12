
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Payment } from "@/services/payments/types";
import { getCharges } from '@/services/charges';
import { Charge } from '@/services/charges/types';
import { getResidents } from '@/services/payments';
import { updatePayment } from '@/services/payments/updatePayment';
import { useToast } from "@/hooks/use-toast";
import AmountInput from './form/AmountInput';
import DateInput from './form/DateInput';
import PaymentMethodSelect from './form/PaymentMethodSelect';
import PaymentTypeSelect from './form/PaymentTypeSelect';
import PeriodSelects from './form/PeriodSelects';
import NotesInput from './form/NotesInput';

interface EditPaymentFormProps {
  payment: Payment;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditPaymentForm = ({ payment, onSuccess, onCancel }: EditPaymentFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: payment.amount.toString(),
    payment_date: payment.payment_date,
    payment_for_month: payment.payment_for_month,
    payment_for_year: payment.payment_for_year,
    payment_type: payment.payment_type,
    payment_method: payment.payment_method,
    notes: payment.notes || '',
  });
  
  const [charges, setCharges] = useState<Charge[]>([]);
  const [isLoadingCharges, setIsLoadingCharges] = useState(false);
  const [years, setYears] = useState<string[]>([]);
  const [months, setMonths] = useState<{ value: string; label: string }[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([
    "Cash", "Bank Transfer", "Check", "Credit Card", "Mobile Payment"
  ]);
  
  // Fetch charges from the database
  useEffect(() => {
    const fetchCharges = async () => {
      setIsLoadingCharges(true);
      try {
        const chargesData = await getCharges();
        setCharges(chargesData);
      } catch (error) {
        console.error('Error fetching charges:', error);
      } finally {
        setIsLoadingCharges(false);
      }
    };
    
    fetchCharges();
  }, []);
  
  // Generate years (current year and 5 years back)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());
    setYears(yearsArray);
  }, []);
  
  // Generate months
  useEffect(() => {
    const monthsData = [
      { value: "01", label: "January" },
      { value: "02", label: "February" },
      { value: "03", label: "March" },
      { value: "04", label: "April" },
      { value: "05", label: "May" },
      { value: "06", label: "June" },
      { value: "07", label: "July" },
      { value: "08", label: "August" },
      { value: "09", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" }
    ];
    setMonths(monthsData);
  }, []);
  
  // Filter payment types to only include Resident charges
  const residentChargeNames = charges
    .filter(charge => charge.charge_type === 'Resident')
    .map(charge => charge.name);
  
  // When payment type changes to a charge, update the amount
  useEffect(() => {
    const selectedCharge = charges.find(charge => charge.name === formData.payment_type);
    if (selectedCharge) {
      setFormData(prev => ({
        ...prev,
        amount: selectedCharge.amount.toString()
      }));
    }
  }, [formData.payment_type, charges]);

  const handleSubmit = async () => {
    if (!formData.amount || !formData.payment_date || !formData.payment_type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const updatedPayment = {
        id: payment.id,
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date,
        payment_for_month: formData.payment_for_month,
        payment_for_year: formData.payment_for_year,
        payment_type: formData.payment_type,
        payment_method: formData.payment_method,
        notes: formData.notes || null
      };
      
      const result = await updatePayment(updatedPayment);
      
      if (result.success) {
        onSuccess();
      } else {
        toast({
          title: "Error updating payment",
          description: result.error || "Failed to update payment",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error updating payment",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <PaymentTypeSelect 
        value={formData.payment_type}
        onChange={(value) => setFormData({...formData, payment_type: value})}
        paymentTypes={residentChargeNames}
        isLoading={isLoadingCharges}
      />
      
      <AmountInput 
        value={formData.amount}
        onChange={(e) => setFormData({...formData, amount: e.target.value})}
      />
      
      <DateInput 
        label="Payment Date"
        id="payment_date"
        value={formData.payment_date}
        onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
      />
      
      <PeriodSelects 
        yearValue={formData.payment_for_year}
        onYearChange={(value) => setFormData({...formData, payment_for_year: value})}
        monthValue={formData.payment_for_month}
        onMonthChange={(value) => setFormData({...formData, payment_for_month: value})}
        years={years}
        months={months}
      />
      
      <PaymentMethodSelect 
        value={formData.payment_method}
        onChange={(value) => setFormData({...formData, payment_method: value})}
        paymentMethods={paymentMethods}
      />
      
      <NotesInput 
        value={formData.notes}
        onChange={(e) => setFormData({...formData, notes: e.target.value})}
      />

      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default EditPaymentForm;
