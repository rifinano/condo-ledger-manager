
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Payment } from "@/services/paymentsService";

interface PaymentsTableProps {
  payments: Payment[];
  refetchPayments: () => void;
  filter: "all" | "paid" | "unpaid";
}

const PaymentsTable = ({ payments, refetchPayments, filter }: PaymentsTableProps) => {
  const { toast } = useToast();

  const handleTogglePaymentStatus = async (paymentId: string, currentStatus: boolean) => {
    // This would be replaced with a real API call
    toast({
      title: `Payment ${currentStatus ? "marked as unpaid" : "marked as paid"}`,
      description: "Payment status updated successfully"
    });
    
    // In a real app, we would call the API to update the payment status
    // For now, just refetch the payments
    refetchPayments();
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Resident</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Date</TableHead>
          <TableHead>For Period</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
              No payments found for the selected criteria
            </TableCell>
          </TableRow>
        ) : (
          payments.map((payment: Payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.residentName}</TableCell>
              <TableCell>{payment.block}, Apt {payment.apartment}</TableCell>
              <TableCell>${parseFloat(payment.amount.toString()).toFixed(2)}</TableCell>
              <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
              <TableCell>{payment.payment_for_month}/{payment.payment_for_year}</TableCell>
              <TableCell>{payment.payment_method}</TableCell>
              <TableCell>{payment.payment_type}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleTogglePaymentStatus(payment.id, payment.payment_method === "paid")}
                >
                  {payment.payment_method === "paid" ? "Mark as Unpaid" : "Mark as Paid"}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default PaymentsTable;
