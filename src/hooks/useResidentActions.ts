
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  addResident, 
  updateResident, 
  deleteResident, 
  ResidentFormData,
  Resident
} from "@/services/residentsService";

/**
 * Hook to manage resident CRUD operations
 */
export const useResidentActions = (
  fetchResidents: () => Promise<void>,
  resetForm: () => void
) => {
  const { toast } = useToast();

  const handleAddResident = useCallback(async (
    currentResident: Partial<ResidentFormData>,
    setIsAddingResident: (value: boolean) => void
  ) => {
    if (!currentResident.full_name || !currentResident.block_number || !currentResident.apartment_number) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    try {
      const result = await addResident(currentResident as ResidentFormData);
      
      if (result.success) {
        setIsAddingResident(false);
        resetForm();
        await fetchResidents();
        toast({
          title: "Resident added",
          description: `${currentResident.full_name} has been added to ${currentResident.block_number}, ${currentResident.apartment_number}`
        });
        return true;
      } else {
        toast({
          title: "Error adding resident",
          description: result.error || "An error occurred while adding the resident",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error in handleAddResident:", error);
      toast({
        title: "Error adding resident",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  }, [fetchResidents, resetForm, toast]);

  const handleUpdateResident = useCallback(async (
    selectedResidentId: string | null,
    currentResident: Partial<ResidentFormData>,
    setIsEditingResident: (value: boolean) => void
  ) => {
    if (!selectedResidentId || !currentResident.full_name || !currentResident.block_number || !currentResident.apartment_number) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    try {
      const result = await updateResident(selectedResidentId, currentResident as ResidentFormData);
      
      if (result.success) {
        setIsEditingResident(false);
        resetForm();
        await fetchResidents();
        toast({
          title: "Resident updated",
          description: `${currentResident.full_name}'s information has been updated`
        });
        return true;
      } else {
        toast({
          title: "Error updating resident",
          description: result.error || "An error occurred while updating the resident",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error in handleUpdateResident:", error);
      toast({
        title: "Error updating resident",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  }, [fetchResidents, resetForm, toast]);

  const handleDeleteResident = useCallback(async (
    selectedResidentId: string | null,
    setIsDeletingResident: (value: boolean) => void
  ) => {
    if (!selectedResidentId) {
      toast({
        title: "Error deleting resident",
        description: "Resident ID is missing",
        variant: "destructive"
      });
      return false;
    }

    try {
      const result = await deleteResident(selectedResidentId);
      
      if (result.success) {
        setIsDeletingResident(false);
        await fetchResidents();
        toast({
          title: "Resident deleted",
          description: "The resident has been removed"
        });
        return true;
      } else {
        toast({
          title: "Error deleting resident",
          description: result.error || "An error occurred while deleting the resident",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error in handleDeleteResident:", error);
      toast({
        title: "Error deleting resident",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  }, [fetchResidents, toast]);

  const editResident = useCallback((
    resident: Resident,
    setSelectedResidentId: (id: string) => void,
    setCurrentResident: (resident: Partial<ResidentFormData>) => void,
    setIsEditingResident: (value: boolean) => void
  ) => {
    setSelectedResidentId(resident.id);
    setCurrentResident({
      full_name: resident.full_name,
      phone_number: resident.phone_number || "",
      block_number: resident.block_number,
      apartment_number: resident.apartment_number,
      move_in_month: new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`,
      move_in_year: new Date().getFullYear().toString()
    });
    setIsEditingResident(true);
  }, []);

  const confirmDeleteResident = useCallback((
    resident: Resident,
    setSelectedResidentId: (id: string) => void,
    setCurrentResident: (resident: Partial<ResidentFormData>) => void,
    setIsDeletingResident: (value: boolean) => void
  ) => {
    setSelectedResidentId(resident.id);
    setCurrentResident({
      full_name: resident.full_name,
      block_number: resident.block_number,
      apartment_number: resident.apartment_number
    });
    setIsDeletingResident(true);
  }, []);

  return {
    handleAddResident,
    handleUpdateResident,
    handleDeleteResident,
    editResident,
    confirmDeleteResident
  };
};
