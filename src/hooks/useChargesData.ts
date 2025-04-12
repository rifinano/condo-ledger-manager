
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCharges, Charge, addCharge, ChargeFormData, deleteCharge } from "@/services/charges";

export const useChargesData = () => {
  const { toast } = useToast();
  const [charges, setCharges] = useState<Charge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharges = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCharges();
      setCharges(data);
    } catch (err: any) {
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
      const result = await addCharge(chargeData);
      
      if (result.success) {
        fetchCharges(); // Refresh the charges list
        toast({
          title: "Charge added",
          description: "The new charge has been added successfully"
        });
        return true;
      } else {
        toast({
          title: "Error adding charge",
          description: result.error || "Failed to add charge",
          variant: "destructive"
        });
        return false;
      }
    } catch (err: any) {
      toast({
        title: "Error adding charge",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleDeleteCharge = async (id: string) => {
    try {
      const result = await deleteCharge(id);
      
      if (result.success) {
        setCharges(charges.filter(charge => charge.id !== id));
        toast({
          title: "Charge deleted",
          description: "The charge has been removed"
        });
        return true;
      } else {
        toast({
          title: "Error deleting charge",
          description: result.error || "Failed to delete charge",
          variant: "destructive"
        });
        return false;
      }
    } catch (err: any) {
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
    fetchCharges();
  }, [fetchCharges]);

  return {
    charges,
    isLoading,
    error,
    fetchCharges,
    handleAddCharge,
    handleDeleteCharge
  };
};
