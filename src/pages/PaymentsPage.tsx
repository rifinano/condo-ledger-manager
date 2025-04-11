
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePaymentData } from "@/hooks/usePaymentData";
import PaymentLedger from "@/components/payments/PaymentLedger";
import AddPaymentDialog from "@/components/payments/AddPaymentDialog";

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

  // If there's an error, show it in a toast
  useEffect(() => {
    if (paymentsError) {
      toast({
        title: "Error fetching payments",
        description: "Failed to load payments. Please try again.",
        variant: "destructive",
      });
    }

    if (residentsError) {
      toast({
        title: "Error fetching residents",
        description: "Failed to load residents. Please try again.",
        variant: "destructive",
      });
    }
  }, [paymentsError, residentsError, toast]);

  const handleExportReport = () => {
    toast({
      title: "Export initiated",
      description: "Your payment report is being generated"
    });
    
    // In a real implementation, this would trigger a download of a CSV or PDF
    setTimeout(() => {
      toast({
        title: "Report ready",
        description: "Payment report has been exported"
      });
    }, 1500);
  };

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-500 mt-1">Track and manage resident payments</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
            
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
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
