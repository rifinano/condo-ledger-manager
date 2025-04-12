
import { Loader2 } from "lucide-react";
import ResidentsTable from "./ResidentsTable";
import ResidentsSearch from "./ResidentsSearch";
import { Resident } from "@/services/residents/types";
import ResidentsPagination from "./ResidentsPagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ResidentsContentProps {
  residents: Resident[];
  isLoading: boolean;
  totalCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (resident: Resident) => void;
  onDelete: (resident: Resident) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  importErrors?: string[];
  importSuccess?: number;
  isImporting?: boolean;
}

const ResidentsContent = ({
  residents,
  isLoading,
  totalCount,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  importErrors = [],
  importSuccess = 0,
  isImporting = false
}: ResidentsContentProps) => {
  return (
    <div className="space-y-4">
      <ResidentsSearch 
        searchTerm={searchTerm} 
        onSearchChange={onSearchChange} 
      />
      
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
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-syndicate-600" />
        </div>
      ) : residents.length > 0 ? (
        <>
          <ResidentsTable 
            residents={residents} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
          {totalPages > 1 && (
            <ResidentsPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12 border rounded-md">
          <p className="text-gray-500">
            {totalCount === 0 ? "No residents added yet" : "No residents match your search"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResidentsContent;
