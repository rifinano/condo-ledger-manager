
import { useState } from 'react';
import { ResidentFormData } from '@/services/residents/types';
import { parseResidentsCsv } from '@/utils/residents/csvUtils';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleImportClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";
    fileInput.onchange = handleFileChange;
    fileInput.click();
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    
    const file = target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      setIsImporting(true);
      setImportErrors([]);
      setImportSuccess(0);
      
      try {
        const content = e.target?.result as string;
        const { values, errors } = parseResidentsCsv(content);
        
        if (errors.length > 0) {
          setImportErrors(errors);
          setIsImporting(false);
          return;
        }
        
        const importErrors: string[] = [];
        let successCount = 0;
        
        for (const row of values) {
          try {
            // Handle missing columns by ensuring we have data for all required fields
            if (row.length < 4) {
              importErrors.push(`Invalid row format: ${row.join(', ')}. Not enough columns.`);
              continue;
            }
            
            const [fullName, phoneNumber, blockNumber, apartmentNumber, moveInMonthName, moveInYear] = row;
            
            if (!fullName || !blockNumber || !apartmentNumber) {
              importErrors.push(`Missing required data for: ${fullName || 'Unknown'} at Block ${blockNumber || 'Unknown'}, Apartment ${apartmentNumber || 'Unknown'}`);
              continue;
            }
            
            // Check if this exact location (block AND apartment) is already occupied
            if (isApartmentOccupied(blockNumber, apartmentNumber)) {
              importErrors.push(`Location already occupied: Block ${blockNumber}, Apartment ${apartmentNumber} is already assigned to another resident.`);
              continue;
            }
            
            // Find the month value that matches the name
            const moveInMonth = months.find(m => m.label === moveInMonthName)?.value || 
                              (moveInMonthName && !isNaN(parseInt(moveInMonthName)) ? 
                                (parseInt(moveInMonthName) < 10 ? `0${parseInt(moveInMonthName)}` : `${parseInt(moveInMonthName)}`) : 
                                undefined);
            
            const residentData = {
              full_name: fullName,
              phone_number: phoneNumber || '',
              block_number: blockNumber,
              apartment_number: apartmentNumber,
              move_in_month: moveInMonth,
              move_in_year: moveInYear
            };
            
            resetForm();
            setCurrentResident(residentData);
            const result = await handleAddResident();
            
            if (result) {
              successCount++;
            } else {
              importErrors.push(`Failed to add resident: ${fullName} at Block ${blockNumber}, Apartment ${apartmentNumber}`);
            }
          } catch (error) {
            console.error("Error processing row:", row, error);
            const errorMsg = error instanceof Error ? error.message : String(error);
            importErrors.push(`Error processing resident: ${row[0] || 'Unknown'} - ${errorMsg}`);
          }
        }
        
        setImportSuccess(successCount);
        setImportErrors(importErrors);
        
        if (successCount > 0) {
          // Make sure to refresh the data after successful imports
          await fetchResidents();
          refreshData();
          
          toast({
            title: "Import Summary",
            description: `Successfully imported ${successCount} resident${successCount !== 1 ? 's' : ''}. ${importErrors.length > 0 ? `Failed to import ${importErrors.length} resident(s).` : ''}`,
            variant: importErrors.length > 0 ? "destructive" : "default"
          });
        } else if (importErrors.length > 0) {
          toast({
            title: "Import Failed",
            description: `Failed to import residents. Please check the error details.`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error processing import:", error);
        setImportErrors([`Error processing file: ${error instanceof Error ? error.message : String(error)}`]);
        
        toast({
          title: "Import Error",
          description: "An error occurred while processing the import file.",
          variant: "destructive"
        });
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.readAsText(file);
  };

  return {
    isImporting,
    importErrors,
    importSuccess,
    handleImportClick
  };
};
