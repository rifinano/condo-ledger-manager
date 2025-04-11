
import { useMemo, useState } from "react";
import { Payment } from "@/services/paymentsService";

/**
 * Hook to manage payment filters
 */
export const usePaymentFilters = (payments: Payment[]) => {
  const [selectedBlock, setSelectedBlock] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth() + 1 <= 9 ? `0${new Date().getMonth() + 1}` : (new Date().getMonth() + 1).toString());
  
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

  return {
    selectedBlock,
    setSelectedBlock,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    filteredPayments,
    years,
    months,
  };
};
