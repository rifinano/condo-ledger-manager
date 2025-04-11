
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ResidentsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ResidentsSearch = ({
  searchTerm,
  onSearchChange,
}: ResidentsSearchProps) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search residents..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default ResidentsSearch;
