import { useState, useEffect } from 'react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Resident, addPayment } from "@/services/paymentsService";
import { useToast } from "@/hooks/use-toast";

interface AddPaymentDialogProps {
  residents: Resident[];
  refetchPayments: () => void;
  years: string[];
  months: { value: string; label: string }[];
  paymentTypes: string[];
  paymentMethods: string[];
}

const AddPaymentDialog = ({ 
  residents, 
  refetchPayments, 
  years, 
  months, 
  paymentTypes, 
  paymentMethods 
}: AddPaymentDialogProps) => {
  const { toast } = useToast();
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    resident_id: "",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_for_month: new Date().toISOString().split("-")[1],
    payment_for_year: new Date().getFullYear().toString(),
    payment_type: "Rent",
    payment_method: "Cash",
    notes: ""
  });

  useEffect(() => {
    console.log("Residents in AddPaymentDialog:", residents);
  }, [residents]);

  const handleAddPayment = async () => {
    if (!newPayment.resident_id || !newPayment.amount || !newPayment.payment_date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const formattedPayment = {
      ...newPayment,
      amount: parseFloat(newPayment.amount),
      payment_for_month: `${newPayment.payment_for_year}-${newPayment.payment_for_month}`,
    };

    const result = await addPayment(formattedPayment);
    
    if (result.success) {
      toast({
        title: "Payment added",
        description: "The payment has been recorded successfully"
      });
      setIsAddingPayment(false);
      refetchPayments();
      setNewPayment({
        resident_id: "",
        amount: "",
        payment_date: new Date().toISOString().split("T")[0],
        payment_for_month: new Date().toISOString().split("-")[1],
        payment_for_year: new Date().getFullYear().toString(),
        payment_type: "Rent",
        payment_method: "Cash",
        notes: ""
      });
    } else {
      toast({
        title: "Error adding payment",
        description: result.error || "Failed to add payment",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
          <DialogDescription>
            Enter payment details to record a new payment
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resident" className="text-right">
              Resident
            </Label>
            <Select 
              value={newPayment.resident_id} 
              onValueChange={(value) => setNewPayment({...newPayment, resident_id: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a resident" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto z-50 bg-white">
                {residents && residents.length > 0 ? (
                  residents.map((resident) => (
                    <SelectItem key={resident.id} value={resident.id}>
                      {resident.full_name} ({resident.block_number}, Apt {resident.apartment_number})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-residents" disabled>
                    No residents found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount ($)
            </Label>
            <Input
              id="amount"
              type="number"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment_date" className="text-right">
              Payment Date
            </Label>
            <Input
              id="payment_date"
              type="date"
              value={newPayment.payment_date}
              onChange={(e) => setNewPayment({...newPayment, payment_date: e.target.value})}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment_for_year" className="text-right">
              For Year
            </Label>
            <Select 
              value={newPayment.payment_for_year} 
              onValueChange={(value) => setNewPayment({...newPayment, payment_for_year: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment_for_month" className="text-right">
              For Month
            </Label>
            <Select 
              value={newPayment.payment_for_month} 
              onValueChange={(value) => setNewPayment({...newPayment, payment_for_month: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment_type" className="text-right">
              Payment Type
            </Label>
            <Select 
              value={newPayment.payment_type} 
              onValueChange={(value) => setNewPayment({...newPayment, payment_type: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                {paymentTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="payment_method" className="text-right">
              Payment Method
            </Label>
            <Select 
              value={newPayment.payment_method} 
              onValueChange={(value) => setNewPayment({...newPayment, payment_method: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Input
              id="notes"
              value={newPayment.notes}
              onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
              className="col-span-3"
              placeholder="Optional notes"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddingPayment(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddPayment}>
            Add Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentDialog;
