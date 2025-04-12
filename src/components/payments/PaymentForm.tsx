
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Resident, Payment } from "@/services/payments/types";

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

interface Charge {
  id: string;
  name: string;
  amount: number;
  chargeType: string;
}

interface PaymentFormProps {
  newPayment: PaymentFormState;
  setNewPayment: Dispatch<SetStateAction<PaymentFormState>>;
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
  const [filteredPaymentTypes, setFilteredPaymentTypes] = useState<string[]>(paymentTypes);
  
  // Simulate fetching charges - in a real app, this would come from a database
  useEffect(() => {
    const mockCharges = [
      { id: '1', name: 'Maintenance Fee', amount: 100, chargeType: 'Resident' },
      { id: '2', name: 'Water Fee', amount: 50, chargeType: 'Resident' },
      { id: '3', name: 'Security Fee', amount: 75, chargeType: 'Syndicate' },
      { id: '4', name: 'Special Assessment', amount: 200, chargeType: 'Syndicate' },
    ];
    
    setCharges(mockCharges);
    
    // Filter payment types based on the mock charges that are Resident type
    const residentChargeNames = mockCharges
      .filter(charge => charge.chargeType === 'Resident')
      .map(charge => charge.name);
    
    // Combine existing payment types with resident charge names
    setFilteredPaymentTypes([...new Set([...paymentTypes, ...residentChargeNames])]);
  }, [paymentTypes]);
  
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

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="resident" className="text-right">
          Resident
        </Label>
        <Select 
          value={newPayment.resident_id} 
          onValueChange={(value) => setNewPayment({...newPayment, resident_id: value})}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select a resident" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto z-50 bg-white">
            {residents && residents.length > 0 ? (
              residents.map((resident) => (
                <SelectItem key={resident.id} value={resident.id}>
                  {resident.full_name} ({resident.block_number}, Apt {resident.apartment_number})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-residents" disabled>
                No residents found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="payment_type" className="text-right">
          Payment Type
        </Label>
        <Select 
          value={newPayment.payment_type} 
          onValueChange={(value) => setNewPayment({...newPayment, payment_type: value})}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select payment type" />
          </SelectTrigger>
          <SelectContent>
            {filteredPaymentTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="amount" className="text-right">
          Amount ($)
        </Label>
        <Input
          id="amount"
          type="number"
          value={newPayment.amount}
          onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
          placeholder="0.00"
          min="0"
          step="0.01"
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="payment_date" className="text-right">
          Payment Date
        </Label>
        <Input
          id="payment_date"
          type="date"
          value={newPayment.payment_date}
          onChange={(e) => setNewPayment({...newPayment, payment_date: e.target.value})}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="payment_for_year" className="text-right">
          For Year
        </Label>
        <Select 
          value={newPayment.payment_for_year} 
          onValueChange={(value) => setNewPayment({...newPayment, payment_for_year: value})}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="payment_for_month" className="text-right">
          For Month
        </Label>
        <Select 
          value={newPayment.payment_for_month} 
          onValueChange={(value) => setNewPayment({...newPayment, payment_for_month: value})}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="payment_method" className="text-right">
          Payment Method
        </Label>
        <Select 
          value={newPayment.payment_method} 
          onValueChange={(value) => setNewPayment({...newPayment, payment_method: value})}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((method) => (
              <SelectItem key={method} value={method}>{method}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notes" className="text-right">
          Notes
        </Label>
        <Input
          id="notes"
          value={newPayment.notes}
          onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
          className="col-span-3"
          placeholder="Optional notes"
        />
      </div>
    </div>
  );
};

export default PaymentForm;
