
import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { deleteAllResidents } from "@/services/residents/deleteResident";
import { useToast } from "@/hooks/use-toast";

interface DeleteAllResidentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalCount: number;
  onSuccess: () => Promise<void>;
  refreshData: () => void;
}

const DeleteAllResidentsDialog = ({
  open,
  onOpenChange,
  totalCount,
  onSuccess,
  refreshData
}: DeleteAllResidentsDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteAllResidents = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAllResidents();
      if (result.success) {
        await onSuccess();
        refreshData();
        toast({
          title: "All residents deleted",
          description: "All residents have been removed from the database",
        });
      } else {
        toast({
          title: "Error deleting residents",
          description: result.error || "An error occurred while deleting all residents",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting all residents:", error);
      toast({
        title: "Error deleting residents",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete All Residents</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all {totalCount} residents 
            and remove all their apartment associations from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDeleteAllResidents();
            }}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, delete all residents"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllResidentsDialog;
