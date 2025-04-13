
import { useState } from 'react';
import { parseResidentsCsv } from '@/utils/residents/csvUtils';
import { useToast } from '@/hooks/use-toast';
import { useImportValidation } from './useImportValidation';
import { useImportConflictDetection } from './useImportConflictDetection';

interface UseFileHandlerProps {
  isApartmentOccupied: (blockNumber: string, apartmentNumber: string) => boolean;
  setIsImporting: (isImporting: boolean) => void;
  setImportErrors: (errors: string[]) => void;
  setImportSuccess: (count: number) => void;
  onImportStart: () => void;
  processImportedResidents: (values: string[][], occupiedLocations: Record<string, string>) => Promise<number>;
}

/**
 * Hook for handling file upload and processing
 */
export const useFileHandler = ({
  isApartmentOccupied,
  setIsImporting,
  setImportErrors,
  setImportSuccess,
  onImportStart,
  processImportedResidents
}: UseFileHandlerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { batchValidateRows, handleValidationErrors } = useImportValidation();
  const { detectAllConflicts } = useImportConflictDetection();

  /**
   * Process the CSV file content
   */
  const processFileContent = async (content: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    onImportStart();
    setIsImporting(true);
    
    try {
      // Parse the CSV content
      const { values, errors } = parseResidentsCsv(content);
      
      if (errors.length > 0) {
        setImportErrors(errors);
        setIsImporting(false);
        setIsProcessing(false);
        return;
      }
      
      // Validate the rows
      const { validRows, validationErrors } = batchValidateRows(values);
      
      // Handle validation errors if any
      if (handleValidationErrors(validationErrors, setImportErrors, setIsImporting, setIsProcessing)) {
        return;
      }
      
      // Detect conflicts
      const { importErrors, occupiedLocations } = await detectAllConflicts(validRows, isApartmentOccupied);
      
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

  /**
   * Handle file input change event
   */
  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    
    const file = target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      await processFileContent(content);
    };
    
    reader.readAsText(file);
  };

  return {
    handleFileChange,
    isProcessing
  };
};
