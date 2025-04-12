
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Payment } from "@/services/payments";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import EditPaymentForm from "./EditPaymentForm";

interface PaymentsTableProps {
  payments: Payment[];
  refetchPayments: () => void;
  filter: "all" | "paid" | "unpaid";
}

const PaymentsTable = ({ payments, refetchPayments, filter }: PaymentsTableProps) => {
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPayment(null);
  };
  
  return (
    <>
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
                    onClick={() => handleEditPayment(payment)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>
              Update the payment details below
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <EditPaymentForm 
              payment={selectedPayment} 
              onSuccess={() => {
                handleDialogClose();
                refetchPayments();
                toast({
                  title: "Payment updated",
                  description: "The payment has been updated successfully"
                });
              }}
              onCancel={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentsTable;
