
import { useQuery } from "@tanstack/react-query";
import { getPayments, getResidents } from "@/services/payments";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

/**
 * Hook to fetch payments and residents data
 */
export const usePaymentsFetch = () => {
  const { toast } = useToast();

  // Fetch payments with React Query
  const { 
    data: payments = [], 
    isLoading: isLoadingPayments,
    error: paymentsError,
    refetch: refetchPayments
  } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments,
    staleTime: 1000 * 60 * 2, // Reduce stale time to 2 minutes for fresher data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Fetch residents with React Query
  const { 
    data: residents = [], 
    isLoading: isLoadingResidents,
    error: residentsError,
    refetch: refetchResidents
  } = useQuery({
    queryKey: ['residents'],
    queryFn: getResidents,
    staleTime: 1000 * 60 * 2, // Reduce stale time to 2 minutes for fresher data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Enhanced refetch function that refreshes all data
  const refreshAllData = useCallback(async () => {
    try {
      await Promise.all([
        refetchPayments(),
        refetchResidents(),
      ]);
      
      toast({
        title: "Data refreshed",
        description: "All payment and resident data has been refreshed",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Error refreshing data",
        description: "Failed to refresh some data. Please try again.",
        variant: "destructive",
      });
    }
  }, [refetchPayments, refetchResidents, toast]);

  return {
    payments,
    residents,
    isLoadingPayments,
    isLoadingResidents,
    paymentsError,
    residentsError,
    refetchPayments,
    refetchResidents,
    refreshAllData,
  };
};
