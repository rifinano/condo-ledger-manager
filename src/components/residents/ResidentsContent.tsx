
import { Resident } from "@/services/residents/types";
import { Skeleton } from "@/components/ui/skeleton";
import ResidentsTable from "./ResidentsTable";
import ResidentsSearch from "./ResidentsSearch";
import ResidentsPagination from "./ResidentsPagination";
import ResidentsImport from "./ResidentsImport";

interface FailedImport {
  rowData: string[];
  error: string;
}

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
  importErrors: string[];
  importSuccess: number;
  isImporting: boolean;
  onCreateMissingApartments?: (blockName: string, apartments: string[]) => void;
  // New props for retry functionality
  hasFailedImports?: boolean;
  failedImports?: FailedImport[];
  onRetryFailedImports?: () => void;
  isRetrying?: boolean;
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
  importErrors,
  importSuccess,
  isImporting,
  onCreateMissingApartments,
  // New props with defaults
  hasFailedImports = false,
  failedImports = [],
  onRetryFailedImports,
  isRetrying = false
}: ResidentsContentProps) => {
  return (
    <div className="space-y-4">
      <ResidentsSearch 
        searchTerm={searchTerm} 
        onSearchChange={onSearchChange} 
        disabled={isLoading}
        totalResults={residents.length}
      />
      
      <ResidentsImport 
        isImporting={isImporting} 
        importErrors={importErrors}
        importSuccess={importSuccess}
        onCreateMissingApartments={onCreateMissingApartments}
        // Pass retry props to ResidentsImport
        hasFailedImports={hasFailedImports}
        failedImports={failedImports}
        onRetryFailedImports={onRetryFailedImports}
        isRetrying={isRetrying}
      />
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[50px] w-full rounded-md" />
          <Skeleton className="h-[400px] w-full rounded-md" />
        </div>
      ) : (
        <>
          <ResidentsTable 
            residents={residents} 
            onEdit={onEdit} 
            onDelete={onDelete}
          />
          
          <ResidentsPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
};

export default ResidentsContent;
