
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ResidentsTable from "./ResidentsTable";
import ResidentsSearch from "./ResidentsSearch";
import ResidentsPagination from "./ResidentsPagination";
import ResidentsImport from "./ResidentsImport";
import { Resident } from "@/services/residents/types";

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
  onCreateMissingApartments
}: ResidentsContentProps) => {
  return (
    <div className="space-y-4">
      <ResidentsImport 
        isImporting={isImporting} 
        importErrors={importErrors} 
        importSuccess={importSuccess} 
        onCreateMissingApartments={onCreateMissingApartments}
      />

      <Card className="p-4">
        <div className="mb-4">
          <ResidentsSearch value={searchTerm} onChange={onSearchChange} />
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : residents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "No residents match your search criteria." : "No residents found. Add some residents to get started."}
          </div>
        ) : (
          <>
            <ResidentsTable
              residents={residents}
              onEdit={onEdit}
              onDelete={onDelete}
            />
            
            {totalPages > 1 && (
              <div className="mt-4">
                <ResidentsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ResidentsContent;
