
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const ChargesPage = () => {
  const { toast } = useToast();
  const [charges, setCharges] = useState([
    { id: '1', name: 'Maintenance Fee', amount: 100, description: 'Monthly maintenance fee', period: 'Monthly' },
    { id: '2', name: 'Water Fee', amount: 50, description: 'Water usage', period: 'Monthly' },
    { id: '3', name: 'Security Fee', amount: 75, description: 'Security services', period: 'Monthly' },
    { id: '4', name: 'Special Assessment', amount: 200, description: 'Building repairs', period: 'One-time' },
  ]);

  const handleExportReport = () => {
    toast({
      title: "Export initiated",
      description: "Your charges report is being generated"
    });
    
    setTimeout(() => {
      toast({
        title: "Report ready",
        description: "Charges report has been exported"
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Charges</h1>
            <p className="text-gray-500 mt-1">Manage property charges and fees</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
            
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Charge
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-md shadow overflow-hidden">
          <Table>
            <TableCaption>A list of property charges and fees.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charges.map((charge) => (
                <TableRow key={charge.id}>
                  <TableCell className="font-medium">{charge.name}</TableCell>
                  <TableCell>${charge.amount.toFixed(2)}</TableCell>
                  <TableCell>{charge.description}</TableCell>
                  <TableCell>{charge.period}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChargesPage;
