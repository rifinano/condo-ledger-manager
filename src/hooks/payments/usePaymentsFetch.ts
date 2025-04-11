
import { useQuery } from "@tanstack/react-query";
import { getPayments, getResidents } from "@/services/payments";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { useNetworkErrorHandler } from "@/hooks/useNetworkErrorHandler";

/**
 * Hook to fetch payments and residents data
 */
export const usePaymentsFetch = () => {
  const { toast } = useToast();
  const { handleNetworkError } = useNetworkErrorHandler();

  // Fetch payments with React Query - removed onError property and using onSettled instead
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
    retry: 2,
    meta: {
      onError: (error: any) => handleNetworkError(error, "Failed to fetch payments")
    }
  });

  // Fetch residents with React Query - removed onError property and using onSettled instead
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
    retry: 2,
    meta: {
      onError: (error: any) => handleNetworkError(error, "Failed to fetch residents")
    }
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
      handleNetworkError(error, "Failed to refresh data. Please try again.");
    }
  }, [refetchPayments, refetchResidents, toast, handleNetworkError]);

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
