
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface NotesInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NotesInput = ({ value, onChange }: NotesInputProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="notes" className="text-right">
        Notes
      </Label>
      <Input
        id="notes"
        value={value}
        onChange={onChange}
        className="col-span-3"
        placeholder="Optional notes"
      />
    </div>
  );
};

export default NotesInput;
