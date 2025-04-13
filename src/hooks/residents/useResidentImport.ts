
import { useState } from 'react';
import { ResidentFormData } from '@/services/residents/types';
import { useImportFile } from '@/hooks/residents/useImportFile';
import { useResidentProcessing } from '@/hooks/residents/useResidentProcessing';
import { useApartmentCreation } from '@/hooks/residents/useApartmentCreation';

interface UseResidentImportProps {
  months: { value: string; label: string }[];
  isApartmentOccupied: (blockNumber: string, apartmentNumber: string, excludeResidentId?: string) => boolean;
  resetForm: () => void;
  setCurrentResident: (resident: Partial<ResidentFormData>) => void;
  handleAddResident: () => Promise<boolean>;
  refreshData: () => void | Promise<void>;
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
  
  const {
    importErrors,
    setImportErrors,
    importSuccess,
    setImportSuccess,
    processImportedResidents,
    onImportStart
  } = useResidentProcessing({
    resetForm,
    setCurrentResident,
    handleAddResident,
    fetchResidents,
    refreshData: async () => {
      // Convert void | Promise<void> to Promise<void>
      if (refreshData) {
        const result = refreshData();
        if (result instanceof Promise) {
          await result;
        }
      }
    },
    months
  });

  const { handleImportClick } = useImportFile({
    isApartmentOccupied,
    setIsImporting,
    setImportErrors,
    setImportSuccess,
    onImportStart,
    processImportedResidents
  });

  const { 
    isCreatingApartments,
    handleCreateMissingApartments
  } = useApartmentCreation({
    refreshData: async () => {
      // Convert void | Promise<void> to Promise<void>
      if (refreshData) {
        const result = refreshData();
        if (result instanceof Promise) {
          await result;
        }
      }
    },
    fetchResidents,
    importErrors
  });

  return {
    isImporting,
    importErrors,
    importSuccess,
    handleImportClick,
    handleCreateMissingApartments,
    isCreatingApartments
  };
};
