
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Apartment } from "@/services/properties";

export const useApartmentOperations = (refreshData: () => void) => {
  const { toast } = useToast();
  const [isEditingApartment, setIsEditingApartment] = useState(false);
  const [currentApartment, setCurrentApartment] = useState<Apartment | null>(null);

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

  return {
    isEditingApartment,
    setIsEditingApartment,
    currentApartment,
    openEditApartment,
    handleEditDetails,
    handleManageResidents
  };
};
