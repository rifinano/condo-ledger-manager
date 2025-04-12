
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AmountInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AmountInput = ({ value, onChange }: AmountInputProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="amount" className="text-right">
        Amount ($)
      </Label>
      <Input
        id="amount"
        type="number"
        value={value}
        onChange={onChange}
        placeholder="0.00"
        min="0"
        step="0.01"
        className="col-span-3"
      />
    </div>
  );
};

export default AmountInput;
