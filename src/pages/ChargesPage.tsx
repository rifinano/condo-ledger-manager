
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
import AddChargeDialog from "@/components/charges/AddChargeDialog";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useChargesData } from "@/hooks/useChargesData";
import { ErrorMessage } from "@/components/ui/error-message";

const ChargesPage = () => {
  const { toast } = useToast();
  const { 
    charges, 
    isLoading, 
    error, 
    fetchCharges, 
    handleAddCharge, 
    handleDeleteCharge 
  } = useChargesData();

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
            
            <AddChargeDialog onAddCharge={handleAddCharge} />
          </div>
        </div>

        {error ? (
          <ErrorMessage 
            title="Connection Error" 
            message="Failed to load charge data. Please check your connection and try again." 
            onRetry={fetchCharges} 
            isNetworkError={true}
          />
        ) : isLoading ? (
          <div className="bg-white rounded-md shadow p-10">
            <div className="flex items-center justify-center">
              <p className="text-gray-500">Loading charges...</p>
            </div>
          </div>
        ) : (
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
                {charges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <p className="text-gray-500">No charges found. Create a new charge to get started.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  charges.map((charge) => (
                    <TableRow key={charge.id}>
                      <TableCell className="font-medium">{charge.name}</TableCell>
                      <TableCell>${charge.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={charge.charge_type === "Resident" ? "default" : "secondary"}>
                          {charge.charge_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{charge.description || "-"}</TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ChargesPage;
