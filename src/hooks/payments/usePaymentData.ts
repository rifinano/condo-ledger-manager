
import { usePaymentsFetch } from "./usePaymentsFetch";
import { usePaymentFilters } from "./usePaymentFilters";
import { usePaymentOptions } from "./usePaymentOptions";
import { usePaymentSync } from "./usePaymentSync";
import { usePaymentErrors } from "./usePaymentErrors";

/**
 * Main hook for payment data management that combines all smaller hooks
 */
export const usePaymentData = () => {
  // Fetch payment and resident data
  const {
    payments,
    residents,
    isLoadingPayments,
    isLoadingResidents,
    paymentsError,
    residentsError,
    refetchPayments,
    refetchResidents,
    refreshAllData,
  } = usePaymentsFetch();

  // Handle payment filtering
  const {
    selectedBlock,
    setSelectedBlock,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    filteredPayments,
    years,
    months,
  } = usePaymentFilters(payments);

  // Get payment options
  const {
    blocks,
    paymentMethods,
    paymentTypes,
  } = usePaymentOptions(residents);

  // Handle automatic data synchronization
  usePaymentSync(refreshAllData, refetchResidents, refetchPayments);

  // Handle error display
  usePaymentErrors(residentsError, paymentsError);

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
