
import { Resident } from "@/services/residentsService";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, User, Phone, Building2, Home,
  Edit, Trash2
} from "lucide-react";

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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
              Loading residents...
            </TableCell>
          </TableRow>
        ) : residents.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
              No residents found
            </TableCell>
          </TableRow>
        ) : (
          residents.map((resident) => (
            <TableRow key={resident.id}>
              <TableCell className="font-medium flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                {resident.full_name}
              </TableCell>
              <TableCell className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                {resident.phone_number || "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1 text-gray-500" />
                  {resident.block_number}
                  <span className="mx-1">/</span>
                  <Home className="h-4 w-4 mr-1 text-gray-500" />
                  {resident.apartment_number}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(resident)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => onDelete(resident)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ResidentsTable;
