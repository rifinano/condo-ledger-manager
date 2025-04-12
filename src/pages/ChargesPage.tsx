
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
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
import AddChargeDialog from "@/components/charges/AddChargeDialog";
import { Badge } from "@/components/ui/badge";
import { useChargesData } from "@/hooks/useChargesData";
import { ErrorMessage } from "@/components/ui/error-message";
import { Charge } from "@/services/charges";
import EditChargeForm from "@/components/charges/EditChargeForm";

const ChargesPage = () => {
  const { toast } = useToast();
  const { 
    charges, 
    isLoading, 
    error, 
    fetchCharges, 
    handleAddCharge, 
    handleDeleteCharge,
    handleUpdateCharge 
  } = useChargesData();

  const [selectedCharge, setSelectedCharge] = useState<Charge | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [chargeToDelete, setChargeToDelete] = useState<string | null>(null);

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

  const handleEditClick = (charge: Charge) => {
    setSelectedCharge(charge);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setChargeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (chargeToDelete) {
      await handleDeleteCharge(chargeToDelete);
      setIsDeleteDialogOpen(false);
      setChargeToDelete(null);
    }
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
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditClick(charge)}
                            className="h-8 px-2"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteClick(charge.id)}
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
          </div>
        )}
      </div>

      {/* Edit Charge Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Charge</DialogTitle>
            <DialogDescription>
              Update the charge details below
            </DialogDescription>
          </DialogHeader>
          
          {selectedCharge && (
            <EditChargeForm 
              charge={selectedCharge}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                toast({
                  title: "Charge updated",
                  description: "The charge has been updated successfully"
                });
              }}
              onCancel={() => setIsEditDialogOpen(false)}
              onUpdate={handleUpdateCharge}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Charge Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this charge? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ChargesPage;
