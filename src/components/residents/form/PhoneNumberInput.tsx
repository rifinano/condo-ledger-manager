
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneNumberInputProps {
  phoneNumber: string;
  onChange: (value: string) => void;
}

const PhoneNumberInput = ({ phoneNumber, onChange }: PhoneNumberInputProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="phone" className="text-right">
        Phone Number
      </Label>
      <Input
        id="phone"
        value={phoneNumber}
        onChange={(e) => onChange(e.target.value)}
        className="col-span-3"
        placeholder="Enter phone number"
      />
    </div>
  );
};

export default PhoneNumberInput;
