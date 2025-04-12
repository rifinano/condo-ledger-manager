
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApartmentsPaginationProps {
  totalCount: number;
  showAll: boolean;
  onToggle: () => void;
}

const ApartmentsPagination: React.FC<ApartmentsPaginationProps> = ({
  totalCount,
  showAll,
  onToggle
}) => {
  if (totalCount <= 5) {
    return null;
  }

  return (
    <div className="mt-4 text-center">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onToggle}
        className="text-syndicate-600"
      >
        {showAll ? (
          <>
            <ChevronUp className="h-4 w-4 mr-1" /> 
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4 mr-1" /> 
            Show All {totalCount} Apartments
          </>
        )}
      </Button>
    </div>
  );
};

export default ApartmentsPagination;
