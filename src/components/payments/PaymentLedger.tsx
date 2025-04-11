
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentsTable from "./PaymentsTable";
import PaymentFilters from "./PaymentFilters";
import { Payment } from "@/services/paymentsService";

interface PaymentLedgerProps {
  payments: Payment[];
  refetchPayments: () => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedBlock: string;
  setSelectedBlock: (block: string) => void;
  years: string[];
  months: { value: string; label: string }[];
  blocks: string[];
  filteredPayments: Payment[];
}

const PaymentLedger = ({
  refetchPayments,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedBlock,
  setSelectedBlock,
  years,
  months,
  blocks,
  filteredPayments,
}: PaymentLedgerProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payment Ledger</CardTitle>
            <CardDescription>View and update payment status</CardDescription>
          </div>
          <PaymentFilters
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedBlock={selectedBlock}
            setSelectedBlock={setSelectedBlock}
            years={years}
            months={months}
            blocks={blocks}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <PaymentsTable 
              payments={filteredPayments} 
              refetchPayments={refetchPayments}
              filter="all"
            />
          </TabsContent>
          
          <TabsContent value="paid" className="space-y-4">
            <PaymentsTable 
              payments={filteredPayments.filter((p: Payment) => p.payment_method === "paid")} 
              refetchPayments={refetchPayments}
              filter="paid"
            />
          </TabsContent>
          
          <TabsContent value="unpaid" className="space-y-4">
            <PaymentsTable 
              payments={filteredPayments.filter((p: Payment) => p.payment_method !== "paid")} 
              refetchPayments={refetchPayments}
              filter="unpaid"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentLedger;
