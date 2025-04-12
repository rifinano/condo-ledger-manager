
import { Resident } from "@/services/residents/types";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Phone, Building2, Home, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResidentsTableProps {
  residents: Resident[];
  isLoading: boolean;
  onEdit?: (resident: Resident) => void;
  onDelete?: (resident: Resident) => void;
}

const ResidentsTable = ({ 
  residents, 
  isLoading,
  onEdit,
  onDelete
}: ResidentsTableProps) => {
  if (isLoading) {
    return <ResidentsTableSkeleton />;
  }

  if (residents.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-gray-50">
        <p className="text-muted-foreground">No residents found</p>
      </div>
    );
  }

  const formatMoveInDate = (resident: Resident) => {
    if (!resident.move_in_month || !resident.move_in_year) {
      return "Not available";
    }
    
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    // Convert string month to number (1-based) and adjust for array indexing (0-based)
    const monthIndex = parseInt(resident.move_in_month, 10) - 1;
    if (monthIndex < 0 || monthIndex >= 12) {
      return "Invalid date";
    }
    
    return `${months[monthIndex]} ${resident.move_in_year}`;
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">Name</TableHead>
            <TableHead className="w-[20%]">Phone</TableHead>
            <TableHead className="w-[20%]">Location</TableHead>
            <TableHead className="w-[20%]">Move-in Date</TableHead>
            <TableHead className="w-[15%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {residents.map((resident) => (
            <TableRow key={resident.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{resident.full_name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                  <span>{resident.phone_number || "—"}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-2">
                  {Array.isArray(resident.apartments) && resident.apartments.length > 0 ? (
                    resident.apartments.map((apt, index) => (
                      <div key={index} className="flex items-center bg-gray-100 rounded-md px-2 py-1">
                        <Building2 className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                        <span>{apt.block_number}</span>
                        <span className="mx-1">/</span>
                        <Home className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                        <span>{apt.apartment_number}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                      <span>{resident.block_number}</span>
                      <span className="mx-1">/</span>
                      <Home className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                      <span>{resident.apartment_number}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                  <span>{formatMoveInDate(resident)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {onEdit && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(resident)}
                      className="h-8 px-2"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDelete(resident)}
                      className="h-8 px-2"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ResidentsTableSkeleton = () => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">Name</TableHead>
            <TableHead className="w-[20%]">Phone</TableHead>
            <TableHead className="w-[20%]">Location</TableHead>
            <TableHead className="w-[20%]">Move-in Date</TableHead>
            <TableHead className="w-[15%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-1 rounded-full" />
                  <Skeleton className="h-4 w-8 mx-1" />
                  <Skeleton className="h-4 w-4 mx-1 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResidentsTable;
