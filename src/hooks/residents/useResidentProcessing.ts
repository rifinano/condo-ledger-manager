
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ResidentFormData } from '@/services/residents/types';

interface UseResidentProcessingProps {
  resetForm: () => void;
  setCurrentResident: (resident: Partial<ResidentFormData>) => void;
  handleAddResident: () => Promise<boolean>;
  fetchResidents: () => Promise<void>;
  refreshData: () => Promise<void>;
  months: { value: string; label: string }[];
}

export const useResidentProcessing = ({
  resetForm,
  setCurrentResident,
  handleAddResident,
  fetchResidents,
  refreshData,
  months
}: UseResidentProcessingProps) => {
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(0);
  const { toast } = useToast();

  const processImportedResidents = async (
    values: string[][], 
    occupiedLocations: Record<string, string>
  ): Promise<number> => {
    let successCount = 0;
    const processingErrors: string[] = [];
    
    for (const row of values) {
      try {
        if (row.length < 4) {
          processingErrors.push(`Invalid row format: ${row.join(', ')}. Not enough columns.`);
          continue;
        }
        
        const [fullName, , blockNumber, apartmentNumber] = row;
        
        if (!fullName || !blockNumber || !apartmentNumber) {
          processingErrors.push(`Missing required data for: ${fullName || 'Unknown'} at Block ${blockNumber || 'Unknown'}, Apartment ${apartmentNumber || 'Unknown'}`);
          continue;
        }

        // Skip if this location is already marked as occupied
        const locationKey = `${blockNumber}-${apartmentNumber}`;
        if (locationKey in occupiedLocations) {
          processingErrors.push(`Failed to add resident: ${fullName} at Block ${blockNumber}, Apartment ${apartmentNumber} - Location already occupied by ${occupiedLocations[locationKey]}`);
          continue;
        }
        
        // Verify that the block exists
        if (!(await doesBlockExist(blockNumber))) {
          processingErrors.push(`Failed to add resident: ${fullName} - Block "${blockNumber}" does not exist`);
          continue;
        }
        
        // Verify that the apartment exists in the block
        if (!(await doesApartmentExist(blockNumber, apartmentNumber))) {
          processingErrors.push(`Failed to add resident: ${fullName} - Apartment ${apartmentNumber} does not exist in Block ${blockNumber}`);
          continue;
        }
        
        const residentData = prepareResidentData(row, months);
        
        resetForm();
        setCurrentResident(residentData);
        const result = await handleAddResident();
        
        if (result) {
          successCount++;
          occupiedLocations[locationKey] = fullName;
        } else {
          processingErrors.push(`Failed to add resident: ${fullName} at Block ${blockNumber}, Apartment ${apartmentNumber}`);
        }
      } catch (error) {
        console.error("Error processing row:", row, error);
        const errorMsg = error instanceof Error ? error.message : String(error);
        processingErrors.push(`Error processing resident: ${row[0] || 'Unknown'} - ${errorMsg}`);
      }
    }
    
    // Add any processing errors to the import errors
    setImportErrors(prev => [...prev, ...processingErrors]);
    
    if (successCount > 0) {
      await fetchResidents();
      await refreshData();
      
      toast({
        title: "Import Summary",
        description: `Successfully imported ${successCount} resident${successCount !== 1 ? 's' : ''}. ${processingErrors.length > 0 ? `Failed to import ${processingErrors.length} resident(s).` : ''}`,
        variant: processingErrors.length > 0 ? "destructive" : "default"
      });
    } else if (processingErrors.length > 0) {
      toast({
        title: "Import Failed",
        description: `Failed to import residents. Please check the error details.`,
        variant: "destructive"
      });
    }
    
    return successCount;
  };

  const onImportStart = () => {
    setImportErrors([]);
    setImportSuccess(0);
  };

  return {
    importErrors,
    setImportErrors,
    importSuccess,
    setImportSuccess,
    processImportedResidents,
    onImportStart
  };
};

// Import these utility functions from the modular utils files
import { 
  prepareResidentData 
} from '@/utils/residents/dateUtils';

import {
  doesBlockExist, 
  doesApartmentExist 
} from '@/utils/residents/apartmentUtils';
