
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Payment, togglePaymentStatus } from "@/services/payments";

interface PaymentsTableProps {
  payments: Payment[];
  refetchPayments: () => void;
  filter: "all" | "paid" | "unpaid";
}

const PaymentsTable = ({ payments, refetchPayments, filter }: PaymentsTableProps) => {
  const { toast } = useToast();
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null);

  const handleTogglePaymentStatus = async (paymentId: string, currentStatus: boolean) => {
    try {
      setUpdatingPaymentId(paymentId);
      
      // Call the API to update the payment status
      const result = await togglePaymentStatus(paymentId, !currentStatus);
      
      if (result.success) {
        toast({
          title: `Payment ${currentStatus ? "marked as unpaid" : "marked as paid"}`,
          description: "Payment status updated successfully"
        });
        
        // Refetch the payments to update the UI
        refetchPayments();
      } else {
        toast({
          title: "Failed to update payment status",
          description: result.error || "An error occurred while updating payment status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error toggling payment status:", error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive"
      });
    } finally {
      setUpdatingPaymentId(null);
    }
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
                  onClick={() => handleTogglePaymentStatus(payment.id, payment.payment_status === "paid")}
                  disabled={updatingPaymentId === payment.id}
                >
                  {updatingPaymentId === payment.id ? "Updating..." : (payment.payment_status === "paid" ? "Mark as Unpaid" : "Mark as Paid")}
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
