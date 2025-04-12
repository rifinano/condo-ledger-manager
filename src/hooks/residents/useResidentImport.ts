
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
            
            // Find the month value that matches the name - with enhanced matching
            let moveInMonth: string | undefined;
            
            if (moveInMonthName) {
              // First try to find it by label (case-insensitive)
              moveInMonth = months.find(m => 
                m.label.toLowerCase() === moveInMonthName.toLowerCase())?.value;
              
              if (!moveInMonth) {
                // Try to find by direct value match
                moveInMonth = months.find(m => m.value === moveInMonthName)?.value;
                
                // Check for common month abbreviations (Jan, Feb, etc.)
                if (!moveInMonth) {
                  const monthAbbreviations = {
                    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 
                    'may': '05', 'jun': '06', 'jul': '07', 'aug': '08', 
                    'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
                  };
                  const abbr = moveInMonthName.toLowerCase().substring(0, 3);
                  if (abbr in monthAbbreviations) {
                    moveInMonth = monthAbbreviations[abbr as keyof typeof monthAbbreviations];
                  }
                }
                
                // If still not found, try to parse it as a number
                if (!moveInMonth && !isNaN(parseInt(moveInMonthName))) {
                  const monthNum = parseInt(moveInMonthName);
                  if (monthNum >= 1 && monthNum <= 12) {
                    moveInMonth = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
                  }
                }
              }
            }
            
            const residentData = {
              full_name: fullName,
              phone_number: phoneNumber || '',
              block_number: blockNumber,
              apartment_number: apartmentNumber,
              move_in_month: moveInMonth,
              move_in_year: moveInYear
            };
            
            console.log("Importing resident data:", residentData);
            
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
