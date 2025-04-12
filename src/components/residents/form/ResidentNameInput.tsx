
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResidentNameInputProps {
  fullName: string;
  onChange: (value: string) => void;
}

const ResidentNameInput = ({ fullName, onChange }: ResidentNameInputProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="fullName" className="text-right">
        Full Name*
      </Label>
      <Input
        id="fullName"
        value={fullName}
        onChange={(e) => onChange(e.target.value)}
        className="col-span-3"
        placeholder="Enter resident's full name"
        required
      />
    </div>
  );
};

export default ResidentNameInput;
