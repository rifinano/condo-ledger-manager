
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateInput = ({ label, id, value, onChange }: DateInputProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Input
        id={id}
        type="date"
        value={value}
        onChange={onChange}
        className="col-span-3"
      />
    </div>
  );
};

export default DateInput;
