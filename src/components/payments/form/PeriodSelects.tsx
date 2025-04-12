
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface PeriodSelectsProps {
  yearValue: string;
  onYearChange: (value: string) => void;
  monthValue: string;
  onMonthChange: (value: string) => void;
  years: string[];
  months: { value: string; label: string }[];
}

const PeriodSelects = ({ 
  yearValue, 
  onYearChange, 
  monthValue, 
  onMonthChange, 
  years, 
  months 
}: PeriodSelectsProps) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="payment_for_year" className="text-right">
          For Year
        </Label>
        <Select 
          value={yearValue} 
          onValueChange={onYearChange}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="payment_for_month" className="text-right">
          For Month
        </Label>
        <Select 
          value={monthValue} 
          onValueChange={onMonthChange}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default PeriodSelects;
