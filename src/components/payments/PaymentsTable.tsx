
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Payment } from "@/services/payments";

interface PaymentsTableProps {
  payments: Payment[];
  refetchPayments: () => void;
  filter: "all" | "paid" | "unpaid";
}

const PaymentsTable = ({ payments, refetchPayments, filter }: PaymentsTableProps) => {
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
          payments.map((payment: Payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.residentName}</TableCell>
              <TableCell>{payment.block}, Apt {payment.apartment}</TableCell>
              <TableCell>${parseFloat(payment.amount.toString()).toFixed(2)}</TableCell>
              <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
              <TableCell>{payment.payment_for_month}/{payment.payment_for_year}</TableCell>
              <TableCell>{payment.payment_method}</TableCell>
              <TableCell>{payment.payment_type}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default PaymentsTable;
