
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface PaymentMethodSelectProps {
  value: string;
  onChange: (value: string) => void;
  paymentMethods: string[];
}

const PaymentMethodSelect = ({ value, onChange, paymentMethods }: PaymentMethodSelectProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="payment_method" className="text-right">
        Payment Method
      </Label>
      <Select 
        value={value} 
        onValueChange={onChange}
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
  );
};

export default PaymentMethodSelect;
