
import React, { memo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Block, Apartment } from "@/services/properties";
import BlockHeader from "./BlockHeader";
import ApartmentsList from "./ApartmentsList";
import ApartmentsPagination from "./ApartmentsPagination";

interface BlockCardProps {
  block: Block & { apartments: Apartment[] };
  onDeleteBlock: (blockId: string) => void;
  onEditApartment: (apartment: Apartment) => void;
  onUpdateBlockName: (blockId: string, newName: string) => Promise<boolean>;
  isApartmentOccupied: (blockName: string, apartmentNumber: string) => boolean;
  getResidentName: (blockName: string, apartmentNumber: string) => string | null;
}

const BlockCard: React.FC<BlockCardProps> = memo(({
  block,
  onDeleteBlock,
  onEditApartment,
  onUpdateBlockName,
  isApartmentOccupied,
  getResidentName
}) => {
  const [showAllApartments, setShowAllApartments] = React.useState(false);

  // Sort apartments by number
  const sortedApartments = React.useMemo(() => {
    return [...block.apartments].sort((a, b) => {
      const numA = parseInt(a.number.replace(/\D/g, ''), 10);
      const numB = parseInt(b.number.replace(/\D/g, ''), 10);
      return numA - numB;
    });
  }, [block.apartments]);

  // Count occupied apartments
  const occupiedCount = React.useMemo(() => {
    return block.apartments.filter(apt => 
      isApartmentOccupied(block.name, apt.number)
    ).length;
  }, [block.apartments, block.name, isApartmentOccupied]);

  // Get displayed apartments based on pagination state
  const displayedApartments = showAllApartments 
    ? sortedApartments 
    : sortedApartments.slice(0, 5);

  const toggleShowAll = () => {
    setShowAllApartments(!showAllApartments);
  };

  return (
    <Card>
      <CardHeader>
        <BlockHeader 
          block={block}
          onDeleteBlock={onDeleteBlock}
          onUpdateBlockName={onUpdateBlockName}
          isApartmentOccupied={isApartmentOccupied}
          occupiedCount={occupiedCount}
        />
      </CardHeader>
      <CardContent>
        <ApartmentsList 
          blockName={block.name}
          apartments={displayedApartments}
          isApartmentOccupied={isApartmentOccupied}
          getResidentName={getResidentName}
          onEditApartment={onEditApartment}
        />
        
        <ApartmentsPagination 
          totalCount={block.apartments.length}
          showAll={showAllApartments}
          onToggle={toggleShowAll}
        />
      </CardContent>
    </Card>
  );
});

BlockCard.displayName = "BlockCard";

export default BlockCard;
