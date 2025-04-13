
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateInputProps {
  label: string;
  id: string;
  value: string | Date | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateInput = ({ label, id, value, onChange }: DateInputProps) => {
  // Format value to a string that the date input expects (YYYY-MM-DD)
  const getFormattedValue = (): string => {
    if (!value) return "";
    
    if (typeof value === 'object' && 'toISOString' in value) {
      return value.toISOString().split('T')[0];
    }
    
    return String(value);
  };
  
  const dateValue = getFormattedValue();
    
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
