
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Payment } from "@/services/payments";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { deletePayment } from "@/services/payments";

interface PaymentsTableProps {
  payments: Payment[];
  refetchPayments: () => void;
  filter: "all" | "paid" | "unpaid";
}

const PaymentsTable = ({ payments, refetchPayments, filter }: PaymentsTableProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const handleDelete = async (paymentId: string) => {
    setIsDeleting(true);
    
    try {
      const result = await deletePayment(paymentId);
      
      if (result.success) {
        toast({
          title: "Payment deleted",
          description: "The payment has been successfully deleted",
        });
        refetchPayments();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete payment",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Error deleting payment:", error);
    } finally {
      setIsDeleting(false);
      setSelectedPayment(null);
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
          <TableHead>Actions</TableHead>
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
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit payment">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit payment</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        {/* EditPaymentForm would be imported from the external component */}
                        <p className="text-sm text-muted-foreground">
                          The edit form is handled by an external component
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" aria-label="Delete payment">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          payment record from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => payment.id && handleDelete(payment.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default PaymentsTable;
