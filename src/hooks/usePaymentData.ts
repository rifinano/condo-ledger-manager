
import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPayments, getResidents, Payment, Resident } from "@/services/paymentsService";
import { useToast } from "@/hooks/use-toast";
import { usePropertyData } from "@/hooks/usePropertyData";

export const usePaymentData = () => {
  const { toast } = useToast();
  const [selectedBlock, setSelectedBlock] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth() + 1 <= 9 ? `0${new Date().getMonth() + 1}` : (new Date().getMonth() + 1).toString());
  
  // Get property data to sync with
  const { blocks: propertyBlocks, refreshData: refreshPropertyData } = usePropertyData();

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
        refreshPropertyData()
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
  }, [refetchPayments, refetchResidents, refreshPropertyData, toast]);

  // Auto-refresh when the component mounts
  useEffect(() => {
    refreshAllData();
    // Set up an interval to periodically refresh data (every 5 minutes)
    const refreshInterval = setInterval(() => {
      refetchResidents();
      refetchPayments();
    }, 1000 * 60 * 5);
    
    return () => clearInterval(refreshInterval);
  }, [refreshAllData, refetchResidents, refetchPayments]);

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

  // Filter payments based on selected filters
  const filteredPayments = useMemo(() => {
    return payments.filter((payment: Payment) => {
      // Filter by block
      if (selectedBlock !== "all" && payment.block !== selectedBlock) {
        return false;
      }
      
      // Filter by year
      if (selectedYear && payment.payment_for_year !== selectedYear) {
        return false;
      }
      
      // Extract month as string with leading zero if needed
      const paymentMonth = payment.payment_for_month.split('-')[1] || payment.payment_for_month;
      
      // Filter by month (if month is selected)
      if (selectedMonth && paymentMonth !== selectedMonth) {
        return false;
      }
      
      return true;
    });
  }, [payments, selectedBlock, selectedYear, selectedMonth]);

  // Get unique blocks from both residents and properties for consistency
  const blocks = useMemo(() => {
    // Start with "all" option
    const blockSet = new Set(["all"]);
    
    // Add blocks from residents
    if (residents && residents.length > 0) {
      residents.forEach((resident: Resident) => {
        if (resident.block_number) {
          blockSet.add(resident.block_number);
        }
      });
    }
    
    // Add blocks from properties data
    if (propertyBlocks && propertyBlocks.length > 0) {
      propertyBlocks.forEach((block) => {
        if (block.name) {
          blockSet.add(block.name);
        }
      });
    }
    
    return Array.from(blockSet);
  }, [residents, propertyBlocks]);

  // Years for filtering
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [
      (currentYear - 1).toString(),
      currentYear.toString(),
      (currentYear + 1).toString()
    ];
  }, []);

  // Months for filtering
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Payment methods and types for the form
  const paymentMethods = ["Cash", "Bank Transfer", "Check", "Credit Card", "Mobile Payment"];
  const paymentTypes = ["Rent", "Maintenance", "Deposit", "Other"];

  return {
    payments,
    residents,
    filteredPayments,
    isLoadingPayments,
    isLoadingResidents,
    paymentsError,
    residentsError,
    refetchPayments,
    refetchResidents,
    refreshAllData,
    selectedBlock,
    setSelectedBlock,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    blocks,
    years,
    months,
    paymentMethods,
    paymentTypes,
  };
};
