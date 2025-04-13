
import { useState, useCallback } from 'react';
import { ResidentFormData } from '@/services/residents/types';
import { useToast } from '@/hooks/use-toast';
import { useImportFile } from '@/hooks/residents/useImportFile';
import { 
  prepareResidentData, 
  doesBlockExist, 
  doesApartmentExist, 
  getMissingApartments 
} from '@/utils/residents/importUtils';
import { supabase } from '@/integrations/supabase/client';

interface UseResidentImportProps {
  months: { value: string; label: string }[];
  isApartmentOccupied: (blockNumber: string, apartmentNumber: string) => boolean;
  resetForm: () => void;
  setCurrentResident: (resident: Partial<ResidentFormData>) => void;
  handleAddResident: () => Promise<boolean>;
  refreshData: () => void;
  fetchResidents: () => Promise<void>;
}

export const useResidentImport = ({
  months,
  isApartmentOccupied,
  resetForm,
  setCurrentResident,
  handleAddResident,
  refreshData,
  fetchResidents
}: UseResidentImportProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(0);
  const [isCreatingApartments, setIsCreatingApartments] = useState(false);
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
      refreshData();
      
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

  const { handleImportClick } = useImportFile({
    isApartmentOccupied,
    setIsImporting,
    setImportErrors,
    setImportSuccess,
    onImportStart,
    processImportedResidents
  });

  // Function to create missing apartments
  const handleCreateMissingApartments = useCallback(async (blockName: string, apartmentNumbers: string[]) => {
    if (isCreatingApartments) return;
    setIsCreatingApartments(true);

    try {
      // Get the block ID
      const { data: block, error: blockError } = await supabase
        .from('blocks')
        .select('id')
        .eq('name', blockName)
        .maybeSingle();
      
      if (blockError || !block) {
        throw new Error(`Block ${blockName} not found`);
      }

      // Create a batch of apartments
      const newApartments = apartmentNumbers.map(number => ({
        block_id: block.id.toString(),
        number,
        floor: Math.ceil(parseInt(number) / 4), // Calculate floor based on apartment number
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('apartments')
        .insert(newApartments)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Apartments Created",
        description: `Successfully created ${data.length} apartments in Block ${blockName}`,
      });

      // Clear the errors related to these apartments
      setImportErrors(prev => 
        prev.filter(error => !apartmentNumbers.some(apt => 
          error.includes(`Apartment ${apt} does not exist in Block ${blockName}`)
        ))
      );

      // Refresh data and trigger a retry of the import
      await refreshData();
      await fetchResidents();

      // If there are any residents waiting to be imported to the newly created apartments, 
      // suggest to the user to try the import again
      if (importErrors.some(error => 
        error.includes(`Apartment`) && 
        error.includes(`does not exist in Block ${blockName}`) &&
        apartmentNumbers.some(apt => error.includes(`Apartment ${apt}`))
      )) {
        toast({
          title: "Ready to Import",
          description: `Apartments have been created. Please try importing your CSV file again.`,
        });
      }

    } catch (error) {
      console.error("Error creating apartments:", error);
      toast({
        title: "Error Creating Apartments",
        description: error instanceof Error ? error.message : "Failed to create apartments",
        variant: "destructive"
      });
    } finally {
      setIsCreatingApartments(false);
    }
  }, [isCreatingApartments, refreshData, fetchResidents, toast, importErrors]);

  return {
    isImporting,
    importErrors,
    importSuccess,
    handleImportClick,
    handleCreateMissingApartments,
    isCreatingApartments
  };
};
