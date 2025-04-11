
import React from "react";
import { Apartment, Block } from "@/services/properties";
import BlockCard from "@/components/properties/BlockCard";
import EmptyBlocksState from "@/components/properties/EmptyBlocksState";
import BlocksLoadingSkeleton from "@/components/properties/BlocksLoadingSkeleton";

interface PropertiesContentProps {
  loading: boolean;
  blocks: (Block & { apartments: Apartment[] })[];
  onDeleteBlock: (blockId: string) => void;
  onEditApartment: (apartment: Apartment) => void;
  isApartmentOccupied: (blockName: string, apartmentNumber: string) => boolean;
  getResidentName: (blockName: string, apartmentNumber: string) => string | null;
}

const PropertiesContent: React.FC<PropertiesContentProps> = ({
  loading,
  blocks,
  onDeleteBlock,
  onEditApartment,
  isApartmentOccupied,
  getResidentName
}) => {
  if (loading) {
    return <BlocksLoadingSkeleton />;
  }
  
  if (blocks.length === 0) {
    return <EmptyBlocksState />;
  }
  
  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <BlockCard 
          key={block.id} 
          block={block} 
          onDeleteBlock={onDeleteBlock}
          onEditApartment={onEditApartment}
          isApartmentOccupied={isApartmentOccupied}
          getResidentName={getResidentName}
        />
      ))}
    </div>
  );
};

export default PropertiesContent;
