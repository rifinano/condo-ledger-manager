
import { Dispatch, SetStateAction } from 'react';
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Resident } from "@/services/payments/types";

interface ResidentSelectProps {
  value: string;
  onChange: (value: string) => void;
  residents: Resident[];
}

const ResidentSelect = ({ value, onChange, residents }: ResidentSelectProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="resident" className="text-right">
        Resident
      </Label>
      <Select 
        value={value} 
        onValueChange={onChange}
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
  );
};

export default ResidentSelect;
