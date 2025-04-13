
import { useState, useCallback } from 'react';
import { ResidentFormData } from '@/services/residents/types';
import { useImportFile } from '@/hooks/residents/useImportFile';
import { useResidentProcessing } from '@/hooks/residents/useResidentProcessing';
import { useApartmentCreation } from '@/hooks/residents/useApartmentCreation';
import { useToast } from '@/hooks/use-toast';

interface UseResidentImportProps {
  months: { value: string; label: string }[];
  isApartmentOccupied: (blockNumber: string, apartmentNumber: string, excludeResidentId?: string) => boolean;
  resetForm: () => void;
  setCurrentResident: (resident: Partial<ResidentFormData>) => void;
  handleAddResident: () => Promise<boolean>;
  refreshData: () => void | Promise<void>;
  fetchResidents: () => Promise<void>;
}

interface FailedImport {
  rowData: string[];
  error: string;
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
  const [failedImports, setFailedImports] = useState<FailedImport[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  const {
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
    months,
    onFailedImport: (rowData: string[], error: string) => {
      setFailedImports(prev => [...prev, { rowData, error }]);
    }
  });

  const { handleImportClick } = useImportFile({
    isApartmentOccupied,
    setIsImporting,
    setImportErrors,
    setImportSuccess,
    onImportStart: () => {
      onImportStart();
      setFailedImports([]);
    },
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

  // New retry function for failed imports
  const handleRetryFailedImports = useCallback(async () => {
    if (failedImports.length === 0 || isRetrying) return;
    
    setIsRetrying(true);
    
    try {
      // Get data rows from failed imports
      const rowsToRetry = failedImports.map(item => item.rowData);
      
      // Clear previous failed imports
      setFailedImports([]);
      
      // Create an empty object as we're retrying based on failed imports, not conflicts
      const emptyOccupiedLocations: Record<string, string> = {};
      
      toast({
        title: "Retry Started",
        description: `Attempting to import ${rowsToRetry.length} failed resident(s)...`,
      });
      
      // Process the previously failed imports
      const successCount = await processImportedResidents(rowsToRetry, emptyOccupiedLocations);
      
      // Update success count
      setImportSuccess(prev => prev + successCount);
      
      if (successCount > 0) {
        toast({
          title: "Retry Successful",
          description: `Successfully imported ${successCount} of ${rowsToRetry.length} resident(s).`,
          variant: successCount === rowsToRetry.length ? "default" : "destructive"
        });
      } else {
        toast({
          title: "Retry Failed",
          description: "Failed to import any residents. Please check the error details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error retrying failed imports:", error);
      toast({
        title: "Retry Error",
        description: "An unexpected error occurred while retrying imports.",
        variant: "destructive"
      });
    } finally {
      setIsRetrying(false);
    }
  }, [failedImports, isRetrying, processImportedResidents, toast]);

  const hasFailedImports = failedImports.length > 0;

  return {
    isImporting,
    importErrors,
    importSuccess,
    handleImportClick,
    handleCreateMissingApartments,
    isCreatingApartments,
    // New retry functionality
    hasFailedImports,
    failedImports,
    handleRetryFailedImports,
    isRetrying
  };
};
