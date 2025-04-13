
import { useState } from 'react';
import { parseResidentsCsv } from '@/utils/residents/csvUtils';
import { prepareResidentData } from '@/utils/residents/dateUtils';
import { useImportValidation } from '@/hooks/residents/useImportValidation';

/**
 * Hook for handling file import operations
 */
export const useFileHandler = ({
  isApartmentOccupied,
  setIsImporting,
  setImportErrors,
  setImportSuccess,
  onImportStart,
  processImportedResidents
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { batchValidateRows, handleValidationErrors } = useImportValidation();

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'csv' && fileExtension !== 'tsv' && fileExtension !== 'txt') {
        setImportErrors(['Invalid file type. Please upload a CSV or TSV file.']);
        return;
      }

      // Reset states
      onImportStart();
      setIsImporting(true);
      setIsProcessing(true);

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          if (!text) {
            setImportErrors(['Error reading file: Empty content']);
            setIsImporting(false);
            setIsProcessing(false);
            return;
          }

          console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);
          
          // Parse CSV data
          const { values, errors } = parseResidentsCsv(text);
          
          if (errors.length > 0) {
            // Direct assignment instead of functional update
            setImportErrors(errors);
            setIsImporting(false);
            setIsProcessing(false);
            return;
          }

          if (values.length === 0) {
            // Direct assignment instead of functional update
            setImportErrors(['No valid data found in file']);
            setIsImporting(false);
            setIsProcessing(false);
            return;
          }

          // Validate row data
          const { validRows, validationErrors } = batchValidateRows(values);
          
          if (handleValidationErrors(
            validationErrors, 
            setImportErrors, 
            setIsImporting, 
            setIsProcessing
          )) {
            return;
          }

          // Track which locations (block-apartment) are already occupied
          const occupiedLocations: Record<string, string> = {};
          
          // First, pre-check for any location conflicts
          for (const row of validRows) {
            const blockName = row[2];
            const apartmentNumber = row[3];
            
            if (blockName && apartmentNumber) {
              const locationKey = `${blockName}-${apartmentNumber}`;
              if (isApartmentOccupied(blockName, apartmentNumber)) {
                const residentName = row[0];
                // Direct assignment instead of functional update
                setImportErrors([
                  `Cannot add ${residentName}: Block ${blockName}, Apartment ${apartmentNumber} is already occupied`
                ]);
                setIsImporting(false);
                setIsProcessing(false);
                return;
              }
            }
          }

          // Process valid rows
          const successCount = await processImportedResidents(validRows, occupiedLocations);
          setImportSuccess(successCount);
        } catch (error) {
          console.error("Error processing file content:", error);
          // Direct assignment instead of functional update
          setImportErrors([`Error processing file: ${error instanceof Error ? error.message : String(error)}`]);
        } finally {
          setIsProcessing(false);
          setIsImporting(false);
        }
      };

      reader.onerror = () => {
        console.error("FileReader error:", reader.error);
        // Direct assignment instead of functional update
        setImportErrors([`Error reading file: ${reader.error?.message || 'Unknown error'}`]);
        setIsImporting(false);
        setIsProcessing(false);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("File handling error:", error);
      // Direct assignment instead of functional update
      setImportErrors([`Error handling file: ${error instanceof Error ? error.message : String(error)}`]);
      setIsImporting(false);
      setIsProcessing(false);
    }
  };

  return { handleFileChange, isProcessing };
};
