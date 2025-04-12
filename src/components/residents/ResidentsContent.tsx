
import { Loader2 } from "lucide-react";
import ResidentsTable from "./ResidentsTable";
import ResidentsSearch from "./ResidentsSearch";
import { Resident } from "@/services/residents/types";
import ResidentsPagination from "./ResidentsPagination";
import ResidentsImport from "./ResidentsImport";

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
      
      <ResidentsImport 
        isImporting={isImporting}
        importErrors={importErrors}
        importSuccess={importSuccess}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-syndicate-600" />
        </div>
      ) : residents.length > 0 ? (
        <>
          <ResidentsTable 
            residents={residents} 
            isLoading={isLoading}
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
