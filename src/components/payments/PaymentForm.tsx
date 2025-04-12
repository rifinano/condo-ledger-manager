import { useState, useEffect } from 'react';
import { Resident, Payment } from "@/services/payments/types";
import { getCharges } from '@/services/charges';
import { Charge } from '@/services/charges/types';
import ResidentSelect from './form/ResidentSelect';
import PaymentTypeSelect from './form/PaymentTypeSelect';
import AmountInput from './form/AmountInput';
import DateInput from './form/DateInput';
import PeriodSelects from './form/PeriodSelects';
import PaymentMethodSelect from './form/PaymentMethodSelect';
import NotesInput from './form/NotesInput';

interface PaymentFormState {
  resident_id: string;
  amount: string;
  payment_date: string;
  payment_for_month: string;
  payment_for_year: string;
  payment_type: string;
  payment_method: string;
  notes: string;
}

interface PaymentFormProps {
  newPayment: PaymentFormState;
  setNewPayment: React.Dispatch<React.SetStateAction<PaymentFormState>>;
  residents: Resident[];
  years: string[];
  months: { value: string; label: string }[];
  paymentTypes: string[];
  paymentMethods: string[];
}

const PaymentForm = ({
  newPayment,
  setNewPayment,
  residents,
  years,
  months,
  paymentTypes,
  paymentMethods
}: PaymentFormProps) => {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [isLoadingCharges, setIsLoadingCharges] = useState(false);
  
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
  
  // Filter payment types to only include Resident charges
  const residentChargeNames = charges
    .filter(charge => charge.charge_type === 'Resident')
    .map(charge => charge.name);
  
  // Combined payment types list (keep standard types and add resident charges)
  const filteredPaymentTypes = [...new Set([...paymentTypes, ...residentChargeNames])];
  
  // When payment type changes to a charge, update the amount
  useEffect(() => {
    const selectedCharge = charges.find(charge => charge.name === newPayment.payment_type);
    if (selectedCharge) {
      setNewPayment(prev => ({
        ...prev,
        amount: selectedCharge.amount.toString()
      }));
    }
  }, [newPayment.payment_type, charges]);

  // Handler functions for updating form state
  const handleResidentChange = (value: string) => {
    setNewPayment({...newPayment, resident_id: value});
  };

  const handlePaymentTypeChange = (value: string) => {
    setNewPayment({...newPayment, payment_type: value});
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPayment({...newPayment, amount: e.target.value});
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPayment({...newPayment, payment_date: e.target.value});
  };

  const handleYearChange = (value: string) => {
    setNewPayment({...newPayment, payment_for_year: value});
  };

  const handleMonthChange = (value: string) => {
    setNewPayment({...newPayment, payment_for_month: value});
  };

  const handleMethodChange = (value: string) => {
    setNewPayment({...newPayment, payment_method: value});
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPayment({...newPayment, notes: e.target.value});
  };

  return (
    <div className="grid gap-4 py-4">
      <ResidentSelect 
        value={newPayment.resident_id}
        onChange={handleResidentChange}
        residents={residents}
      />
      
      <PaymentTypeSelect 
        value={newPayment.payment_type}
        onChange={handlePaymentTypeChange}
        paymentTypes={filteredPaymentTypes}
        isLoading={isLoadingCharges}
      />
      
      <AmountInput 
        value={newPayment.amount}
        onChange={handleAmountChange}
      />
      
      <DateInput 
        label="Payment Date"
        id="payment_date"
        value={newPayment.payment_date}
        onChange={handleDateChange}
      />
      
      <PeriodSelects 
        yearValue={newPayment.payment_for_year}
        onYearChange={handleYearChange}
        monthValue={newPayment.payment_for_month}
        onMonthChange={handleMonthChange}
        years={years}
        months={months}
      />
      
      <PaymentMethodSelect 
        value={newPayment.payment_method}
        onChange={handleMethodChange}
        paymentMethods={paymentMethods}
      />
      
      <NotesInput 
        value={newPayment.notes}
        onChange={handleNotesChange}
      />
    </div>
  );
};

export default PaymentForm;
