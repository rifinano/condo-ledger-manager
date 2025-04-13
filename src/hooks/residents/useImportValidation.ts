
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for validating imported CSV resident data
 */
export const useImportValidation = () => {
  const { toast } = useToast();

  /**
   * Validates a CSV row for required fields
   */
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

  /**
   * Batch validation for CSV rows
   */
  const batchValidateRows = (values: string[][]): { 
    validRows: string[][], 
    validationErrors: string[] 
  } => {
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

    return { validRows, validationErrors };
  };

  /**
   * Handle validation errors by showing a toast and setting error state
   */
  const handleValidationErrors = (
    validationErrors: string[],
    setImportErrors: (errors: string[]) => void,
    setIsImporting: (isImporting: boolean) => void,
    setIsProcessing: (isProcessing: boolean) => void
  ) => {
    if (validationErrors.length > 0) {
      setImportErrors(validationErrors);
      toast({
        title: "Import validation failed",
        description: `${validationErrors.length} rows contain invalid data`,
        variant: "destructive"
      });
      setIsImporting(false);
      setIsProcessing(false);
      return true;
    }
    
    return false;
  };

  return {
    validateCsvRow,
    batchValidateRows,
    handleValidationErrors
  };
};
