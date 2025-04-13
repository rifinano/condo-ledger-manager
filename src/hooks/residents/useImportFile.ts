
import { useFileHandler } from './useFileHandler';

interface UseImportFileProps {
  isApartmentOccupied: (blockNumber: string, apartmentNumber: string) => boolean;
  setIsImporting: (isImporting: boolean) => void;
  setImportErrors: (errors: string[]) => void;
  setImportSuccess: (count: number) => void;
  onImportStart: () => void;
  processImportedResidents: (values: string[][], occupiedLocations: Record<string, string>) => Promise<number>;
}

/**
 * Hook for handling the file import workflow
 */
export const useImportFile = (props: UseImportFileProps) => {
  const { handleFileChange } = useFileHandler(props);

  /**
   * Trigger the file selection dialog
   */
  const handleImportClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";
    fileInput.onchange = handleFileChange;
    fileInput.click();
  };

  return { handleImportClick };
};
