
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { 
  Apartment, 
  addBlock, 
  deleteBlock
} from "@/services/properties";
import { usePropertyData } from "@/hooks/usePropertyData";
import DeleteBlockAlert from "@/components/properties/DeleteBlockAlert";
import EditApartmentSheet from "@/components/properties/EditApartmentSheet";
import PropertiesHeader from "@/components/properties/PropertiesHeader";
import PropertiesContent from "@/components/properties/PropertiesContent";
import { ErrorMessage } from "@/components/ui/error-message";

const PropertiesPage = () => {
  const { toast } = useToast();
  const { 
    blocks, 
    loading, 
    fetchProperties, 
    isApartmentOccupied, 
    getResidentName,
    refreshData,
    fetchError 
  } = usePropertyData();
  
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [isDeletingBlock, setIsDeletingBlock] = useState(false);
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [isEditingApartment, setIsEditingApartment] = useState(false);
  const [currentApartment, setCurrentApartment] = useState<Apartment | null>(null);

  useEffect(() => {
    // When page loads, force a complete refresh to ensure latest data
    refreshData();
  }, [refreshData]);

  const handleAddBlock = async (name: string, apartmentCount: number) => {
    if (!name || !apartmentCount) {
      toast({
        title: "Missing information",
        description: "Please provide both block name and number of apartments",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(apartmentCount) || apartmentCount <= 0) {
      toast({
        title: "Invalid input",
        description: "Number of apartments must be a positive number",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addBlock(name, apartmentCount);
      if (result) {
        await fetchProperties();
        setIsAddingBlock(false);
        
        toast({
          title: "Block added",
          description: `${name} with ${apartmentCount} apartments has been added`,
        });
      }
    } catch (error) {
      console.error("Error adding block:", error);
      toast({
        title: "Error",
        description: "Failed to add block.",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteBlock = (blockId: string) => {
    setCurrentBlockId(blockId);
    setIsDeletingBlock(true);
  };

  const handleDeleteBlock = async () => {
    if (!currentBlockId) return;
    
    try {
      const success = await deleteBlock(currentBlockId);
      if (success) {
        // Use refreshData instead of fetchProperties to clear cache
        refreshData();
        setIsDeletingBlock(false);
        setCurrentBlockId(null);
        
        toast({
          title: "Block deleted",
          description: "The block and its apartments have been deleted",
        });
      }
    } catch (error) {
      console.error("Error deleting block:", error);
      toast({
        title: "Error",
        description: "Failed to delete block.",
        variant: "destructive",
      });
    }
  };

  const openEditApartment = (apartment: Apartment) => {
    setCurrentApartment(apartment);
    setIsEditingApartment(true);
  };

  const handleEditDetails = () => {
    toast({
      title: "Coming soon",
      description: "Editing apartment details will be available in a future update.",
    });
  };

  const handleManageResidents = () => {
    setIsEditingApartment(false);
    
    // Force a data refresh when navigating to residents
    refreshData();
    
    toast({
      title: "Navigate to Residents",
      description: "To assign residents to apartments, please use the Residents page.",
    });
  };

  // Manual refresh handler
  const handleManualRefresh = () => {
    refreshData();
    fetchProperties();
    toast({
      title: "Data refreshed",
      description: "The property data has been refreshed.",
    });
  };

  return (
    <DashboardLayout>
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
          />
        ) : (
          <PropertiesContent 
            loading={loading}
            blocks={blocks}
            onDeleteBlock={confirmDeleteBlock}
            onEditApartment={openEditApartment}
            isApartmentOccupied={isApartmentOccupied}
            getResidentName={getResidentName}
          />
        )}
      </div>

      <DeleteBlockAlert 
        isOpen={isDeletingBlock}
        onOpenChange={setIsDeletingBlock}
        onConfirmDelete={handleDeleteBlock}
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
    </DashboardLayout>
  );
};

export default PropertiesPage;
