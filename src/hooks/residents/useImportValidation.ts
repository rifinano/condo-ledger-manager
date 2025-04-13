
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
    if (row.length < 3) {
      return `Invalid row format: ${row.join(', ')}. Not enough columns.`;
    }
    
    // Default position for expected columns
    let fullNameIndex = 0;
    let blockNumberIndex = 2;
    let apartmentNumberIndex = 3;
    
    // If row has exactly 3 columns, assume they are Name, Block, Apartment
    if (row.length === 3) {
      fullNameIndex = 0;
      blockNumberIndex = 1;
      apartmentNumberIndex = 2;
    }
    
    // Try to detect which column is which if standard positions don't have values
    if (!row[fullNameIndex]?.trim()) {
      // Look for a non-empty column that doesn't look like a block or apartment
      for (let i = 0; i < row.length; i++) {
        if (row[i]?.trim() && 
            !row[i].toLowerCase().includes('block') && 
            !row[i].match(/^\d+$/) &&
            i !== blockNumberIndex && 
            i !== apartmentNumberIndex) {
          fullNameIndex = i;
          break;
        }
      }
    }
    
    if (!row[blockNumberIndex]?.trim() || !row[blockNumberIndex].toLowerCase().includes('block')) {
      // Look for a column containing "block"
      for (let i = 0; i < row.length; i++) {
        if (row[i]?.trim() && row[i].toLowerCase().includes('block')) {
          blockNumberIndex = i;
          break;
        }
      }
    }
    
    if (!row[apartmentNumberIndex]?.trim() || isNaN(Number(row[apartmentNumberIndex]))) {
      // Look for a column containing just numbers, likely to be apartment number
      for (let i = 0; i < row.length; i++) {
        if (row[i]?.trim() && row[i].match(/^\d+$/) && i !== blockNumberIndex) {
          apartmentNumberIndex = i;
          break;
        }
      }
    }
    
    const fullName = row[fullNameIndex]?.trim();
    const blockNumber = row[blockNumberIndex]?.trim();
    const apartmentNumber = row[apartmentNumberIndex]?.trim();
    
    if (!fullName) {
      return `Missing resident name in row: ${row.join(', ')}`;
    }
    
    if (!blockNumber) {
      return `Missing block number for resident ${fullName}`;
    }
    
    if (!apartmentNumber) {
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
      
      if (validationErrors.length > 3) {
        // Only show a summary if there are many errors
        toast({
          title: "Import validation failed",
          description: `${validationErrors.length} rows contain invalid data`,
          variant: "destructive"
        });
      } else {
        // Show the specific error if there are only a few
        toast({
          title: "Import validation failed",
          description: validationErrors[0],
          variant: "destructive"
        });
      }
      
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
