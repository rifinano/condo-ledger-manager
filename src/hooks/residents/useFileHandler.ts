
import { useState } from 'react';
import { parseResidentsCsv } from '@/utils/residents/csvUtils';
import { useToast } from '@/hooks/use-toast';
import { useImportValidation } from './useImportValidation';
import { useImportConflictDetection } from './useImportConflictDetection';
import { useNetworkErrorHandler } from '@/hooks/useNetworkErrorHandler';

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
  const { detectAllConflicts, isCheckingConflicts } = useImportConflictDetection();
  const { handleNetworkError } = useNetworkErrorHandler();

  /**
   * Process the CSV file content
   */
  const processFileContent = async (content: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    onImportStart();
    setIsImporting(true);
    
    try {
      // Parse the CSV content with error handling
      const { values, errors } = parseResidentsCsv(content);
      
      if (errors.length > 0) {
        setImportErrors(errors);
        setIsImporting(false);
        setIsProcessing(false);
        return;
      }
      
      // Check if we have any rows to process
      if (values.length === 0) {
        setImportErrors(["No valid data found in the file"]);
        setIsImporting(false);
        setIsProcessing(false);
        return;
      }
      
      // Validate the rows
      const { validRows, validationErrors } = batchValidateRows(values);
      
      // Handle validation errors if any
      if (validationErrors.length > 0) {
        setImportErrors(validationErrors);
        
        // If we still have some valid rows, we can continue
        if (validRows.length === 0) {
          setIsImporting(false);
          setIsProcessing(false);
          return;
        }
      }
      
      // Detect conflicts with robust error handling
      try {
        const { importErrors, occupiedLocations } = await detectAllConflicts(validRows, isApartmentOccupied);
        
        // Update errors first to show conflicts
        const combinedErrors = [...validationErrors, ...importErrors];
        setImportErrors(combinedErrors);
        
        // Process the import if there are rows left to process
        if (validRows.length > 0) {
          try {
            const successCount = await processImportedResidents(validRows, occupiedLocations);
            setImportSuccess(successCount);
            
            if (successCount > 0) {
              toast({
                title: "Import Successful",
                description: `Successfully imported ${successCount} resident${successCount !== 1 ? 's' : ''}.`,
                variant: "default"
              });
            }
          } catch (processError) {
            console.error("Error processing residents:", processError);
            handleNetworkError(processError, "Failed to process some residents");
            // We still want to show any partial successes that occurred
            setImportSuccess(0);
          }
        } else {
          setImportSuccess(0);
        }
      } catch (conflictError) {
        console.error("Fatal error detecting conflicts:", conflictError);
        handleNetworkError(conflictError, "Failed to check for conflicts");
        const errorMessage = "Failed to check for conflicts due to a connection error. Please try again.";
        setImportErrors([...validationErrors, errorMessage]);
        setImportSuccess(0);
      }
    } catch (error) {
      console.error("Error processing import:", error);
      handleNetworkError(error, "An error occurred while processing the import file");
      setImportErrors([`Error processing file: ${error instanceof Error ? error.message : String(error)}`]);
    } finally {
      setIsImporting(false);
      setIsProcessing(false);
    }
  };

  /**
   * Handle file input change event with error handling
   */
  const handleFileChange = (event: Event) => {
    try {
      const target = event.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) {
        toast({
          title: "Import Error",
          description: "No file selected",
          variant: "destructive"
        });
        return;
      }
      
      const file = target.files[0];
      
      // Validate file size
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Import Error",
          description: "File size exceeds 5MB limit",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file type - allow CSV and TSV
      if (!file.name.toLowerCase().endsWith('.csv') && !file.name.toLowerCase().endsWith('.tsv')) {
        toast({
          title: "Import Error",
          description: "Only CSV and TSV files are supported",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          if (!content) {
            throw new Error("Failed to read file content");
          }
          await processFileContent(content);
        } catch (error) {
          console.error("Error reading file:", error);
          handleNetworkError(error, "Failed to read file");
        }
      };
      
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast({
          title: "Import Error",
          description: "Failed to read the file. Please try again.",
          variant: "destructive"
        });
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error handling file:", error);
      handleNetworkError(error, "An unexpected error occurred while processing the file");
    }
  };

  return {
    handleFileChange,
    isProcessing: isProcessing || isCheckingConflicts
  };
};
