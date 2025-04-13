
import { useState } from 'react';
import { parseResidentsCsv } from '@/utils/residents/csvUtils';
import { detectImportConflicts, getExistingResidentDetails } from '@/utils/residents/importUtils';
import { useToast } from '@/hooks/use-toast';

interface UseImportFileProps {
  isApartmentOccupied: (blockNumber: string, apartmentNumber: string) => boolean;
  setIsImporting: (isImporting: boolean) => void;
  setImportErrors: (errors: string[]) => void;
  setImportSuccess: (count: number) => void;
  onImportStart: () => void;
  processImportedResidents: (values: string[][], occupiedLocations: Record<string, string>) => Promise<number>;
}

export const useImportFile = ({
  isApartmentOccupied,
  setIsImporting,
  setImportErrors,
  setImportSuccess,
  onImportStart,
  processImportedResidents
}: UseImportFileProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleImportClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";
    fileInput.onchange = handleFileChange;
    fileInput.click();
  };

  const validateCsvRow = (row: string[]): string | null => {
    if (row.length < 4) {
      return `Invalid row format: ${row.join(', ')}. Not enough columns.`;
    }
    
    const [fullName, , blockNumber, apartmentNumber] = row;
    
    if (!fullName?.trim()) {
      return `Missing resident name in row: ${row.join(', ')}`;
    }
    
    if (!blockNumber?.trim()) {
      return `Missing block number for resident ${fullName}`;
    }
    
    if (!apartmentNumber?.trim()) {
      return `Missing apartment number for resident ${fullName} in block ${blockNumber}`;
    }
    
    return null;
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    
    const file = target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      if (isProcessing) return;
      setIsProcessing(true);
      
      onImportStart();
      setIsImporting(true);
      
      try {
        const content = e.target?.result as string;
        const { values, errors } = parseResidentsCsv(content);
        
        if (errors.length > 0) {
          setImportErrors(errors);
          setIsImporting(false);
          setIsProcessing(false);
          return;
        }
        
        // Pre-validate all rows and collect validation errors
        const validationErrors: string[] = [];
        for (const row of values) {
          const validationError = validateCsvRow(row);
          if (validationError) {
            validationErrors.push(validationError);
          }
        }
        
        if (validationErrors.length > 0) {
          setImportErrors(validationErrors);
          toast({
            title: "Import validation failed",
            description: `${validationErrors.length} rows contain invalid data`,
            variant: "destructive"
          });
          setIsImporting(false);
          setIsProcessing(false);
          return;
        }
        
        // Detect conflicts in the import batch
        const importErrors = detectImportConflicts(values);
        
        // Check for existing residents in locations
        const occupiedLocations: Record<string, string> = {};
        
        for (const row of values) {
          if (row.length < 4) continue;
          
          const [, , blockNumber, apartmentNumber] = row;
          if (!blockNumber || !apartmentNumber) continue;
          
          if (isApartmentOccupied(blockNumber, apartmentNumber)) {
            const locationKey = `${blockNumber}-${apartmentNumber}`;
            const existingResidentDetails = await getExistingResidentDetails(blockNumber, apartmentNumber);
            occupiedLocations[locationKey] = existingResidentDetails;
            
            const locationError = `Location already occupied: Block ${blockNumber}, Apartment ${apartmentNumber} occupied by ${existingResidentDetails}`;
            if (!importErrors.includes(locationError)) {
              importErrors.push(locationError);
            }
          }
        }
        
        // Update errors first to show conflicts
        setImportErrors(importErrors);
        
        // Process the import
        const successCount = await processImportedResidents(values, occupiedLocations);
        setImportSuccess(successCount);
        
      } catch (error) {
        console.error("Error processing import:", error);
        setImportErrors([`Error processing file: ${error instanceof Error ? error.message : String(error)}`]);
        toast({
          title: "Import failed",
          description: "An error occurred while processing the import file",
          variant: "destructive"
        });
      } finally {
        setIsImporting(false);
        setIsProcessing(false);
      }
    };
    
    reader.readAsText(file);
  };

  return { handleImportClick };
};
