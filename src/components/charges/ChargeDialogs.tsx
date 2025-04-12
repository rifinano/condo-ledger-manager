
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
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
import { useToast } from "@/hooks/use-toast";
import { Charge, ChargeFormData } from "@/services/charges";
import EditChargeForm from "./EditChargeForm";

interface ChargeDialogsProps {
  selectedCharge: Charge | null;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  chargeToDelete: string | null;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  onDelete: () => Promise<void>;
  onUpdate: (id: string, data: ChargeFormData) => Promise<boolean>;
}

const ChargeDialogs = ({
  selectedCharge,
  isEditDialogOpen,
  isDeleteDialogOpen,
  chargeToDelete,
  setIsEditDialogOpen,
  setIsDeleteDialogOpen,
  onDelete,
  onUpdate
}: ChargeDialogsProps) => {
  const { toast } = useToast();

  return (
    <>
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
              onUpdate={onUpdate}
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
            <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChargeDialogs;
