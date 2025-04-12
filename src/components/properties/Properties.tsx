
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePropertyData } from "@/hooks/usePropertyData";
import { useBlockOperations } from "@/hooks/properties/useBlockOperations";
import { useApartmentOperations } from "@/hooks/properties/useApartmentOperations";
import DeleteBlockAlert from "@/components/properties/DeleteBlockAlert";
import EditApartmentSheet from "@/components/properties/EditApartmentSheet";
import PropertiesHeader from "@/components/properties/PropertiesHeader";
import PropertiesContent from "@/components/properties/PropertiesContent";
import { ErrorMessage } from "@/components/ui/error-message";

const Properties = () => {
  const { toast } = useToast();
  const { 
    blocks, 
    loading, 
    isApartmentOccupied, 
    getResidentName,
    refreshData,
    fetchError 
  } = usePropertyData();
  
  const {
    isAddingBlock,
    setIsAddingBlock,
    isDeletingBlock,
    setIsDeletingBlock,
    currentBlockId,
    currentBlockName,
    handleAddBlock,
    confirmDeleteBlock,
    handleDeleteBlock,
    handleUpdateBlockName
  } = useBlockOperations(refreshData);

  const {
    isEditingApartment,
    setIsEditingApartment,
    currentApartment,
    openEditApartment,
    handleEditDetails,
    handleManageResidents
  } = useApartmentOperations(refreshData);

  // Manual refresh handler
  const handleManualRefresh = () => {
    refreshData();
    toast({
      title: "Data refreshed",
      description: "The property data has been refreshed.",
    });
  };

  // Check if block has residents before confirming deletion
  const handleConfirmDeleteBlock = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;
    
    // Check if any apartment in this block has residents
    const hasResidents = block.apartments.some(apt => 
      isApartmentOccupied(block.name, apt.number)
    );
    
    confirmDeleteBlock(blockId, block.name, hasResidents);
  };

  return (
    <div className="space-y-6">
      <PropertiesHeader 
        isAddingBlock={isAddingBlock}
        setIsAddingBlock={setIsAddingBlock}
        onAddBlock={handleAddBlock}
        onRefresh={handleManualRefresh}
        loading={loading}
      />

      {fetchError ? (
        <ErrorMessage 
          title="Connection Error" 
          message={fetchError} 
          onRetry={handleManualRefresh} 
          isNetworkError={true}
        />
      ) : (
        <PropertiesContent 
          loading={loading}
          blocks={blocks}
          onDeleteBlock={handleConfirmDeleteBlock}
          onEditApartment={openEditApartment}
          onUpdateBlockName={handleUpdateBlockName}
          isApartmentOccupied={isApartmentOccupied}
          getResidentName={getResidentName}
        />
      )}

      <DeleteBlockAlert 
        isOpen={isDeletingBlock}
        onOpenChange={setIsDeletingBlock}
        onConfirmDelete={handleDeleteBlock}
        blockName={currentBlockName}
      />

      <EditApartmentSheet 
        isOpen={isEditingApartment}
        onOpenChange={setIsEditingApartment}
        apartment={currentApartment}
        blocks={blocks}
        getResidentName={getResidentName}
        onEditDetails={handleEditDetails}
        onManageResidents={handleManageResidents}
      />
    </div>
  );
};

export default Properties;
