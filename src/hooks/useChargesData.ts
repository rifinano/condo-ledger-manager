
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCharges, Charge, addCharge, ChargeFormData, deleteCharge, updateCharge } from "@/services/charges";

export const useChargesData = () => {
  const { toast } = useToast();
  const [charges, setCharges] = useState<Charge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharges = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching charges from database...");
      const data = await getCharges();
      console.log("Charges data retrieved:", data);
      
      // Transform data to ensure all charges have a category
      const transformedData = data.map((charge: Charge) => ({
        ...charge,
        category: charge.category || "In" // Default to "In" if not set
      }));
      
      setCharges(transformedData);
    } catch (err: any) {
      console.error("Error fetching charges:", err);
      setError(err.message || "Failed to load charges");
      toast({
        title: "Error loading charges",
        description: "There was a problem fetching the charges data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleAddCharge = async (chargeData: ChargeFormData) => {
    try {
      console.log("Adding new charge:", chargeData);
      const result = await addCharge(chargeData);
      
      if (result.success) {
        console.log("Charge added successfully, refreshing charges list");
        await fetchCharges(); // Immediately refresh the charges list after adding
        toast({
          title: "Charge added",
          description: "The new charge has been added successfully"
        });
        return true;
      } else {
        console.error("Failed to add charge:", result.error);
        toast({
          title: "Error adding charge",
          description: result.error || "Failed to add charge",
          variant: "destructive"
        });
        return false;
      }
    } catch (err: any) {
      console.error("Exception when adding charge:", err);
      toast({
        title: "Error adding charge",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleUpdateCharge = async (id: string, chargeData: ChargeFormData) => {
    try {
      console.log("Updating charge with ID:", id, chargeData);
      const result = await updateCharge(id, chargeData);
      
      if (result.success) {
        console.log("Charge updated successfully");
        await fetchCharges(); // Refresh the list after updating
        toast({
          title: "Charge updated",
          description: "The charge has been updated successfully"
        });
        return true;
      } else {
        console.error("Failed to update charge:", result.error);
        toast({
          title: "Error updating charge",
          description: result.error || "Failed to update charge",
          variant: "destructive"
        });
        return false;
      }
    } catch (err: any) {
      console.error("Exception when updating charge:", err);
      toast({
        title: "Error updating charge",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDeleteCharge = async (id: string) => {
    try {
      console.log("Deleting charge with ID:", id);
      const result = await deleteCharge(id);
      
      if (result.success) {
        console.log("Charge deleted successfully");
        await fetchCharges(); // Refresh the list after deleting
        toast({
          title: "Charge deleted",
          description: "The charge has been removed"
        });
        return true;
      } else {
        console.error("Failed to delete charge:", result.error);
        toast({
          title: "Error deleting charge",
          description: result.error || "Failed to delete charge",
          variant: "destructive"
        });
        return false;
      }
    } catch (err: any) {
      console.error("Exception when deleting charge:", err);
      toast({
        title: "Error deleting charge",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  // Fetch charges when component mounts
  useEffect(() => {
    console.log("Initial charge data fetch");
    fetchCharges();
  }, [fetchCharges]);

  return {
    charges,
    isLoading,
    error,
    fetchCharges,
    handleAddCharge,
    handleUpdateCharge,
    handleDeleteCharge
  };
};
