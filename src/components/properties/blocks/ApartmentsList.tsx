
import React from "react";
import { Home, User, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Apartment } from "@/services/properties";

interface ApartmentsListProps {
  blockName: string;
  apartments: Apartment[];
  isApartmentOccupied: (blockName: string, apartmentNumber: string) => boolean;
  getResidentName: (blockName: string, apartmentNumber: string) => string | null;
  onEditApartment: (apartment: Apartment) => void;
}

const ApartmentsList: React.FC<ApartmentsListProps> = ({
  blockName,
  apartments,
  isApartmentOccupied,
  getResidentName,
  onEditApartment
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Apartment</TableHead>
          <TableHead>Resident</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apartments.map((apt) => (
          <ApartmentRow
            key={apt.id}
            apartment={apt}
            blockName={blockName}
            isOccupied={isApartmentOccupied(blockName, apt.number)}
            residentName={getResidentName(blockName, apt.number)}
            onEdit={() => onEditApartment(apt)}
          />
        ))}
      </TableBody>
    </Table>
  );
};

interface ApartmentRowProps {
  apartment: Apartment;
  blockName: string;
  isOccupied: boolean;
  residentName: string | null;
  onEdit: () => void;
}

const ApartmentRow: React.FC<ApartmentRowProps> = ({
  apartment,
  isOccupied,
  residentName,
  onEdit
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium flex items-center">
        <Home className="h-4 w-4 mr-2 text-gray-500" />
        {apartment.number}
      </TableCell>
      <TableCell>
        {residentName ? (
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1 text-syndicate-600" />
            {residentName}
          </div>
        ) : (
          <span className="text-gray-400">No resident</span>
        )}
      </TableCell>
      <TableCell>
        <OccupancyStatus isOccupied={isOccupied} />
      </TableCell>
      <TableCell className="text-right">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

const OccupancyStatus: React.FC<{ isOccupied: boolean }> = ({ isOccupied }) => {
  if (isOccupied) {
    return (
      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
        Occupied
      </span>
    );
  }
  
  return (
    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
      Vacant
    </span>
  );
};

export default ApartmentsList;
