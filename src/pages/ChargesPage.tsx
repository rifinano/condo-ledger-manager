
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2 } from "lucide-react";
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
import AddChargeDialog, { ChargeFormData } from "@/components/charges/AddChargeDialog";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Charge {
  id: string;
  name: string;
  amount: number;
  description: string;
  period: string;
  chargeType: string;
}

const ChargesPage = () => {
  const { toast } = useToast();
  const [charges, setCharges] = useState<Charge[]>([
    { id: '1', name: 'Maintenance Fee', amount: 100, description: 'Monthly maintenance fee', period: 'Monthly', chargeType: 'Resident' },
    { id: '2', name: 'Water Fee', amount: 50, description: 'Water usage', period: 'Monthly', chargeType: 'Resident' },
    { id: '3', name: 'Security Fee', amount: 75, description: 'Security services', period: 'Monthly', chargeType: 'Syndicate' },
    { id: '4', name: 'Special Assessment', amount: 200, description: 'Building repairs', period: 'One-time', chargeType: 'Syndicate' },
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

  const handleAddCharge = (chargeData: ChargeFormData) => {
    const newCharge: Charge = {
      id: Date.now().toString(), // Simple ID generation for demo
      name: chargeData.name,
      amount: parseFloat(chargeData.amount),
      description: chargeData.description,
      period: chargeData.period,
      chargeType: chargeData.chargeType
    };
    
    setCharges([...charges, newCharge]);
  };

  const handleDeleteCharge = (id: string) => {
    setCharges(charges.filter(charge => charge.id !== id));
    toast({
      title: "Charge deleted",
      description: "The charge has been removed"
    });
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
            
            <AddChargeDialog onAddCharge={handleAddCharge} />
          </div>
        </div>

        <div className="bg-white rounded-md shadow overflow-hidden">
          <Table>
            <TableCaption>A list of property charges and fees.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
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
                  <TableCell>
                    <Badge variant={charge.chargeType === "Resident" ? "default" : "secondary"}>
                      {charge.chargeType}
                    </Badge>
                  </TableCell>
                  <TableCell>{charge.description}</TableCell>
                  <TableCell>{charge.period}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem className="flex items-center">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center text-red-500"
                          onClick={() => handleDeleteCharge(charge.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
