
import { useState } from 'react';
import { ResidentFormData } from '@/services/residents/types';
import { parseResidentsCsv } from '@/utils/residents/csvUtils';

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
          const [fullName, phoneNumber, blockNumber, apartmentNumber, moveInMonthName, moveInYear] = row;
          
          // Check if this exact location (block AND apartment) is already occupied
          if (isApartmentOccupied(blockNumber, apartmentNumber)) {
            importErrors.push(`Location already occupied: Block ${blockNumber}, Apartment ${apartmentNumber} is already assigned to another resident.`);
            continue;
          }
          
          const moveInMonth = months.find(m => m.label === moveInMonthName)?.value || 
                             (moveInMonthName && !isNaN(parseInt(moveInMonthName)) ? 
                              (parseInt(moveInMonthName) < 10 ? `0${parseInt(moveInMonthName)}` : `${parseInt(moveInMonthName)}`) : 
                              undefined);
          
          const residentData = {
            full_name: fullName,
            phone_number: phoneNumber,
            block_number: blockNumber,
            apartment_number: apartmentNumber,
            move_in_month: moveInMonth,
            move_in_year: moveInYear
          };
          
          try {
            resetForm();
            setCurrentResident(residentData);
            const result = await handleAddResident();
            if (result) {
              successCount++;
            } else {
              importErrors.push(`Failed to add resident: ${fullName} at Block ${blockNumber}, Apartment ${apartmentNumber}`);
            }
          } catch (error) {
            console.error("Error adding resident:", error);
            const errorMsg = error instanceof Error ? error.message : String(error);
            let errorDisplay = `Error adding resident: ${fullName} at Block ${blockNumber}, Apartment ${apartmentNumber}`;
            
            // Check for specific database constraint error messages
            if (errorMsg.includes("duplicate key") && errorMsg.includes("residents_block_number_apartment_number_key")) {
              errorDisplay = `Location already occupied: Block ${blockNumber}, Apartment ${apartmentNumber} is already assigned to another resident.`;
            } else {
              errorDisplay += ` - ${errorMsg}`;
            }
            
            importErrors.push(errorDisplay);
          }
        }
        
        setImportSuccess(successCount);
        setImportErrors(importErrors);
        
        if (successCount > 0) {
          await fetchResidents();
          refreshData();
        }
      } catch (error) {
        console.error("Error processing import:", error);
        setImportErrors([`Error processing file: ${error instanceof Error ? error.message : String(error)}`]);
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
