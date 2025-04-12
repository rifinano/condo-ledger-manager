
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { usePaymentData } from "@/hooks/usePaymentData";
import PaymentLedger from "@/components/payments/PaymentLedger";
import AddPaymentDialog from "@/components/payments/AddPaymentDialog";
import { ErrorMessage } from "@/components/ui/error-message";

const PaymentsPage = () => {
  const { toast } = useToast();
  const {
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
  } = usePaymentData();

  // Fetch data when component mounts
  useEffect(() => {
    // The data is automatically fetched by the useQuery hooks
  }, []);

  if (isLoadingPayments || isLoadingResidents) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Loading...</h2>
            <p className="text-gray-500">Please wait while we fetch your payment data</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Check for data loading errors
  const hasError = paymentsError || residentsError;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-500 mt-1">Track and manage resident payments</p>
          </div>
          <div className="flex space-x-2">
            <AddPaymentDialog 
              residents={residents} 
              refetchPayments={refetchPayments}
              years={years}
              months={months}
              paymentTypes={paymentTypes}
              paymentMethods={paymentMethods}
            />
          </div>
        </div>

        {hasError ? (
          <ErrorMessage 
            title="Connection Error" 
            message="Failed to load payment data. Please check your connection and try again." 
            onRetry={refreshAllData} 
            isNetworkError={true}
          />
        ) : (
          <PaymentLedger
            payments={payments}
            refetchPayments={refetchPayments}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedBlock={selectedBlock}
            setSelectedBlock={setSelectedBlock}
            years={years}
            months={months}
            blocks={blocks}
            filteredPayments={filteredPayments}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
