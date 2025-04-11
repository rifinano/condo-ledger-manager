
import React from "react";
import { Button } from "@/components/ui/button";
import AddBlockDialog from "@/components/properties/AddBlockDialog";

interface PropertiesHeaderProps {
  isAddingBlock: boolean;
  setIsAddingBlock: (value: boolean) => void;
  onAddBlock: (name: string, apartmentCount: number) => void;
  onRefresh: () => void;
  loading: boolean;
}

const PropertiesHeader: React.FC<PropertiesHeaderProps> = ({
  isAddingBlock,
  setIsAddingBlock,
  onAddBlock,
  onRefresh,
  loading
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
        <p className="text-gray-500 mt-1">Manage your blocks and apartments</p>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          className="mr-2"
        >
          Refresh
        </Button>
        <AddBlockDialog 
          isOpen={isAddingBlock}
          onOpenChange={setIsAddingBlock}
          onAddBlock={onAddBlock}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default PropertiesHeader;
