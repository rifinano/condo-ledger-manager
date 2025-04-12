
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { ErrorMessage } from "@/components/ui/error-message";
import { Charge } from "@/services/charges";
import { useChargesData } from "@/hooks/useChargesData";
import ChargesHeader from "@/components/charges/ChargesHeader";
import ChargesTable from "@/components/charges/ChargesTable";
import ChargeDialogs from "@/components/charges/ChargeDialogs";

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
        <ChargesHeader 
          onAddCharge={handleAddCharge}
          onExportReport={handleExportReport}
        />

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
          <ChargesTable
            charges={charges}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        )}
      </div>

      <ChargeDialogs
        selectedCharge={selectedCharge}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        chargeToDelete={chargeToDelete}
        setIsEditDialogOpen={setIsEditDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        onDelete={confirmDelete}
        onUpdate={handleUpdateCharge}
      />
    </DashboardLayout>
  );
};

export default ChargesPage;
