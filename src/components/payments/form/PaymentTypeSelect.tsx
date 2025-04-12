
import { Dispatch, SetStateAction } from 'react';
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface PaymentTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  paymentTypes: string[];
  isLoading: boolean;
}

const PaymentTypeSelect = ({ 
  value, 
  onChange, 
  paymentTypes, 
  isLoading 
}: PaymentTypeSelectProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="payment_type" className="text-right">
        Payment Type
      </Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder={isLoading ? "Loading charge types..." : "Select payment type"} />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>Loading charge types...</SelectItem>
          ) : (
            paymentTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaymentTypeSelect;
