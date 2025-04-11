
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResidentsTable from "@/components/residents/ResidentsTable";
import ResidentsPagination from "@/components/residents/ResidentsPagination";
import ResidentsSearch from "@/components/residents/ResidentsSearch";
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
}: ResidentsContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Residents ({totalCount})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <ResidentsSearch 
            searchTerm={searchTerm} 
            onSearchChange={onSearchChange} 
          />
        </div>
        
        <ResidentsTable 
          residents={residents}
          isLoading={isLoading}
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
      </CardContent>
    </Card>
  );
};

export default ResidentsContent;
