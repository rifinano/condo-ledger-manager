
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPayments, getResidents, Payment, Resident } from "@/services/paymentsService";
import { useToast } from "@/hooks/use-toast";

export const usePaymentData = () => {
  const { toast } = useToast();
  const [selectedBlock, setSelectedBlock] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());

  // Fetch payments with React Query
  const { 
    data: payments = [], 
    isLoading: isLoadingPayments,
    error: paymentsError,
    refetch: refetchPayments
  } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments
  });

  // Fetch residents with React Query
  const { 
    data: residents = [], 
    isLoading: isLoadingResidents,
    error: residentsError
  } = useQuery({
    queryKey: ['residents'],
    queryFn: getResidents
  });

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
      
      // Extract month from payment_for_month (format: YYYY-MM)
      const paymentMonth = payment.payment_for_month.split('-')[1] || '';
      
      // Filter by month (if month is selected)
      if (selectedMonth && paymentMonth !== selectedMonth) {
        return false;
      }
      
      return true;
    });
  }, [payments, selectedBlock, selectedYear, selectedMonth]);

  // Get unique blocks from residents
  const blocks = useMemo(() => {
    return ["all", ...Array.from(new Set(residents.map((r: any) => r.block_number)))];
  }, [residents]);

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
