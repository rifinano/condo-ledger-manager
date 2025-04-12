
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Payment } from "@/services/payments";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditPaymentForm from "./EditPaymentForm";
import { deletePayment } from "@/services/payments";

interface PaymentsTableProps {
  payments: Payment[];
  refetchPayments: () => void;
  filter: "all" | "paid" | "unpaid";
}

const PaymentsTable = ({ payments, refetchPayments, filter }: PaymentsTableProps) => {
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPayment, setDeletingPayment] = useState<Payment | null>(null);

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPayment(null);
  };

  const handleDeleteClick = (payment: Payment) => {
    setDeletingPayment(payment);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPayment) return;

    const result = await deletePayment(deletingPayment.id);
    if (result.success) {
      toast({
        title: "Payment deleted",
        description: "The payment has been successfully deleted"
      });
      refetchPayments();
    } else {
      toast({
        title: "Error deleting payment",
        description: result.error || "Failed to delete the payment",
        variant: "destructive"
      });
    }
    setIsDeleteDialogOpen(false);
    setDeletingPayment(null);
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
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditPayment(payment)}
                      className="h-8 px-2"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteClick(payment)}
                      className="h-8 px-2"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Edit Payment Dialog */}
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

      {/* Delete Payment Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PaymentsTable;
