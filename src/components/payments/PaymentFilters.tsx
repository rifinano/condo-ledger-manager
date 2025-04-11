
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface PaymentFiltersProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedBlock: string;
  setSelectedBlock: (block: string) => void;
  years: string[];
  months: { value: string; label: string }[];
  blocks: string[];
}

const PaymentFilters = ({ 
  selectedYear, 
  setSelectedYear, 
  selectedMonth, 
  setSelectedMonth, 
  selectedBlock, 
  setSelectedBlock,
  years,
  months,
  blocks
}: PaymentFiltersProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedYear} onValueChange={setSelectedYear}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map(year => (
            <SelectItem key={year} value={year}>{year}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map(month => (
            <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={selectedBlock} onValueChange={setSelectedBlock}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Block" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Blocks</SelectItem>
          {blocks.filter(block => block !== "all").map(block => (
            <SelectItem key={block} value={block}>{block}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaymentFilters;
