import { Resident } from "@/services/residentsService";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Phone, Building2, Home } from "lucide-react";

interface ResidentsTableProps {
  residents: Resident[];
  isLoading: boolean;
  onEdit: (resident: Resident) => void;
  onDelete: (resident: Resident) => void;
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

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead className="w-[25%]">Phone</TableHead>
            <TableHead className="w-[35%]">Location</TableHead>
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
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                  <span>{resident.block_number}</span>
                  <span className="mx-1">/</span>
                  <Home className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                  <span>{resident.apartment_number}</span>
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
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead className="w-[25%]">Phone</TableHead>
            <TableHead className="w-[35%]">Location</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResidentsTable;
