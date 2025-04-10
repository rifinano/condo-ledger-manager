
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Calendar as CalendarIcon, CheckCircle2, CreditCard, 
  XCircle, Filter, Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Payment {
  id: string;
  residentName: string;
  block: string;
  apartment: string;
  amount: number;
  dueDate: string;
  status: "paid" | "unpaid";
  paymentDate?: string;
}

const PaymentsPage = () => {
  const { toast } = useToast();
  const [selectedBlock, setSelectedBlock] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedMonth, setSelectedMonth] = useState<string>("4"); // April by default

  // Mock data for payments
  const [payments, setPayments] = useState<Payment[]>(() => {
    // Generate 30 payment records
    return Array.from({ length: 30 }, (_, i) => {
      const blockLetter = String.fromCharCode(65 + (i % 3)); // A, B, or C
      const aptNumber = Math.floor(Math.random() * 15) + 1;
      const aptId = `${blockLetter}${aptNumber < 10 ? '0' : ''}${aptNumber}`;
      const isPaid = Math.random() > 0.3; // 70% chance of being paid
      
      const today = new Date();
      const dueDate = new Date(2025, 3, 15); // April 15, 2025
      
      const paymentDate = isPaid 
        ? new Date(2025, 3, Math.floor(Math.random() * 15) + 1) // Random date in April up to the 15th
        : undefined;
      
      return {
        id: `payment-${i + 1}`,
        residentName: `Resident ${i + 1}`,
        block: `Block ${blockLetter}`,
        apartment: aptId,
        amount: 250 + (Math.floor(Math.random() * 10) * 25), // Between $250 and $475
        dueDate: dueDate.toISOString().split('T')[0],
        status: isPaid ? "paid" : "unpaid",
        paymentDate: paymentDate?.toISOString().split('T')[0],
      };
    });
  });

  // Filter payments based on selected filters
  const filteredPayments = payments.filter(payment => {
    // Filter by block
    if (selectedBlock !== "all" && payment.block !== selectedBlock) {
      return false;
    }
    
    // Filter by year and month
    const paymentDate = new Date(payment.dueDate);
    if (
      paymentDate.getFullYear().toString() !== selectedYear ||
      paymentDate.getMonth().toString() !== selectedMonth
    ) {
      return false;
    }
    
    return true;
  });

  const blocks = ["all", "Block A", "Block B", "Block C"];
  const years = ["2023", "2024", "2025", "2026"];
  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const togglePaymentStatus = (paymentId: string) => {
    setPayments(
      payments.map(payment => {
        if (payment.id === paymentId) {
          const newStatus = payment.status === "paid" ? "unpaid" : "paid";
          const newPaymentDate = newStatus === "paid" 
            ? new Date().toISOString().split('T')[0]
            : undefined;
            
          toast({
            title: `Payment ${newStatus === "paid" ? "marked as paid" : "marked as unpaid"}`,
            description: `${payment.residentName} from ${payment.block}, Apt ${payment.apartment}`
          });
          
          return {
            ...payment,
            status: newStatus,
            paymentDate: newPaymentDate
          };
        }
        return payment;
      })
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-500 mt-1">Track and manage resident payments</p>
          </div>
          <Button variant="outline" onClick={() => toast({ title: "Report exported" })}>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
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
                    {blocks.slice(1).map(block => (
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
                  togglePaymentStatus={togglePaymentStatus} 
                  filter="all"
                />
              </TabsContent>
              
              <TabsContent value="paid" className="space-y-4">
                <PaymentsTable 
                  payments={filteredPayments.filter(p => p.status === "paid")} 
                  togglePaymentStatus={togglePaymentStatus}
                  filter="paid"
                />
              </TabsContent>
              
              <TabsContent value="unpaid" className="space-y-4">
                <PaymentsTable 
                  payments={filteredPayments.filter(p => p.status === "unpaid")} 
                  togglePaymentStatus={togglePaymentStatus}
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
  togglePaymentStatus: (id: string) => void;
  filter: "all" | "paid" | "unpaid";
}

const PaymentsTable = ({ payments, togglePaymentStatus, filter }: PaymentsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Resident</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
              No payments found for the selected criteria
            </TableCell>
          </TableRow>
        ) : (
          payments.map(payment => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.residentName}</TableCell>
              <TableCell>{payment.block}, Apt {payment.apartment}</TableCell>
              <TableCell>${payment.amount.toFixed(2)}</TableCell>
              <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={payment.status === "paid" ? "outline" : "destructive"} className={
                  payment.status === "paid" 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                }>
                  {payment.status === "paid" ? (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  ) : (
                    <XCircle className="mr-1 h-3 w-3" />
                  )}
                  {payment.status === "paid" ? "Paid" : "Unpaid"}
                </Badge>
              </TableCell>
              <TableCell>
                {payment.paymentDate 
                  ? new Date(payment.paymentDate).toLocaleDateString() 
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => togglePaymentStatus(payment.id)}
                >
                  {payment.status === "paid" ? "Mark as Unpaid" : "Mark as Paid"}
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
