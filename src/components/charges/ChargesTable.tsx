
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Charge } from "@/services/charges";

interface ChargesTableProps {
  charges: Charge[];
  onEditClick: (charge: Charge) => void;
  onDeleteClick: (id: string) => void;
}

const ChargesTable = ({ charges, onEditClick, onDeleteClick }: ChargesTableProps) => {
  return (
    <div className="bg-white rounded-md shadow overflow-hidden">
      <Table>
        <TableCaption>A list of property charges and fees.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Period</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {charges.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <p className="text-gray-500">No charges found. Create a new charge to get started.</p>
              </TableCell>
            </TableRow>
          ) : (
            charges.map((charge) => (
              <TableRow key={charge.id}>
                <TableCell>
                  {charge.category === "In" ? (
                    <div className="flex items-center text-green-600">
                      <ArrowUpCircle className="h-4 w-4 mr-1" />
                      <span>In</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <ArrowDownCircle className="h-4 w-4 mr-1" />
                      <span>Out</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{charge.name}</TableCell>
                <TableCell>${charge.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={charge.charge_type === "Resident" ? "default" : "secondary"}>
                    {charge.charge_type}
                  </Badge>
                </TableCell>
                <TableCell>{charge.description || "-"}</TableCell>
                <TableCell>{charge.period}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditClick(charge)}
                      className="h-8 px-2"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDeleteClick(charge.id)}
                      className="h-8 px-2"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ChargesTable;
