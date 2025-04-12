
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ResidentsImportProps {
  isImporting: boolean;
  importErrors: string[];
  importSuccess: number;
}

const ResidentsImport = ({
  isImporting,
  importErrors,
  importSuccess
}: ResidentsImportProps) => {
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
      
      {importErrors.length > 0 && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Import Errors</AlertTitle>
          <AlertDescription className="text-red-700">
            <p>The following errors occurred during import:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {importErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ResidentsImport;
