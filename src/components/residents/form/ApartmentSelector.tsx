
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ApartmentSelectorProps {
  blockNumber: string;
  apartmentNumber: string;
  getApartments: (block: string) => string[];
  isApartmentOccupied?: (blockNumber: string, apartmentNumber: string, excludeResidentId?: string) => boolean;
  currentResidentId?: string;
  onChange: (value: string) => void;
}

const ApartmentSelector = ({ 
  blockNumber, 
  apartmentNumber, 
  getApartments, 
  isApartmentOccupied, 
  currentResidentId,
  onChange 
}: ApartmentSelectorProps) => {
  const [apartmentError, setApartmentError] = useState<string | null>(null);
  
  // Check if apartment is occupied when blockNumber or apartmentNumber changes
  useEffect(() => {
    if (blockNumber && apartmentNumber && isApartmentOccupied) {
      const isOccupied = isApartmentOccupied(
        blockNumber, 
        apartmentNumber, 
        currentResidentId
      );
      
      if (isOccupied) {
        setApartmentError(`This apartment is already occupied by another resident.`);
      } else {
        setApartmentError(null);
      }
    }
  }, [blockNumber, apartmentNumber, isApartmentOccupied, currentResidentId]);

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="apartment" className="text-right">
        Apartment*
      </Label>
      <div className="col-span-3 space-y-2">
        <Select 
          value={apartmentNumber} 
          onValueChange={onChange}
          disabled={!blockNumber}
        >
          <SelectTrigger className={apartmentError ? "border-red-500" : ""}>
            <SelectValue placeholder="Select an apartment" />
          </SelectTrigger>
          <SelectContent>
            {blockNumber && getApartments(blockNumber).map(apt => (
              <SelectItem key={apt} value={apt}>{apt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {apartmentError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2 text-xs">
              {apartmentError}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ApartmentSelector;
