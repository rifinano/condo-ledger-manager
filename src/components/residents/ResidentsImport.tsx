
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, HomeIcon, XOctagon, AlertTriangle, InfoIcon, Plus } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

interface ResidentsImportProps {
  isImporting: boolean;
  importErrors: string[];
  importSuccess: number;
  onCreateMissingApartments?: (blockName: string, apartments: string[]) => void;
}

const ResidentsImport = ({
  isImporting,
  importErrors,
  importSuccess,
  onCreateMissingApartments
}: ResidentsImportProps) => {
  const { 
    locationErrors, 
    conflictErrors, 
    apartmentErrors,
    blockErrors, 
    otherErrors 
  } = useMemo(() => {
    const locationErrors = importErrors.filter(error => 
      error.includes("Location already occupied:")
    );
    
    const conflictErrors = importErrors.filter(error => 
      error.includes("Conflict in import:")
    );
    
    const apartmentErrors = importErrors.filter(error => 
      error.includes("Apartment") && error.includes("does not exist in Block")
    );
    
    const blockErrors = importErrors.filter(error => 
      error.includes("Block") && error.includes("does not exist")
    );
    
    const otherErrors = importErrors.filter(error => 
      !error.includes("Location already occupied:") && 
      !error.includes("Conflict in import:") &&
      !error.includes("Apartment") && 
      !error.includes("does not exist in Block") &&
      !error.includes("Block") && 
      !error.includes("does not exist")
    );
    
    return { locationErrors, conflictErrors, apartmentErrors, blockErrors, otherErrors };
  }, [importErrors]);
  
  // Organize apartment errors by block
  const apartmentErrorsByBlock = useMemo(() => {
    const errorsByBlock: Record<string, string[]> = {};
    
    apartmentErrors.forEach(error => {
      const match = error.match(/Apartment\s+(\d+)\s+does not exist in Block\s+([^-]+)/);
      if (match) {
        const [, apartmentNumber, blockName] = match;
        if (!errorsByBlock[blockName]) {
          errorsByBlock[blockName] = [];
        }
        if (!errorsByBlock[blockName].includes(apartmentNumber)) {
          errorsByBlock[blockName].push(apartmentNumber);
        }
      }
    });
    
    return errorsByBlock;
  }, [apartmentErrors]);
  
  if (!isImporting && importErrors.length === 0 && importSuccess === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      {isImporting && (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-md">
          <Loader2 className="h-5 w-5 mr-2 animate-spin text-blue-500" />
          <span className="text-blue-700">Importing residents, please wait...</span>
        </div>
      )}
      
      {importSuccess > 0 && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Import Successful</AlertTitle>
          <AlertDescription className="text-green-700">
            Successfully imported {importSuccess} resident{importSuccess !== 1 ? 's' : ''}.
          </AlertDescription>
        </Alert>
      )}
      
      {Object.keys(apartmentErrorsByBlock).length > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Missing Apartments</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p>The following apartments mentioned in your import file don't exist in the database:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {Object.entries(apartmentErrorsByBlock).map(([blockName, apartments]) => (
                <li key={`block-${blockName}`} className="mb-2">
                  <div className="flex items-center justify-between">
                    <span><strong>Block {blockName}:</strong> Apartments {apartments.join(', ')}</span>
                    {onCreateMissingApartments && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="ml-2 text-xs bg-white hover:bg-blue-50"
                        onClick={() => onCreateMissingApartments(blockName, apartments)}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Create Missing Apartments
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm">
              Click the "Create Missing Apartments" button to automatically create these apartments, or modify your import file.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      {blockErrors.length > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <InfoIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Missing Blocks</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p>The following blocks mentioned in your import file don't exist in the database:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {blockErrors.map((error, index) => (
                <li key={`block-error-${index}`}>
                  {error.replace("Failed to add resident: ", "")}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm">
              Please create these blocks in the Properties section first or modify your import file.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      {locationErrors.length > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <HomeIcon className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Location Conflicts</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p>The following locations are already occupied:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {locationErrors.map((error, index) => {
                const locationInfo = error.replace("Location already occupied: ", "");
                return (
                  <li key={`location-conflict-${index}`}>{locationInfo}</li>
                );
              })}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {conflictErrors.length > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Import Conflicts</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p>The following conflicts were found in your import file:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {conflictErrors.map((error, index) => (
                <li key={`import-conflict-${index}`}>{error.replace("Conflict in import: ", "")}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {otherErrors.length > 0 && (
        <Alert className="bg-red-50 border-red-200">
          <XOctagon className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Import Errors</AlertTitle>
          <AlertDescription className="text-red-700">
            <p>The following errors occurred during import:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {otherErrors.map((error, index) => (
                <li key={`import-error-${index}`}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ResidentsImport;
