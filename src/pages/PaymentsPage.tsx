
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Calendar as CalendarIcon, CheckCircle2, CreditCard, 
  XCircle, Filter, Download, Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getPayments, getResidents, addPayment, Payment, Resident } from "@/services/paymentsService";

const PaymentsPage = () => {
  const { toast } = useToast();
  const [selectedBlock, setSelectedBlock] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());
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

  // Fetch payments with React Query
  const { 
    data: payments = [], 
    isLoading: isLoadingPayments,
    error: paymentsError,
    refetch: refetchPayments
  } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments
  });

  // Fetch residents with React Query
  const { 
    data: residents = [], 
    isLoading: isLoadingResidents,
    error: residentsError
  } = useQuery({
    queryKey: ['residents'],
    queryFn: getResidents
  });

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

  // Filter payments based on selected filters
  const filteredPayments = payments.filter((payment: Payment) => {
    // Filter by block
    if (selectedBlock !== "all" && payment.block !== selectedBlock) {
      return false;
    }
    
    // Filter by year
    if (selectedYear && payment.payment_for_year !== selectedYear) {
      return false;
    }
    
    // Extract month from payment_for_month (format: YYYY-MM)
    const paymentMonth = payment.payment_for_month.split('-')[1] || '';
    
    // Filter by month (if month is selected)
    if (selectedMonth && paymentMonth !== selectedMonth) {
      return false;
    }
    
    return true;
  });

  // Get unique blocks from residents
  const blocks = ["all", ...Array.from(new Set(residents.map((r: any) => r.block_number)))];
  
  const years = (() => {
    const currentYear = new Date().getFullYear();
    return [
      (currentYear - 1).toString(),
      currentYear.toString(),
      (currentYear + 1).toString()
    ];
  })();

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const paymentMethods = ["Cash", "Bank Transfer", "Check", "Credit Card", "Mobile Payment"];
  const paymentTypes = ["Rent", "Maintenance", "Deposit", "Other"];

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
      // Reset the form
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
                      <SelectContent>
                        {residents.map((resident: any) => (
                          <SelectItem key={resident.id} value={resident.id}>
                            {resident.full_name} ({resident.block_number}, Apt {resident.apartment_number})
                          </SelectItem>
                        ))}
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
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Payment Ledger</CardTitle>
                <CardDescription>View and update payment status</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blocks</SelectItem>
                    {blocks.filter(block => block !== "all").map(block => (
                      <SelectItem key={block} value={block}>{block}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
      </div>
    </DashboardLayout>
  );
};

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

export default PaymentsPage;
