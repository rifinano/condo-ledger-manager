
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateInput = ({ label, id, value, onChange }: DateInputProps) => {
  // Convert any Date objects to string format that the input field expects
  const dateValue = typeof value === 'object' && value instanceof Date 
    ? value.toISOString().split('T')[0] 
    : String(value);
    
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Input
        id={id}
        type="date"
        value={dateValue}
        onChange={onChange}
        className="col-span-3"
      />
    </div>
  );
};

export default DateInput;
