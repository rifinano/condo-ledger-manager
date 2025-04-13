
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ResidentsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  disabled?: boolean;
  totalResults?: number;
}

const ResidentsSearch = ({
  searchTerm,
  onSearchChange,
  disabled = false,
  totalResults,
}: ResidentsSearchProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Use effect with debounce to prevent excessive search operations
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearchChange(localSearchTerm);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearchChange, searchTerm]);

  // Update local term when prop changes (e.g., when reset)
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search residents..."
        className="pl-8"
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
        disabled={disabled}
        aria-label="Search residents"
      />
      {totalResults !== undefined && (
        <div className="text-xs text-muted-foreground mt-1">
          {totalResults === 0 ? "No results" : `${totalResults} result${totalResults !== 1 ? 's' : ''}`}
        </div>
      )}
    </div>
  );
};

export default ResidentsSearch;
