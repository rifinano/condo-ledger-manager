
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to handle payment data loading errors
 */
export const usePaymentErrors = (
  residentsError: unknown,
  paymentsError: unknown
) => {
  const { toast } = useToast();

  // Show error toast if there's an issue fetching residents
  useEffect(() => {
    if (residentsError) {
      toast({
        title: "Error fetching residents",
        description: "Could not load resident data. Please try again later.",
        variant: "destructive"
      });
    }
    
    if (paymentsError) {
      toast({
        title: "Error fetching payments",
        description: "Could not load payment data. Please try again later.",
        variant: "destructive"
      });
    }
  }, [residentsError, paymentsError, toast]);
};
