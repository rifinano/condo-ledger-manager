
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface MoveInDateSelectorProps {
  moveInMonth: string;
  moveInYear: string;
  months: { value: string; label: string }[];
  years: string[];
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

const MoveInDateSelector = ({ 
  moveInMonth, 
  moveInYear, 
  months, 
  years,
  onMonthChange,
  onYearChange
}: MoveInDateSelectorProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">
        Move-in Date*
      </Label>
      <div className="col-span-3 flex gap-2">
        <Select 
          value={moveInMonth} 
          onValueChange={onMonthChange}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map(month => (
              <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={moveInYear} 
          onValueChange={onYearChange}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {years.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MoveInDateSelector;
