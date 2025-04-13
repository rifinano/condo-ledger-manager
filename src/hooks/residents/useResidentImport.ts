import { useState } from 'react';
import { ResidentFormData } from '@/services/residents/types';
import { parseResidentsCsv } from '@/utils/residents/csvUtils';
import { useToast } from '@/hooks/use-toast';
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
        
        const occupiedLocations: Record<string, string> = {};
        
        for (const row of values) {
          if (row.length < 4) continue;
          
          const [, , blockNumber, apartmentNumber] = row;
          if (!blockNumber || !apartmentNumber) continue;
          
          if (isApartmentOccupied(blockNumber, apartmentNumber)) {
            const locationKey = `${blockNumber}-${apartmentNumber}`;
            const existingResidentDetails = await getExistingResidentDetails(blockNumber, apartmentNumber);
            occupiedLocations[locationKey] = existingResidentDetails || "another resident";
          }
        }
        
        const importBatchLocations = new Map<string, string>();
        for (const row of values) {
          if (row.length < 4) continue;
          
          const [fullName, , blockNumber, apartmentNumber] = row;
          if (!blockNumber || !apartmentNumber) continue;
          
          const locationKey = `${blockNumber}-${apartmentNumber}`;
          
          if (importBatchLocations.has(locationKey)) {
            const existingName = importBatchLocations.get(locationKey);
            if (existingName !== fullName) {
              const conflictError = `Conflict in import: Both "${existingName}" and "${fullName}" are being assigned to Block ${blockNumber}, Apartment ${apartmentNumber}`;
              if (!importErrors.includes(conflictError)) {
                importErrors.push(conflictError);
              }
            }
          } else {
            importBatchLocations.set(locationKey, fullName);
          }
        }
        
        for (const row of values) {
          try {
            if (row.length < 4) {
              importErrors.push(`Invalid row format: ${row.join(', ')}. Not enough columns.`);
              continue;
            }
            
            const [fullName, phoneNumber, blockNumber, apartmentNumber, moveInMonthName, moveInYear] = row;
            
            if (!fullName || !blockNumber || !apartmentNumber) {
              importErrors.push(`Missing required data for: ${fullName || 'Unknown'} at Block ${blockNumber || 'Unknown'}, Apartment ${apartmentNumber || 'Unknown'}`);
              continue;
            }
            
            const locationKey = `${blockNumber}-${apartmentNumber}`;
            
            if (locationKey in occupiedLocations) {
              importErrors.push(`Failed to add resident: ${fullName} at Block ${blockNumber}, Apartment ${apartmentNumber} - Location already occupied by ${occupiedLocations[locationKey]}`);
              continue;
            }
            
            let moveInMonth = parseMonth(moveInMonthName, months);
            
            const currentYear = new Date().getFullYear().toString();
            
            const residentData = {
              full_name: fullName,
              phone_number: phoneNumber || '',
              block_number: blockNumber,
              apartment_number: apartmentNumber,
              move_in_month: moveInMonth,
              move_in_year: moveInYear || currentYear
            };
            
            resetForm();
            setCurrentResident(residentData);
            const result = await handleAddResident();
            
            if (result) {
              successCount++;
              occupiedLocations[locationKey] = fullName;
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

  const getExistingResidentDetails = async (blockNumber: string, apartmentNumber: string): Promise<string> => {
    try {
      const { data } = await supabase
        .from('residents')
        .select('full_name')
        .eq('block_number', blockNumber)
        .eq('apartment_number', apartmentNumber)
        .maybeSingle();
      
      return data?.full_name || "another resident";
    } catch (error) {
      console.error("Error fetching existing resident:", error);
      return "another resident";
    }
  };

  const parseMonth = (moveInMonthName: string | undefined, months: { value: string; label: string }[]): string => {
    if (!moveInMonthName) {
      const currentMonth = new Date().getMonth() + 1;
      return currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
    }
    
    const monthByLabel = months.find(m => 
      m.label.toLowerCase() === moveInMonthName.toLowerCase())?.value;
    if (monthByLabel) return monthByLabel;
    
    const monthByValue = months.find(m => m.value === moveInMonthName)?.value;
    if (monthByValue) return monthByValue;
    
    const monthAbbreviations: Record<string, string> = {
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 
      'may': '05', 'jun': '06', 'jul': '07', 'aug': '08', 
      'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
    };
    
    const abbr = moveInMonthName.toLowerCase().substring(0, 3);
    if (abbr in monthAbbreviations) {
      return monthAbbreviations[abbr];
    }
    
    if (!isNaN(parseInt(moveInMonthName))) {
      const monthNum = parseInt(moveInMonthName);
      if (monthNum >= 1 && monthNum <= 12) {
        return monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
      }
    }
    
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
  };

  return {
    isImporting,
    importErrors,
    importSuccess,
    handleImportClick
  };
};
