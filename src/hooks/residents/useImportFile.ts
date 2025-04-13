
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

  const handleFileChange = async (event: Event) => {
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
        
        // Batch validation for better performance
        const validationErrors: string[] = [];
        const validRows: string[][] = [];
        
        // First pass - validate all rows
        for (const row of values) {
          const validationError = validateCsvRow(row);
          if (validationError) {
            validationErrors.push(validationError);
          } else {
            validRows.push(row);
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
        const importErrors = detectImportConflicts(validRows);
        
        // Efficiently check for occupied locations
        const occupiedLocations: Record<string, string> = {};
        const locationCheckPromises: Promise<void>[] = [];
        
        for (const row of validRows) {
          const [, , blockNumber, apartmentNumber] = row;
          
          if (isApartmentOccupied(blockNumber, apartmentNumber)) {
            const locationKey = `${blockNumber}-${apartmentNumber}`;
            
            // Create a promise to get resident details
            const checkPromise = async () => {
              const existingResidentDetails = await getExistingResidentDetails(blockNumber, apartmentNumber);
              occupiedLocations[locationKey] = existingResidentDetails;
              
              const locationError = `Location already occupied: Block ${blockNumber}, Apartment ${apartmentNumber} occupied by ${existingResidentDetails}`;
              if (!importErrors.includes(locationError)) {
                importErrors.push(locationError);
              }
            };
            
            locationCheckPromises.push(checkPromise());
          }
        }
        
        // Wait for all location checks to complete
        await Promise.all(locationCheckPromises);
        
        // Update errors first to show conflicts
        setImportErrors(importErrors);
        
        // Process the import if there are rows left to process
        if (validRows.length > 0) {
          const successCount = await processImportedResidents(validRows, occupiedLocations);
          setImportSuccess(successCount);
        } else {
          setImportSuccess(0);
        }
        
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
