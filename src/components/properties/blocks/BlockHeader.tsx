
import React from "react";
import { Building2 } from "lucide-react";
import { CardDescription } from "@/components/ui/card";
import { Block, Apartment } from "@/services/properties";
import DeleteBlockButton from "./DeleteBlockButton";
import BlockNameEditor from "./BlockNameEditor";

interface BlockHeaderProps {
  block: Block & { apartments: Apartment[] };
  onDeleteBlock: (blockId: string) => void;
  onUpdateBlockName: (blockId: string, newName: string) => Promise<boolean>;
  isApartmentOccupied: (blockName: string, apartmentNumber: string) => boolean;
  occupiedCount: number;
}

const BlockHeader: React.FC<BlockHeaderProps> = ({
  block,
  onDeleteBlock,
  onUpdateBlockName,
  isApartmentOccupied,
  occupiedCount
}) => {
  const handleDeleteBlock = () => {
    const hasOccupiedApartments = block.apartments.some(apt => 
      isApartmentOccupied(block.name, apt.number)
    );

    onDeleteBlock(block.id);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Building2 className="h-5 w-5 mr-2 text-syndicate-600" />
          <BlockNameEditor 
            blockId={block.id}
            blockName={block.name}
            onUpdateBlockName={onUpdateBlockName}
          />
        </div>
        <div className="flex space-x-2">
          <DeleteBlockButton onDelete={handleDeleteBlock} />
        </div>
      </div>
      <CardDescription>
        {block.apartments.length} apartments | {occupiedCount} occupied
      </CardDescription>
    </>
  );
};

export default BlockHeader;
